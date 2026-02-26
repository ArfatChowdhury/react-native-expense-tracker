import { Text, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const EmptyList = () => {
    return (
        <View style={tailwind`flex-1 items-center justify-center py-16`}>
            <Text style={tailwind`text-5xl mb-4`}>💸</Text>
            <Text style={tailwind`text-lg font-bold text-gray-600`}>No transactions yet</Text>
            <Text style={tailwind`text-sm text-gray-400 mt-1 text-center px-8`}>
                Tap "Add" below to record your first expense
            </Text>
        </View>
    )
}

export default EmptyList