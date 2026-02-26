import {
    Alert, FlatList, StatusBar, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { categories } from '../Data/categoriesData'

const Budget = () => {
    const { expenses, budgets, setBudget } = useContext(AppContext)
    const [editingCat, setEditingCat] = useState(null)
    const [inputValue, setInputValue] = useState('')

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
        if (!val || val <= 0) { Alert.alert('Error', 'Enter a valid budget amount'); return }
        setBudget(catName, val)
        setEditingCat(null)
        setInputValue('')
    }

    const allCategories = categories.map(cat => ({
        ...cat,
        spent: spentByCategory[cat.name] || 0,
        budget: budgets?.[cat.name] || 0,
    }))

    const renderItem = ({ item }) => {
        const pct = item.budget > 0 ? Math.min((item.spent / item.budget) * 100, 100) : 0
        const isOver = item.spent > item.budget && item.budget > 0
        const isEditing = editingCat === item.name
        const barColor = isOver ? '#ff5a5a' : pct > 75 ? '#f59e0b' : '#00f59b'

        return (
            <View style={styles.card}>
                {/* Left color accent */}
                <View style={[styles.cardAccent, { backgroundColor: item.color || '#6b7280' }]} />

                <View style={styles.cardBody}>
                    {/* Row 1: icon + name + edit button */}
                    <View style={styles.cardHeader}>
                        <View style={styles.catLeft}>
                            <View style={[styles.catIconBg, { backgroundColor: (item.color || '#6b7280') + '22' }]}>
                                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                            </View>
                            <View>
                                <Text style={styles.catName}>{item.name}</Text>
                                {isOver && <Text style={styles.overLabel}>⚠️ Over budget!</Text>}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => { setEditingCat(item.name); setInputValue(item.budget > 0 ? item.budget.toString() : '') }}
                            style={styles.editBtn}
                        >
                            <Ionicons
                                name={item.budget > 0 ? 'pencil' : 'add'}
                                size={16} color="#00f59b"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Edit input */}
                    {isEditing && (
                        <View style={styles.editRow}>
                            <TextInput
                                style={styles.editInput}
                                keyboardType="decimal-pad"
                                placeholder="Budget amount"
                                placeholderTextColor="#475569"
                                value={inputValue}
                                onChangeText={setInputValue}
                                autoFocus
                            />
                            <TouchableOpacity onPress={() => handleSaveBudget(item.name)} style={styles.saveBtn}>
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEditingCat(null)}>
                                <Ionicons name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Spent / Budget amounts */}
                    <View style={styles.amountRow}>
                        <Text style={styles.spentText}>
                            Spent: <Text style={styles.spentVal}>${item.spent.toFixed(2)}</Text>
                        </Text>
                        <Text style={styles.budgetText}>
                            {item.budget > 0 ? `Budget: $${item.budget.toFixed(2)}` : 'No limit set'}
                        </Text>
                    </View>

                    {/* Progress bar */}
                    {item.budget > 0 && (
                        <View style={styles.progressBg}>
                            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                        </View>
                    )}
                </View>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
            <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.title}>Budget</Text>
                    <Text style={styles.subtitle}>Set monthly limits per category</Text>
                </View>
                <FlatList
                    data={allCategories}
                    keyExtractor={item => item.name}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0a0a14' },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { color: '#f1f5f9', fontSize: 26, fontWeight: '800' },
    subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
    listContent: { paddingHorizontal: 16, paddingBottom: 120 },

    card: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardAccent: { width: 4 },
    cardBody: { flex: 1, padding: 14 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    catLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    catIconBg: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    catName: { color: '#f1f5f9', fontWeight: '700', fontSize: 14 },
    overLabel: { color: '#ff5a5a', fontSize: 10, marginTop: 2 },
    editBtn: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: 'rgba(0,245,155,0.1)',
        borderWidth: 1, borderColor: 'rgba(0,245,155,0.3)',
        justifyContent: 'center', alignItems: 'center',
    },

    editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    editInput: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: '#00f59b',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#f1f5f9',
        fontSize: 14,
    },
    saveBtn: {
        backgroundColor: '#00f59b',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    saveBtnText: { color: '#0a0a14', fontWeight: '700', fontSize: 13 },

    amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    spentText: { color: '#94a3b8', fontSize: 12 },
    spentVal: { color: '#f1f5f9', fontWeight: '600' },
    budgetText: { color: '#94a3b8', fontSize: 12 },

    progressBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: 6,
        borderRadius: 3,
        minWidth: 4,
    },
})

export default Budget
