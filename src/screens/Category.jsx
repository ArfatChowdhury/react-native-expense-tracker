import { View, Text, Pressable, FlatList } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import RenderItemCard from '../components/RenderItemCard';
import { categories } from '../Data/categoriesData';




const Category = ({ navigation }) => {
  const handleCategory = (itemCat) => {
    navigation.popTo('BottomTabs', {
      screen: 'Create',
      params: { itemCat }
    })
  }
  return (
    <View style={tailwind`px-5 mt-2 flex-1`}>
      <View >
        <Pressable onPress={() => navigation.goBack()} >
          <Text style={tailwind`text-2xl font-bold`}>X</Text>
        </Pressable>
        <Text style={tailwind`text-3xl font-bold mt-4 `}>Select Category</Text>
        <Text style={tailwind`text-base mt-2 text-gray-500 `}>Select a category that describes what you spent money on</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <RenderItemCard item={item} handleCategory={handleCategory} />}
        numColumns={2}
        contentContainerStyle={tailwind`px-4 mb-10`}
      />
    </View>
  )
}

export default Category