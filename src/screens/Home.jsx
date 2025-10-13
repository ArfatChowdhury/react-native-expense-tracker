import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'


export const expensesData = [
  {
    id: '1',
    icon: '🛒',
    title: 'Grocery Shopping',
    category: 'food',
    amount: 250.0,
    date: '2025-09-06',
    color: '#FF6B6B' // Red for food
  },
  {
    id: '2',
    icon: '🚗',
    title: 'Fuel',
    category: 'transport',
    amount: 180.0,
    date: '2025-09-05',
    color: '#4ECDC4' // Teal for transport
  },
  {
    id: '3',
    icon: '🎬',
    title: 'Movie Tickets',
    category: 'entertainment',
    amount: 120.0,
    date: '2025-09-04',
    color: '#45B7D1' // Blue for entertainment
  },
  {
    id: '4',
    icon: '👕',
    title: 'New Clothes',
    category: 'shopping',
    amount: 350.0,
    date: '2025-09-03',
    color: '#96CEB4' // Green for shopping
  },
  {
    id: '5',
    icon: '🏠',
    title: 'Electricity Bill',
    category: 'utilities',
    amount: 200.0,
    date: '2025-09-02',
    color: '#FFEAA7' // Yellow for utilities
  },
  {
    id: '6',
    icon: '🍽️',
    title: 'Dinner Date',
    category: 'dining',
    amount: 180.0,
    date: '2025-09-01',
    color: '#DDA0DD' // Plum for dining
  },
  {
    id: '7',
    icon: '💊',
    title: 'Medicines',
    category: 'healthcare',
    amount: 150.0,
    date: '2025-08-31',
    color: '#FFA07A' // Light salmon for healthcare
  }
];
const Home = ({ navigation }) => {
 
  const totalSpent = expensesData.reduce((sum,item) => sum+item.amount, 0)
  return (
    <View style={tailwind`px-5 flex-1`}>

      <View style={tailwind` pt-5 pb-5`}>
        <Text style={tailwind`text-4xl font-bold`}>Hello👋</Text>
        <Text style={tailwind`text-base text-gray-500 mt-1`}>Start tracking your expenses easily</Text>
      </View>
      <View style={tailwind`bg-black rounded-3xl p-6 my-5 items-center shadow-lg`}>
        <Text style={tailwind`text-base text-gray-400`}>Spent so far</Text>
        <Text style={tailwind`text-base text-white text-4xl mt-2 font-bold`}>${totalSpent.toFixed(2)}</Text>
      </View>

      <FlatList
        data={expensesData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExpenseItemCard item={item} />}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{ marginBottom: 20}}
      />

    </View>
  )
}

export default Home

