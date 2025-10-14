import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import tailwind from 'twrnc'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import { AppContext } from '../Contex/ContextApi'



const Home = ({ navigation }) => {
  const {expenses, handleDelete, handleEdit} = useContext(AppContext)
  console.log('Expenses in Home:', expenses);
  console.log('Number of expenses:', expenses.length);
 
 const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0)

  
  return (
    <View style={tailwind`px-5 flex-1`}>

      <View style={tailwind` pt-5 pb-5`}>
        <Text style={tailwind`text-4xl font-bold`}>Hello👋</Text>
        <Text style={tailwind`text-base text-gray-500 mt-1`}>Start tracking your expenses easily</Text>
      </View>
      <View style={tailwind`bg-black rounded-3xl p-6 my-5 items-center shadow-lg`}>
        <Text style={tailwind`text-base text-gray-400`}>Spent so far</Text>
        <Text style={tailwind`text-base text-white text-4xl mt-2 font-bold`}>${totalSpent}</Text>
      </View>

      <FlatList
        data={expenses || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExpenseItemCard item={item} handleDelete={handleDelete}  handleEdit={handleEdit}/>}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={{ marginBottom: 20}}
      />

    </View>
  )
}

export default Home

