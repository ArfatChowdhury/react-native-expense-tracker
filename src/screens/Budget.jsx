import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import tailwind from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { categories } from '../Data/categoriesData'

const Budget = () => {
    const { expenses, budgets, setBudget } = useContext(AppContext)
    const [editingCat, setEditingCat] = useState(null)
    const [inputValue, setInputValue] = useState('')

    // Spending per category this month
    const now = new Date()
    const monthExpenses = expenses.filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const spentByCategory = monthExpenses.reduce((acc, e) => {
        const name = e.category?.name || 'Other'
        acc[name] = (acc[name] || 0) + Number(e.amount)
        return acc
    }, {})

    const handleSaveBudget = (catName) => {
        const val = parseFloat(inputValue)
        if (!val || val <= 0) {
            Alert.alert('Error', 'Enter a valid budget amount')
            return
        }
        setBudget(catName, val)
        setEditingCat(null)
        setInputValue('')
    }

    const displayCategories = categories.map(cat => ({
        ...cat,
        spent: spentByCategory[cat.name] || 0,
        budget: budgets?.[cat.name] || 0,
    })).filter(c => c.budget > 0 || c.spent > 0)

    const allCategories = categories.map(cat => ({
        ...cat,
        spent: spentByCategory[cat.name] || 0,
        budget: budgets?.[cat.name] || 0,
    }))

    const renderItem = ({ item }) => {
        const pct = item.budget > 0 ? Math.min((item.spent / item.budget) * 100, 100) : 0
        const isOver = item.spent > item.budget && item.budget > 0
        const isEditing = editingCat === item.name

        return (
            <View style={tailwind`bg-white rounded-2xl p-4 mx-5 mb-3 shadow-sm`}>
                <View style={tailwind`flex-row justify-between items-center mb-2`}>
                    <View style={tailwind`flex-row items-center`}>
                        <Text style={tailwind`text-2xl mr-2`}>{item.icon}</Text>
                        <Text style={tailwind`font-bold text-gray-800`}>{item.name}</Text>
                        {isOver && <Text style={tailwind`ml-2 text-xs text-red-500`}>⚠️ Over!</Text>}
                    </View>
                    <TouchableOpacity onPress={() => { setEditingCat(item.name); setInputValue(item.budget > 0 ? item.budget.toString() : '') }}>
                        <Ionicons name={item.budget > 0 ? 'pencil' : 'add-circle-outline'} size={20} color="#16a34a" />
                    </TouchableOpacity>
                </View>

                {isEditing ? (
                    <View style={tailwind`flex-row items-center gap-2 mb-2`}>
                        <TextInput
                            style={tailwind`flex-1 border-2 border-green-400 rounded-xl px-3 py-2 text-base`}
                            keyboardType="decimal-pad"
                            placeholder="Budget amount"
                            value={inputValue}
                            onChangeText={setInputValue}
                            autoFocus
                        />
                        <TouchableOpacity onPress={() => handleSaveBudget(item.name)} style={tailwind`bg-green-500 px-4 py-2 rounded-xl`}>
                            <Text style={tailwind`text-white font-bold`}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditingCat(null)}>
                            <Ionicons name="close" size={22} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={tailwind`flex-row justify-between mb-1`}>
                    <Text style={tailwind`text-sm text-gray-500`}>
                        Spent: <Text style={tailwind`font-semibold text-gray-800`}>${item.spent.toFixed(2)}</Text>
                    </Text>
                    <Text style={tailwind`text-sm text-gray-500`}>
                        {item.budget > 0 ? `Budget: $${item.budget.toFixed(2)}` : 'No budget set'}
                    </Text>
                </View>

                {item.budget > 0 && (
                    <View style={tailwind`bg-gray-200 rounded-full h-2 mt-1`}>
                        <View style={[
                            tailwind`h-2 rounded-full`,
                            { width: `${pct}%`, backgroundColor: isOver ? '#ef4444' : item.color }
                        ]} />
                    </View>
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
            <View style={tailwind`px-5 pt-3 pb-4`}>
                <Text style={tailwind`text-2xl font-bold text-gray-900`}>Budget</Text>
                <Text style={tailwind`text-sm text-gray-400 mt-1`}>Set monthly limits per category</Text>
            </View>

            <FlatList
                data={allCategories}
                keyExtractor={item => item.name}
                renderItem={renderItem}
                contentContainerStyle={tailwind`pb-8`}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    )
}

export default Budget
