import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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
    const handleAddExpense = (navigation) => {
        if (!title || !amount || !category) {
            Alert.alert('All fields are required')
            return
        }
        const newExpense = {
            title,
            category,
            amount,
            icon: category.icon,
            date: new Date().toISOString().split('T')[0],
            id: Date.now().toString()
        }
        // setExpenses(...expenses, newExpense)
        setExpenses(prevExpenses => [...prevExpenses, newExpense])
        setAmount('');
        setTitle('');
        setCategory({});
        console.log('addeddddddd', amount,title,category);
        navigation.navigate('Home');
        
    }
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0)

    const value = { handleAddExpense, category, setCategory, title, setTitle, amount, setAmount , expenses, setExpenses, setNavigation, totalSpent}
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}