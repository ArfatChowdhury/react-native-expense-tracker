import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";



export const AppContext = createContext()


export const AppContextProvider = ({ children }) => {

    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState('')
    const [title, setTitle] = useState('')
    const [navigation, setNavigation] = useState(null);
    const [category, setCategory] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null)
    
    useEffect(() => {
        loadExpensesFromStorage();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveExpensesToStorage();
        }
    }, [expenses]);

    const loadExpensesFromStorage = async () => {
        try {
            const storedExpenses = await AsyncStorage.getItem('expenses');
            if (storedExpenses) {
                setExpenses(JSON.parse(storedExpenses));
            }
        } catch (error) {
            console.log('Error loading expenses:', error);
            Alert.alert('Error', 'Failed to load expenses');
        } finally {
            setIsLoading(false);
        }
    };
    const saveExpensesToStorage = async () => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
        } catch (error) {
            console.log('Error saving expenses:', error);
            Alert.alert('Error', 'Failed to save expenses');
        }
    };
    const handleEdit = async (updatedItem) => {

        setTitle(updatedItem.title)
        setAmount(updatedItem.amount.toString())
        setCategory(updatedItem.category)
        setEditingId(updatedItem.id)

        return true;
    

    }
    const handleDelete = async (id) => {
        try {
            if (!expenses || !Array.isArray(expenses)) {
                console.log('expenses data not available');
                return;
            }
            const UpdatedData = expenses.filter(item => item.id !== id)
            setExpenses(UpdatedData)
            await AsyncStorage.setItem('expenses', JSON.stringify(UpdatedData))
        } catch (error) {
            console.log(error);

        }
    }
    const handleUpdateExpense = (navigation) => {
        if (!title || !amount || !category.name) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
    
        const updatedExpenses = expenses.map(expense => {
            if (expense.id === editingId) {
                return {
                    ...expense,
                    title: title,
                    amount: parseFloat(amount),
                    category: category,
                    icon: category.icon
                };
            }
            return expense;
        });
    
        setExpenses(updatedExpenses);
        
        
        setAmount('');
        setTitle('');
        setCategory({});
        setEditingId(null);
        
        navigation.navigate('Home');
        
        // Alert.alert('Success', 'Expense updated successfully!');
    };
    const handleAddExpense = (navigation) => {
        if (!title || !amount || !category) {
            Alert.alert('All fields are required')
            return
        }
        const newExpense = {
            title,
            category,
            amount: parseFloat(amount),
            icon: category.icon,
            date: new Date().toISOString().split('T')[0],
            id: Date.now().toString()
        }
        // setExpenses(...expenses, newExpense)
        setExpenses(prevExpenses => [...prevExpenses, newExpense])
        setAmount('');
        setTitle('');
        setCategory({});
        // console.log('addeddddddd', amount,title,category);
        navigation.navigate('Home');

    }
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0)

    const value = { handleAddExpense, category, setCategory, title, setTitle, amount, setAmount, expenses, setExpenses, setNavigation, totalSpent, handleDelete, handleEdit, editingId,setEditingId , handleUpdateExpense}
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}