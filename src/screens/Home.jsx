import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'

const Home = ({ navigation }) => {
  return (
    <View style={tailwind`px-5`}>

      <View style={tailwind` pt-5 pb-5`}>
        <Text style={tailwind`text-4xl font-bold`}>Hello👋</Text>
        <Text style={tailwind`text-base text-gray-500 mt-1`}>Start tracking your expenses easily</Text>
      </View>
      <View style={tailwind`bg-black rounded-3xl p-6 my-5 items-center shadow-lg`}>
          <Text style={tailwind`text-base text-gray-400`}>Spent so far</Text>
          <Text style={tailwind`text-base text-white text-4xl mt-2 font-bold`}>$400</Text>
      </View>
      <FlatList
      data={[1,2,3]}
      keyExtractor={item => item.id}
      renderItem={({item})=> <ExpenseItemCard/>}
      ListEmptyComponent={<EmptyList/>}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})