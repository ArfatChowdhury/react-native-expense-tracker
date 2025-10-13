import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const RenderItemCard = ({ item }) => {
    return (
        <Pressable style={tailwind`flex-1 items-center p-4 m-2 bg-white shadow-lg rounded-xl`}>
            <Text style={tailwind`text-4xl mb-1`}>{item.icon}</Text>
            <Text style={tailwind`mt-2 text-center text-sm font-medium text-gray-700`}>{item.name}</Text>
        </Pressable>
    )
}

export default RenderItemCard