import {
    Alert, ScrollView, StatusBar, StyleSheet,
    Text, TextInput, TouchableOpacity, View
} from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'

const INCOME_SOURCES = [
    { name: 'Salary', icon: '💼' },
    { name: 'Freelance', icon: '💻' },
    { name: 'Business', icon: '🏢' },
    { name: 'Investment', icon: '📈' },
    { name: 'Gift', icon: '🎁' },
    { name: 'Rental', icon: '🏠' },
    { name: 'Bonus', icon: '🎯' },
    { name: 'Other', icon: '💰' },
]

const AddIncome = ({ navigation }) => {
    const { handleAddIncome, incomes, handleDeleteIncome, totalIncome } = useContext(AppContext)
    const [amount, setAmount] = useState('')
    const [source, setSource] = useState('')
    const [selectedSource, setSelectedSource] = useState(null)
    const [activeField, setActiveField] = useState(null)

    const handleSubmit = () => {
        handleAddIncome({ amount, source: source || selectedSource?.name || '', date: null, navigation })
    }

    const handleSelectSource = (src) => {
        setSelectedSource(src)
        setSource(src.name)
    }

    const confirmDelete = (id) => {
        Alert.alert('Delete Income', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => handleDeleteIncome(id) }
        ])
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
            <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Add Income</Text>
                        <Text style={styles.headerSub}>Record your earnings</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Total Income banner */}
                    <View style={styles.bannerWrap}>
                        <LinearGradient
                            colors={['rgba(0,245,155,0.15)', 'rgba(0,212,170,0.08)']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.banner}
                        >
                            <View style={styles.bannerInner}>
                                <Ionicons name="arrow-down-circle" size={32} color="#00f59b" />
                                <View style={styles.bannerText}>
                                    <Text style={styles.bannerLabel}>Total Income</Text>
                                    <Text style={styles.bannerAmount}>${totalIncome.toFixed(2)}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Amount */}
                    <Text style={styles.label}>Amount</Text>
                    <View style={[styles.inputWrap, activeField === 'amount' && styles.inputWrapFocused]}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            placeholder="0.00"
                            placeholderTextColor="#475569"
                            style={styles.amountInput}
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                            onFocus={() => setActiveField('amount')}
                            onBlur={() => setActiveField(null)}
                        />
                    </View>

                    {/* Source chips */}
                    <Text style={[styles.label, { marginTop: 20 }]}>Source</Text>
                    <View style={styles.chipsWrap}>
                        {INCOME_SOURCES.map(src => {
                            const isSelected = selectedSource?.name === src.name
                            return (
                                <TouchableOpacity
                                    key={src.name}
                                    onPress={() => handleSelectSource(src)}
                                    style={[styles.chip, isSelected && styles.chipSelected]}
                                >
                                    <Text style={styles.chipIcon}>{src.icon}</Text>
                                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                        {src.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    {/* Custom source */}
                    <TextInput
                        placeholder="Or type a custom source…"
                        placeholderTextColor="#475569"
                        style={[styles.textInput, activeField === 'source' && styles.textInputFocused]}
                        value={source}
                        onChangeText={t => { setSource(t); setSelectedSource(null) }}
                        onFocus={() => setActiveField('source')}
                        onBlur={() => setActiveField(null)}
                    />

                    {/* Submit */}
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitWrap}>
                        <LinearGradient
                            colors={['#00f59b', '#00d4aa']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.submitBtn}
                        >
                            <Ionicons name="add" size={20} color="#0a0a14" />
                            <Text style={styles.submitText}>Add Income</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Income history */}
                    {incomes.length > 0 && (
                        <>
                            <Text style={styles.historyTitle}>Income History</Text>
                            {incomes.map(item => (
                                <View key={item.id} style={styles.historyCard}>
                                    <View style={styles.historyLeft}>
                                        <View style={styles.historyIconWrap}>
                                            <Text style={{ fontSize: 18 }}>💰</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.historySource}>{item.source}</Text>
                                            <Text style={styles.historyDate}>{item.date}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.historyRight}>
                                        <Text style={styles.historyAmount}>+${item.amount}</Text>
                                        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={{ marginTop: 4 }}>
                                            <Ionicons name="trash-outline" size={14} color="#ff5a5a" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0a0a14' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    backBtn: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: '800' },
    headerSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },

    content: { paddingHorizontal: 16, paddingBottom: 60 },

    bannerWrap: { borderRadius: 18, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(0,245,155,0.2)' },
    banner: { borderRadius: 18, padding: 20 },
    bannerInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    bannerText: {},
    bannerLabel: { color: '#94a3b8', fontSize: 12 },
    bannerAmount: { color: '#00f59b', fontSize: 32, fontWeight: '900', marginTop: 2 },

    label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },

    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 14,
        paddingHorizontal: 16,
    },
    inputWrapFocused: { borderColor: '#00f59b' },
    currencySymbol: { color: '#00f59b', fontSize: 22, fontWeight: '700', marginRight: 4 },
    amountInput: { flex: 1, color: '#f1f5f9', fontSize: 28, fontWeight: '700', paddingVertical: 14 },

    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    chipSelected: { backgroundColor: 'rgba(0,245,155,0.15)', borderColor: '#00f59b' },
    chipIcon: { fontSize: 14 },
    chipText: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
    chipTextSelected: { color: '#00f59b', fontWeight: '700' },

    textInput: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#f1f5f9',
        fontSize: 15,
        marginBottom: 24,
    },
    textInputFocused: { borderColor: '#00f59b' },

    submitWrap: {
        borderRadius: 16, overflow: 'hidden',
        shadowColor: '#00f59b', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
        marginBottom: 28,
    },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
    submitText: { color: '#0a0a14', fontWeight: '800', fontSize: 16 },

    historyTitle: { color: '#f1f5f9', fontWeight: '700', fontSize: 15, marginBottom: 12 },
    historyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    historyIconWrap: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: 'rgba(0,245,155,0.12)',
        justifyContent: 'center', alignItems: 'center',
    },
    historySource: { color: '#f1f5f9', fontWeight: '600', fontSize: 14 },
    historyDate: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
    historyRight: { alignItems: 'flex-end' },
    historyAmount: { color: '#00f59b', fontWeight: '700', fontSize: 15 },
})

export default AddIncome
