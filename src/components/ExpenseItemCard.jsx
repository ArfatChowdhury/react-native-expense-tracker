import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'


const ExpenseItemCard = ({ item, handleDelete, handleEdit }) => {

const navigation = useNavigation()
const handleEditPress =() =>{

    handleEdit(item)
    navigation.navigate('Create')
}
    return (
        <View style={tailwind`bg-white my-3 justify-center p-4  justify-between  rounded-xl `}>

            <View style={tailwind`flex-row items-center`}>
                <View style={tailwind` w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4`} >
                    <Text style={tailwind`text-2xl`}>{item.icon}</Text>
                </View>
                <View style={tailwind`flex-1`}>
                    <Text style={tailwind`text-base font-bold text-gray-800`}>{item.title}</Text>
                    <View style={[tailwind`mt-1 px-2 py-1 rounded-lg  self-start`,{backgroundColor: item.category?.color}]}>
                        <Text style={tailwind`text-xs font-bold text-gray-700`}>{item.category.name}</Text>
                    </View>

                </View>
                <View style={tailwind`items-end`} >
                    <Text style={tailwind`font-bold text-base text-black`}>${item.amount}</Text>
                    <Text style={tailwind`text-xs text-gray-500 mt-1`}>{item.date}</Text>
                    <TouchableOpacity onPress={()=> handleDelete(item.id)}>
                        <Ionicons name='trash' size={24} color={'red'}/>
                    </TouchableOpacity>
                    <Pressable onPress={handleEditPress}>
                        <Text>Edit</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default ExpenseItemCard

const styles = StyleSheet.create({})