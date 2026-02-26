import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AppContext } from '../Contex/ContextApi'

const RenderInsightitem = ({ item }) => {
    const { totalSpent } = useContext(AppContext)
    const pct = totalSpent > 0 ? Math.round((item.amount / totalSpent) * 100) : 0
    const catColor = item.category?.color || '#6b7280'

    return (
        <View style={styles.row}>
            {/* Colored dot indicator */}
            <View style={[styles.dot, { backgroundColor: catColor }]} />

            {/* Category name */}
            <Text style={styles.catName} numberOfLines={1}>{item.category?.name}</Text>

            {/* Progress bar */}
            <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: catColor }]} />
            </View>

            {/* % badge */}
            <View style={[styles.pctBadge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
                <Text style={[styles.pctText, { color: catColor }]}>{pct}%</Text>
            </View>

            {/* Amount */}
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dot: { width: 10, height: 10, borderRadius: 5 },
    catName: { color: '#f1f5f9', fontWeight: '600', fontSize: 13, width: 80 },
    barBg: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barFill: { height: 6, borderRadius: 3, minWidth: 4 },
    pctBadge: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    pctText: { fontSize: 10, fontWeight: '700' },
    amount: { color: '#f1f5f9', fontWeight: '700', fontSize: 13, width: 70, textAlign: 'right' },
})

export default RenderInsightitem