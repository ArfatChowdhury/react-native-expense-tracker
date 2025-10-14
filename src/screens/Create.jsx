import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tailwind from 'twrnc'
import { AppContext } from '../Contex/ContextApi';

const Create = ({ navigation, route }) => {
  const [activeField, setActiveField] = useState(null);
  const { handleAddExpense, category, setCategory, title, setTitle, amount, setAmount, editingId, setEditingId, handleUpdateExpense } = useContext(AppContext)

  const isEditing = editingId !== null

  const handleSubmit = () => {
    if (isEditing) {
      
      handleUpdateExpense(navigation);
    } else {
     
      handleAddExpense(navigation);
    }
  }
  
  useEffect(() => {
    if (route.params?.itemCat) {
      // console.log(route.params?.itemCat, 'gggggg');
      setCategory(route.params?.itemCat)
    }
  }, [route.params?.itemCat])


const handleCategoryInput = () => {
  navigation.navigate('Category')
}
return (
  <View style={tailwind`flex-1 px-5  mt-4`}>
    <View style={tailwind`my-4`}>
    <Text style={tailwind`text-3xl font-bold mb-2`}>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </Text>
        <Text style={tailwind`text-base text-gray-500`}>
          {isEditing ? 'Update your expense details' : 'Enter the details of your expenses'}
        </Text>
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
            <Text style={tailwind`text-2xl mr-3`}>{category.icon || '🍔'}</Text>
            <Text style={tailwind`text-lg`}>{category.name || 'Food'}</Text>
          </View>
          <Text>&gt;</Text>
        </View>
      </View>
    </Pressable>
    {/* add button  */}
    <TouchableOpacity 
        onPress={handleSubmit} 
        style={tailwind`bg-black p-6 rounded-lg mt-8`}
      >
        <Text style={tailwind`text-white text-center text-lg font-bold`}>
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity 
          onPress={() => {
            setEditingId(null); // Clear edit mode
            navigation.goBack();
          }} 
          style={tailwind`bg-gray-500 p-6 rounded-lg mt-4`}
        >
          <Text style={tailwind`text-white text-center text-lg font-bold`}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
  </View>
)
}

export default Create

const styles = StyleSheet.create({})