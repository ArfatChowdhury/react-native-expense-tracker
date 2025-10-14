import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import tailwind from 'twrnc'
import { AppContext } from '../Contex/ContextApi'

const RenderInsightitem = ({ item }) => {
    const { totalSpent } = useContext(AppContext)
    const amount = Number(item.amount)
    const percentage = ((amount / totalSpent) * 100).toFixed(0)
    console.log(percentage);
    
    return (
        <View style={tailwind`px-5 mt-6 border-b border-gray-300`}>
            <View style={tailwind`flex-row justify-between`}>
                <View style={tailwind`flex-row `}>
                    <Text style={[tailwind`rounded-full mr-3 my-2`, { backgroundColor: item.category.color }]}>   </Text>
                    <Text style={tailwind` text-base text-gray-700 my-2`}>{item.category?.name}</Text>
                </View>
                <View style={tailwind`items-end`}>
                    <Text style={tailwind`font-bold text-base`}>${item.amount}</Text>
                    <Text style={tailwind` text-base `}>{percentage}%</Text>
                </View>
            </View>
        </View>
    )
}

export default RenderInsightitem