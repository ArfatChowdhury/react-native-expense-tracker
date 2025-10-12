import { View, Text } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const EmptyList = ({ title, message }) => {
    return (
        <View style={tailwind`items-center`}>
            <Text style={tailwind`text-6xl my-2`}>📝</Text>
            <Text style={tailwind`text-2xl font-bold mb-2`}>{title || 'no expenses yet!'}</Text>
            <Text style={tailwind`text-base text-gray-500`}>{message || 'add new expense to see your list'}</Text>
        </View>
    )
}

export default EmptyList