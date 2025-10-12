import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tailwind from 'twrnc'

const Create = ({ navigation }) => {
  const [activeField, setActiveField] = useState(null);
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const handleAddExpense = () => {

  }
  const handleCategoryInput = () => {
    navigation.navigate('Category')
  }
  return (
    <View style={tailwind`flex-1 px-5  mt-4`}>
      <View style={tailwind`my-4`}>
        <Text style={tailwind`text-3xl font-bold mb-2`}>Add new expenses</Text>
        <Text style={tailwind`text-base text-gray-500`}>Enter the details of your expenses to help you track your spending.</Text>
      </View>
      <View style={tailwind`mb-3`}>
        <Text style={tailwind`mb-2 text-black font-semibold`}>Enter Amount</Text>
        <TextInput
          placeholder='$0.00'
          style={tailwind`border-2 rounded-xl ${activeField === 'amount' ? 'border-blue-400' : 'border-gray-400'
            } p-4 text-lg mb-4`}
          onFocus={() => setActiveField('amount')}
          onBlur={() => setActiveField(null)}
          keyboardType='decimal-pad'
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View style={tailwind`mb-3`}>
        <Text style={tailwind`mb-2 text-black font-semibold`}>Title</Text>
        <TextInput
          placeholder='What was it for?'
          style={tailwind`border-2 rounded-xl ${activeField === 'title' ? 'border-blue-400' : 'border-gray-400'} p-4 text-lg `}
          onFocus={() => setActiveField('title')}
          onBlur={() => setActiveField(null)}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      {/* category  */}
      <Pressable onPress={handleCategoryInput}>
        <View style={tailwind`mb-3`}>
          <Text style={tailwind`mb-2 text-black font-semibold`}>Category</Text>
          <View style={tailwind`p-4 border-2 border-gray-400 rounded-xl flex-row justify-between`}>
            <View style={tailwind`flex-row items-center`}>
              <Text style={tailwind`text-2xl mr-3`}>🍔</Text>
              <Text style={tailwind`text-lg`}>Food</Text>
            </View>
            <Text>&gt;</Text>
          </View>
        </View>
      </Pressable>
      {/* add button  */}
      <TouchableOpacity onPress={handleAddExpense} style={tailwind`bg-black p-6 rounded-lg mt-8`}>
        <Text style={tailwind`text-white text-center text-lg font-bold`}>Add Expenses</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Create

const styles = StyleSheet.create({})