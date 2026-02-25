import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

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
            const [storedExpenses, storedIncomes, storedBudgets, storedCurrency] = await Promise.all([
                AsyncStorage.getItem('expenses'),
                AsyncStorage.getItem('incomes'),
                AsyncStorage.getItem('budgets'),
                AsyncStorage.getItem('currency'),
            ]);
            if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
            if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
            if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
            if (storedCurrency) setCurrencyState(storedCurrency);
        } catch (error) {
            console.log('Error loading data:', error);
            Alert.alert('Error', 'Failed to load your data');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Expense CRUD ──────────────────────────────────────────
    const handleAddExpense = (navigation) => {
        if (!title || !amount || !category?.name) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        const newExpense = {
            id: Date.now().toString(),
            title: title.trim(),
            category,
            amount: parseFloat(parseFloat(amount).toFixed(2)),
            icon: category.icon,
            date: new Date().toISOString().split('T')[0],
        };
        setExpenses(prev => [newExpense, ...prev]);
        resetForm();
        navigation.navigate('Home');
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
        budgets, setBudget,
        currency, setCurrency,
        // Derived
        totalSpent, totalIncome, balance,
        // Expense actions
        handleAddExpense, handleEdit, handleUpdateExpense, handleDelete,
        // Income actions
        handleAddIncome, handleDeleteIncome,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};