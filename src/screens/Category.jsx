import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const Category = ({navigation}) => {
  return (
    <View style={tailwind`px-5 mt-2`}>
      <View >
        <Pressable onPress={()=> navigation.goBack()} >
        <Text style={tailwind`text-2xl font-bold`}>X</Text>
        </Pressable>
        <Text style={tailwind`text-3xl font-bold mt-4 `}>Select Category</Text>
        <Text style={tailwind`text-base mt-2 text-gray-500 `}>Select a category that describes what you spent money on</Text>
      </View>
    </View>
  )
}

export default Category