import { createContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from "../Data/categoriesData";

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    // ── Expenses ──────────────────────────────────────────────
    const [expenses, setExpenses] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // ── Income ────────────────────────────────────────────────
    const [incomes, setIncomes] = useState([])

    // ── Budgets & Preferences ────────────────────────────────
    const [budgets, setBudgets] = useState({}) // { 'Food': 200, 'Bills': 150, ... }
    const [currency, setCurrencyState] = useState('USD')
    const [isDarkMode, setIsDarkMode] = useState(false)

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

    const loadData = async () => {
        try {
            const [storedExpenses, storedIncomes, storedBudgets, storedCurrency, storedDarkMode] = await Promise.all([
                AsyncStorage.getItem('expenses'),
                AsyncStorage.getItem('incomes'),
                AsyncStorage.getItem('budgets'),
                AsyncStorage.getItem('currency'),
                AsyncStorage.getItem('isDarkMode'),
            ]);
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
            if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
            if (storedCurrency) setCurrencyState(storedCurrency);
            if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode));
        } catch (error) {
            console.log('Error loading data:', error);
            Alert.alert('Error', 'Failed to load your data');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Expense CRUD ──────────────────────────────────────────
    const handleAddExpense = ({ title: t, amount: amt, category: cat, date: d, navigation }) => {
        if (!t || !amt || !cat?.name) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        const newExpense = {
            id: Date.now().toString(),
            title: t.trim(),
            category: cat,
            amount: parseFloat(parseFloat(amt).toFixed(2)),
            icon: cat.icon,
            date: d || new Date().toISOString().split('T')[0],
        };
        setExpenses(prev => [newExpense, ...prev]);
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
        setExpenses(prev =>
            prev.map(e =>
                e.id === editingId
                    ? { ...e, title: title.trim(), amount: parseFloat(parseFloat(amount).toFixed(2)), category, icon: category.icon }
                    : e
            )
        );
        resetForm();
        navigation.navigate('Home');
    };

    const handleDelete = (id) => {
        setExpenses(prev => prev.filter(item => item.id !== id));
    };

    // ── Income CRUD ───────────────────────────────────────────
    const handleAddIncome = ({ amount: amt, source, date, navigation }) => {
        if (!amt || parseFloat(amt) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (!source.trim()) {
            Alert.alert('Error', 'Please enter an income source');
            return;
        }
        const newIncome = {
            id: Date.now().toString(),
            amount: parseFloat(parseFloat(amt).toFixed(2)),
            source: source.trim(),
            date: date || new Date().toISOString().split('T')[0],
        };
        setIncomes(prev => [newIncome, ...prev]);
        navigation.goBack();
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
            // Basic update for now: just replace in incomes array
            setIncomes(prev => prev.map(inv => inv.id === editingId ? { ...inv, source: t, amount: parseFloat(amt) } : inv));
        } else {
            handleUpdateExpense(navigation);
            return; // handleUpdateExpense already handles navigation
        }
        resetForm();
        navigation.navigate('Home');
    };

    // ── Budget actions ─────────────────────────────────────
    const setBudget = (categoryName, limit) => {
        const newBudgets = { ...budgets, [categoryName]: limit };
        setBudgets(newBudgets);
        AsyncStorage.setItem('budgets', JSON.stringify(newBudgets)).catch(e =>
            console.log('Error saving budgets:', e)
        );
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

    // ── Derived values ────────────────────────────────────────
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
    const balance = totalIncome - totalSpent;

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
        return categories.map(cat => {
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
    }, [expenses, budgets]);

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
        // Date filter
        selectedPeriod, setSelectedPeriod,
        filteredExpenses,
        // Budget & Preferences
        budgets, setBudget, setBudgets,
        currency, setCurrency,
        isDarkMode, toggleDarkMode,
        // Derived
        totalSpent, totalIncome, balance,
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