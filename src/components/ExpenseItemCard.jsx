import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const ExpenseItemCard = ({ item }) => {
    return (
        <View style={tailwind`bg-white my-3 justify-center p-4  justify-between  rounded-xl `}>

            <View style={tailwind`flex-row items-center`}>
                <View style={tailwind` w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4`} >
                    <Text>{'🍔'}</Text>
                </View>
                <View style={tailwind`flex-1`}>
                    <Text style={tailwind`text-base font-bold text-gray-800`}>{'Food'}</Text>
                    <View style={tailwind`mt-1 px-2 py-1 rounded-lg bg-orange-400 self-start`}>
                        <Text style={tailwind`text-xs font-bold text-gray-700`}>{'category'}</Text>
                    </View>

                </View>
                <View style={tailwind`items-end`} >
                    <Text style={tailwind`font-bold text-base text-black`}>{'$300'}</Text>
                    <Text style={tailwind`text-xs text-gray-500 mt-1`}>{'2024-12-08'}</Text>
                </View>
            </View>
        </View>
    )
}

export default ExpenseItemCard

const styles = StyleSheet.create({})