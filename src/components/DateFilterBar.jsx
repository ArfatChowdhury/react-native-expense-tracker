import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, SHADOW } from '../theme'

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
            {PERIODS.map(p => (
                <TouchableOpacity
                    key={p.value}
                    onPress={() => onSelect(p.value)}
                    style={[
                        styles.btn,
                        selectedPeriod === p.value ? styles.btnActive : styles.btnInactive
                    ]}
                >
                    <Text style={[
                        styles.btnText,
                        selectedPeriod === p.value ? styles.btnTextActive : styles.btnTextInactive
                    ]}>
                        {p.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 20, gap: 12, paddingVertical: 15, flexDirection: 'row' },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    btnActive: {
        backgroundColor: COLORS.black,
        borderColor: COLORS.black,
        ...SHADOW.md,
    },
    btnInactive: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        ...SHADOW.sm,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '800',
    },
    btnTextActive: {
        color: COLORS.white,
    },
    btnTextInactive: {
        color: COLORS.textSub,
    },
})

export default DateFilterBar
