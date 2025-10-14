import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import tailwind from 'twrnc'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import { AppContext } from '../Contex/ContextApi'

const Home = ({ navigation }) => {
  const { expenses, totalSpent, handleEdit, handleDelete } = useContext(AppContext)

  const handleEditExpense = (item) => {
    // Fill form and navigate to Create screen
    handleEdit(item);
    navigation.navigate('Create');
  };

  const handleDeleteExpense = (id) => {
    // Show confirmation before deleting
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => handleDelete(id)
        }
      ]
    );
  };

  return (
    <View style={tailwind`flex-1 bg-gray-100`}>
      <View style={tailwind`px-5`}>
        <View style={tailwind`pt-5 pb-5`}>
          <Text style={tailwind`text-4xl font-bold`}>Hello👋</Text>
          <Text style={tailwind`text-base text-gray-500 mt-1`}>Start tracking your expenses easily</Text>
        </View>
        
        <View style={tailwind`bg-black rounded-3xl p-6 my-5 items-center shadow-lg`}>
          <Text style={tailwind`text-base text-gray-400`}>Spent so far</Text>
          <Text style={tailwind`text-base text-white text-4xl mt-2 font-bold`}>
            ${totalSpent?.toFixed(2)}
          </Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ExpenseItemCard 
            item={item}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={tailwind`px-5 pb-4`}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Expense Button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Create')}
        style={tailwind`absolute bottom-6 right-6 bg-black w-16 h-16 rounded-full justify-center items-center shadow-lg`}
      >
        <Text style={tailwind`text-white text-2xl`}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home