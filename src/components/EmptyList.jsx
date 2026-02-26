import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EmptyList = () => {
    return (
        <View style={styles.wrap}>
            <Text style={styles.emoji}>🪙</Text>
            <Text style={styles.title}>No transactions yet</Text>
            <Text style={styles.sub}>Tap "Add Expense" or "+ Income" to get started</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        paddingVertical: 60,
        alignItems: 'center',
        gap: 8,
    },
    emoji: { fontSize: 52, marginBottom: 8 },
    title: { color: '#94a3b8', fontSize: 17, fontWeight: '700' },
    sub: { color: '#475569', fontSize: 13, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
})

export default EmptyList