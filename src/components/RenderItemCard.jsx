import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const RenderItemCard = ({ item, handleCategory }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleCategory(item)}
            activeOpacity={0.75}
        >
            <View style={[styles.iconWrap, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
                <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    iconWrap: {
        width: 52, height: 52, borderRadius: 14,
        borderWidth: 1.5,
        justifyContent: 'center', alignItems: 'center',
    },
    icon: { fontSize: 26 },
    name: { color: '#f1f5f9', fontWeight: '600', fontSize: 13, textAlign: 'center' },
    colorBar: { height: 4, width: 30, borderRadius: 2 },
})

export default RenderItemCard