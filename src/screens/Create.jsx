import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tailwind from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { AppContext } from '../Contex/ContextApi';

const Create = ({ navigation, route }) => {
  const [activeField, setActiveField] = useState(null);
  const {
    handleAddExpense, category, setCategory,
    title, setTitle, amount, setAmount,
    editingId, setEditingId, handleUpdateExpense
  } = useContext(AppContext)

  const isEditing = editingId !== null

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the expense');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (!category?.name) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (isEditing) {
      handleUpdateExpense(navigation);
    } else {
      handleAddExpense(navigation);
    }
  }

  useEffect(() => {
    if (route.params?.itemCat) {
      setCategory(route.params?.itemCat)
    }
  }, [route.params?.itemCat])

  const handleCategoryInput = () => {
    navigation.navigate('Category')
  }

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
      <ScrollView contentContainerStyle={tailwind`px-5 pb-10`} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tailwind`my-5`}>
          <Text style={tailwind`text-3xl font-bold text-gray-900`}>
            {isEditing ? '✏️ Edit Expense' : '➕ New Expense'}
          </Text>
          <Text style={tailwind`text-sm text-gray-500 mt-1`}>
            {isEditing ? 'Update your expense details' : 'Enter your spending details below'}
          </Text>
        </View>

        {/* Amount */}
        <View style={tailwind`mb-4`}>
          <Text style={tailwind`mb-2 text-gray-700 font-semibold`}>Amount</Text>
          <TextInput
            placeholder="$0.00"
            style={tailwind`border-2 rounded-2xl ${activeField === 'amount' ? 'border-green-400' : 'border-gray-200'} p-4 text-lg bg-white`}
            onFocus={() => setActiveField('amount')}
            onBlur={() => setActiveField(null)}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Title */}
        <View style={tailwind`mb-4`}>
          <Text style={tailwind`mb-2 text-gray-700 font-semibold`}>Title</Text>
          <TextInput
            placeholder="What was it for?"
            style={tailwind`border-2 rounded-2xl ${activeField === 'title' ? 'border-green-400' : 'border-gray-200'} p-4 text-lg bg-white`}
            onFocus={() => setActiveField('title')}
            onBlur={() => setActiveField(null)}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category */}
        <Pressable onPress={handleCategoryInput}>
          <View style={tailwind`mb-6`}>
            <Text style={tailwind`mb-2 text-gray-700 font-semibold`}>Category</Text>
            <View style={[
              tailwind`p-4 border-2 rounded-2xl flex-row justify-between items-center bg-white`,
              !category?.name ? tailwind`border-red-300` : tailwind`border-gray-200`
            ]}>
              <View style={tailwind`flex-row items-center`}>
                <Text style={tailwind`text-2xl mr-3`}>{category?.icon || '📁'}</Text>
                <Text style={tailwind`text-lg text-gray-700`}>{category?.name || 'Select Category'}</Text>
              </View>
              <Text style={tailwind`text-gray-400 text-lg`}>›</Text>
            </View>
            {!category?.name && (
              <Text style={tailwind`text-red-400 text-xs mt-1 ml-1`}>* Please select a category</Text>
            )}
          </View>
        </Pressable>

        {/* Submit */}
        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient
            colors={isEditing ? ['#1d4ed8', '#1e40af'] : ['#16a34a', '#15803d']}
            style={tailwind`py-5 rounded-2xl items-center mb-4`}
          >
            <Text style={tailwind`text-white text-lg font-bold`}>
              {isEditing ? 'Update Expense' : 'Add Expense'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            onPress={() => { setEditingId(null); navigation.goBack(); }}
            style={tailwind`bg-gray-200 py-5 rounded-2xl items-center`}
          >
            <Text style={tailwind`text-gray-700 text-lg font-bold`}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create