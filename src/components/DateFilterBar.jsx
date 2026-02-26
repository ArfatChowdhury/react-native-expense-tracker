import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const PERIODS = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'All Time', value: 'all' },
]

const DateFilterBar = ({ selectedPeriod, onSelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {PERIODS.map(p => {
                const isActive = selectedPeriod === p.value
                return (
                    <TouchableOpacity
                        key={p.value}
                        onPress={() => onSelect(p.value)}
                        style={[styles.pill, isActive && styles.pillActive]}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
    },
    pillActive: {
        backgroundColor: '#00f59b',
        borderColor: '#00f59b',
        shadowColor: '#00f59b',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    pillText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    pillTextActive: { color: '#0a0a14', fontWeight: '700' },
})

export default DateFilterBar
