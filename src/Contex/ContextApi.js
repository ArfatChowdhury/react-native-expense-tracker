import { useNavigation } from "@react-navigation/native";
import { createContext, useState } from "react";
import { Alert } from "react-native";



export const AppContext = createContext()


export const AppContextProvider = ({ children }) => {
    
    const [expenses, setExpenses] = useState([])
    const [amount, setAmount] = useState('')
    const [title, setTitle] = useState('')
    const [navigation, setNavigation] = useState(null);
    const [category, setCategory] = useState({})
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

    const value = { handleAddExpense, category, setCategory, title, setTitle, amount, setAmount , expenses, setExpenses, setNavigation}
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}