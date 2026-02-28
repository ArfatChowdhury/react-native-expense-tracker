import { createContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from "../Data/categoriesData";
import { registerForPushNotificationsAsync, scheduleBudgetAlert, scheduleMonthlySummaryAlert } from "../services/NotificationService";

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    // ── Expenses ──────────────────────────────────────────────
    const [expenses, setExpenses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [categoriesList, setCategoriesList] = useState(categories)

    // ── Income ────────────────────────────────────────────────
    const [incomes, setIncomes] = useState([])

    // ── Budgets & Preferences ────────────────────────────────
    const [budgets, setBudgets] = useState({}) // { 'Food': 200, 'Bills': 150, ... }
    const [currency, setCurrencyState] = useState('USD')
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isFirstLaunch, setIsFirstLaunch] = useState(null) // null for initial loading
    const [userName, setUserNameState] = useState('');
    const [recurringTransactions, setRecurringTransactions] = useState([]);

    const getCurrencySymbol = (code) => {
        const symbols = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥',
            'AUD': 'A$', 'CAD': 'C$', 'BDT': '৳', 'CNY': '¥', 'SGD': 'S$',
            'AED': 'د.إ', 'SAR': '﷼', 'RUB': '₽', 'BRL': 'R$', 'CHF': 'Fr',
            'TRY': '₺', 'KRW': '₩', 'ZAR': 'R', 'PKR': '₨', 'EGP': 'E£'
        };
        return symbols[code] || '$';
    };

    const getYearMonth = (date = new Date()) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    const currencySymbol = getCurrencySymbol(currency);

    // ── Form state ────────────────────────────────────────────
    const [amount, setAmount] = useState('')
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState({})
    const [editingId, setEditingId] = useState(null)

    // ── Date filter ───────────────────────────────────────────
    const [selectedPeriod, setSelectedPeriod] = useState('all')

    // ── Load on mount ─────────────────────────────────────────
    useEffect(() => {
        loadData();
        registerForPushNotificationsAsync();
        scheduleMonthlySummaryAlert();
    }, []);

    // ── Persist expenses whenever they change ─────────────────
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem('expenses', JSON.stringify(expenses)).catch(e =>
                console.log('Error saving expenses:', e)
            );
        }
    }, [expenses]);

    // ── Persist incomes whenever they change ──────────────────
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem('incomes', JSON.stringify(incomes)).catch(e =>
                console.log('Error saving incomes:', e)
            );
        }
    }, [incomes]);

    // ── Persist categories whenever they change ───────────────
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem('customCategories', JSON.stringify(categoriesList)).catch(e =>
                console.log('Error saving categories:', e)
            );
        }
    }, [categoriesList]);

    const loadData = async () => {
        try {
            const [storedExpenses, storedIncomes, storedBudgets, storedCurrency, storedDarkMode, storedCategories, storedFirstLaunch, storedUserName, storedRecurring, storedLastProcessed] = await Promise.all([
                AsyncStorage.getItem('expenses'),
                AsyncStorage.getItem('incomes'),
                AsyncStorage.getItem('budgets'),
                AsyncStorage.getItem('currency'),
                AsyncStorage.getItem('isDarkMode'),
                AsyncStorage.getItem('customCategories'),
                AsyncStorage.getItem('isFirstLaunch'),
                AsyncStorage.getItem('userName'),
                AsyncStorage.getItem('recurringTransactions'),
                AsyncStorage.getItem('lastProcessedMonth'),
            ]);
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
            if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
            if (storedCurrency) setCurrencyState(storedCurrency);
            if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
            if (storedCategories) setCategoriesList(JSON.parse(storedCategories));

            // Recurring logic
            const recurring = storedRecurring ? JSON.parse(storedRecurring) : [];
            setRecurringTransactions(recurring);

            // Onboarding logic: default to true if never set
            setIsFirstLaunch(storedFirstLaunch === null ? true : JSON.parse(storedFirstLaunch));
            if (storedUserName) setUserNameState(storedUserName);

            // Auto-log recurring items for current month if not done
            const currentMonthYear = getYearMonth();
            if (storedLastProcessed !== currentMonthYear && recurring.length > 0) {
                // Before processing new month, save previous month's summary for comparison
                if (storedLastProcessed) {
                    await cachePreviousMonthSummary(storedExpenses, storedIncomes, storedLastProcessed);
                }
                processRecurring(recurring, currentMonthYear);
            }
        } catch (error) {
            console.log('Error loading data:', error);
            Alert.alert('Error', 'Failed to load your data');
        } finally {
            setIsLoading(false);
        }
    };

    const cachePreviousMonthSummary = async (expensesStr, incomesStr, monthYear) => {
        try {
            const exps = expensesStr ? JSON.parse(expensesStr) : [];
            const incs = incomesStr ? JSON.parse(incomesStr) : [];

            const monthExps = exps.filter(e => e.date.startsWith(monthYear));
            const monthIncs = incs.filter(i => i.date.startsWith(monthYear));

            const totalE = monthExps.reduce((sum, e) => sum + Number(e.amount), 0);
            const totalI = monthIncs.reduce((sum, i) => sum + Number(i.amount), 0);

            const summary = {
                monthYear,
                totalSpent: totalE,
                totalIncome: totalI,
                savings: totalI - totalE
            };

            await AsyncStorage.setItem('prevMonthSummary', JSON.stringify(summary));
        } catch (e) {
            console.log('Error caching monthly summary:', e);
        }
    };

    const processRecurring = async (recurring, monthYear) => {
        const newExpenses = [];
        const newIncomes = [];
        const date = `${monthYear}-01`;

        recurring.forEach(item => {
            const transaction = {
                id: `recurring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: item.title,
                amount: parseFloat(item.amount),
                category: item.category,
                icon: item.category?.icon || '📦',
                date: date,
            };
            if (item.type === 'income') newIncomes.push(transaction);
            else newExpenses.push(transaction);
        });

        if (newExpenses.length > 0) setExpenses(prev => [...newExpenses, ...prev]);
        if (newIncomes.length > 0) setIncomes(prev => [...newIncomes, ...prev]);

        await AsyncStorage.setItem('lastProcessedMonth', monthYear);
    };

    const addRecurringTransaction = async (item) => {
        setRecurringTransactions(prev => {
            const newItem = {
                ...item,
                id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
            };
            const updated = [...prev, newItem];
            AsyncStorage.setItem('recurringTransactions', JSON.stringify(updated));
            return updated;
        });
    };

    const deleteRecurringTransaction = async (id) => {
        setRecurringTransactions(prev => {
            const updated = prev.filter(item => item.id !== id);
            AsyncStorage.setItem('recurringTransactions', JSON.stringify(updated));
            return updated;
        });
    };

    const updateRecurringTransaction = async (id, updatedItem) => {
        setRecurringTransactions(prev => {
            const updated = prev.map(item => item.id === id ? { ...item, ...updatedItem } : item);
            AsyncStorage.setItem('recurringTransactions', JSON.stringify(updated));
            return updated;
        });
    };

    const completeOnboarding = async () => {
        try {
            const currentMonth = getYearMonth();

            // 1. Process recurring items immediately so they appear on dashboard
            // We read from the current state. They should be there since they were added in previous screens.
            if (recurringTransactions.length > 0) {
                processRecurring(recurringTransactions, currentMonth);
            }

            // 2. Persist onboarding status
            await AsyncStorage.multiSet([
                ['isFirstLaunch', JSON.stringify(false)],
                ['lastProcessedMonth', currentMonth]
            ]);

            setIsFirstLaunch(false);
        } catch (e) {
            console.error('Error completing onboarding', e);
        }
    };

    const setUserName = async (name) => {
        setUserNameState(name);
        await AsyncStorage.setItem('userName', name);
    };

    // ── Category CRUD ─────────────────────────────────────────
    const handleAddCategory = (newCat) => {
        setCategoriesList(prev => [newCat, ...prev]);
    };

    // ── Expense CRUD ──────────────────────────────────────────
    const handleAddExpense = ({ title: t, amount: amt, category: cat, date: d, navigation }) => {
        if (!t || !amt || !cat?.name) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        const newExpense = {
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: t.trim(),
            category: cat,
            amount: parseFloat(parseFloat(amt).toFixed(2)),
            icon: cat.icon,
            date: d || new Date().toISOString().split('T')[0],
            type: 'expense'
        };
        setExpenses(prev => {
            const updated = [newExpense, ...prev];

            // Check budget alert
            const budgetLimit = budgets[cat.name] || 0;
            if (budgetLimit > 0) {
                const totalInCat = updated
                    .filter(e => e.category?.name === cat.name)
                    .reduce((sum, e) => sum + Number(e.amount), 0);

                if (totalInCat > budgetLimit) {
                    scheduleBudgetAlert(cat.name, totalInCat, budgetLimit);
                }
            }
            return updated;
        });
        resetForm();
        if (navigation) navigation.navigate('Home');
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setAmount(item.amount.toString());
        setCategory(item.category);
        setEditingId(item.id);
    };

    const handleUpdateExpense = (navigation) => {
        if (!title || !amount || !category?.name) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        setExpenses(prev => {
            const updated = prev.map(e =>
                e.id === editingId
                    ? { ...e, title: title.trim(), amount: parseFloat(parseFloat(amount).toFixed(2)), category, icon: category.icon }
                    : e
            );

            // Check budget alert for the category
            const budgetLimit = budgets[category.name] || 0;
            if (budgetLimit > 0) {
                const totalInCat = updated
                    .filter(e => e.category?.name === category.name)
                    .reduce((sum, e) => sum + Number(e.amount), 0);

                if (totalInCat > budgetLimit) {
                    scheduleBudgetAlert(category.name, totalInCat, budgetLimit);
                }
            }
            return updated;
        });
        resetForm();
        navigation.navigate('Home');
    };

    const handleDelete = (id) => {
        setExpenses(prev => prev.filter(item => item.id !== id));
    };

    // ── Income CRUD ───────────────────────────────────────────
    const handleAddIncome = async ({ amount, source, date, navigation }) => {
        if (!amount || !source) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const newIncome = {
            id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            source: source.trim(),
            amount: parseFloat(parseFloat(amount).toFixed(2)),
            date: date || new Date().toISOString().split('T')[0],
            type: 'income',
            icon: '💰'
        };
        setIncomes(prev => [newIncome, ...prev]);
        resetForm();
        if (navigation) navigation.navigate('Home');
    };

    const handleDeleteIncome = (id) => {
        setIncomes(prev => prev.filter(item => item.id !== id));
    };

    const handleAddTransaction = (navigation, { type, title: t, amount: amt, category: cat, date: d }) => {
        if (type === 'income') {
            handleAddIncome({ amount: amt, source: t, date: d, navigation });
        } else {
            handleAddExpense({ title: t, amount: amt, category: cat, date: d, navigation });
        }
    };

    const handleUpdateTransaction = (navigation, { type, title: t, amount: amt, category: cat }) => {
        if (type === 'income') {
            setIncomes(prev => prev.map(inv => inv.id === editingId ? { ...inv, source: t, amount: parseFloat(amt) } : inv));
        } else {
            handleUpdateExpense(navigation);
            return;
        }
        resetForm();
        navigation.navigate('Home');
    };

    // ── Budget actions ─────────────────────────────────────
    const setBudget = (categoryName, limit) => {
        setBudgets(prev => {
            const newBudgets = { ...prev, [categoryName]: limit };
            AsyncStorage.setItem('budgets', JSON.stringify(newBudgets)).catch(e =>
                console.log('Error saving budgets:', e)
            );
            return newBudgets;
        });
    };

    const setCurrency = (c) => {
        setCurrencyState(c);
        AsyncStorage.setItem('currency', c).catch(e => console.log('Error saving currency:', e));
    };

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        AsyncStorage.setItem('isDarkMode', JSON.stringify(newMode)).catch(e => console.log('Error saving dark mode:', e));
    };

    // ── Derived values (Monthly First) ────────────────────────
    const currentMonth = getYearMonth();

    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const monthlyIncomes = incomes.filter(i => i.date.startsWith(currentMonth));

    const totalSpent = monthlyExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalIncome = monthlyIncomes.reduce((sum, item) => sum + Number(item.amount), 0);
    const balance = totalIncome - totalSpent;

    // Smart Insights
    const monthlySummary = useMemo(() => {
        const topCatItem = monthlyExpenses.reduce((acc, curr) => {
            const catName = curr.category?.name || 'Uncategorized';
            acc[catName] = (acc[catName] || 0) + Number(curr.amount);
            return acc;
        }, {});

        const topCategoryName = Object.keys(topCatItem).sort((a, b) => topCatItem[b] - topCatItem[a])[0] || 'None';

        const now = new Date();
        const today = now.getDate();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const isClosingTime = today >= lastDay - 2; // Last 3 days
        const isLastDay = today === lastDay;
        const isPreClosing = isClosingTime && !isLastDay;

        return {
            topCategory: topCategoryName,
            isClosingTime,
            isLastDay,
            isPreClosing,
            savings: balance,
            isDebt: balance < 0
        };
    }, [monthlyExpenses, balance]);

    const filteredExpenses = (() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        if (selectedPeriod === 'today') {
            return expenses.filter(e => e.date === todayStr);
        }
        if (selectedPeriod === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return expenses.filter(e => new Date(e.date) >= weekAgo);
        }
        if (selectedPeriod === 'month') {
            return expenses.filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        }
        return expenses; // 'all'
    })();

    // ── Derived Budgets ───────────────────────────────────────
    const categoriesWithBudget = useMemo(() => {
        return categoriesList.map(cat => {
            const budgetLimit = budgets[cat.name] || 0;
            const amountSpent = expenses
                .filter(exp => exp.category?.name === cat.name)
                .reduce((sum, exp) => sum + Number(exp.amount), 0);

            return {
                ...cat,
                budgetLimit,
                amountSpent
            };
        });
    }, [expenses, budgets, categoriesList]);

    // ── Helpers ───────────────────────────────────────────────
    const resetForm = () => {
        setAmount('');
        setTitle('');
        setCategory({});
        setEditingId(null);
    };

    const value = {
        // State
        expenses, setExpenses,
        incomes, setIncomes,
        amount, setAmount,
        title, setTitle,
        category, setCategory,
        editingId, setEditingId,
        isLoading,
        categoriesList,
        // Category actions
        handleAddCategory,
        // Date filter
        selectedPeriod, setSelectedPeriod,
        filteredExpenses,
        // Budget & Preferences
        budgets, setBudget, setBudgets,
        currency, setCurrency,
        isDarkMode, toggleDarkMode,
        isFirstLaunch, completeOnboarding,
        userName, setUserName,
        recurringTransactions, setRecurringTransactions, addRecurringTransaction, deleteRecurringTransaction, updateRecurringTransaction,
        currencySymbol,
        // Derived
        allTransactions: [
            ...expenses.map(e => ({ ...e, type: 'expense' })),
            ...incomes.map(i => ({ ...i, type: 'income', title: i.source, category: { name: 'Income', icon: '💰' } }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)),
        totalSpent, totalIncome, balance,
        monthlySummary,
        categoriesWithBudget,
        // Expense actions
        handleAddExpense, handleEdit, handleUpdateExpense, handleDelete,
        // Income actions
        handleAddIncome, handleDeleteIncome,
        // Unified Actions
        handleAddTransaction, handleUpdateTransaction,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
