import { View, Text, Pressable, FlatList } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import RenderItemCard from '../components/RenderItemCard';



export const categories = [
    {
      name: 'Food',
      icon: '🍔',
      color: '#FF6B6B'
    },
    {
      name: 'Bills',
      icon: '🧾',
      color: '#4ECDC4'
    },
    {
      name: 'Family',
      icon: '👨‍👩‍👧‍👦',
      color: '#45B7D1'
    },
    {
      name: 'Healthcare',
      icon: '🏥',
      color: '#96CEB4'
    },
    {
      name: 'Fuel',
      icon: '⛽',
      color: '#FFEAA7'
    },
    {
      name: 'Phone',
      icon: '📱',
      color: '#DDA0DD'
    },
    {
      name: 'Education',
      icon: '🎓',
      color: '#FFA07A'
    },
    {
      name: 'Entertainment',
      icon: '🎬',
      color: '#87CEEB'
    },
    {
      name: 'Shopping',
      icon: '🛍️',
      color: '#98FB98'
    },
    {
      name: 'Travel',
      icon: '✈️',
      color: '#FFD700'
    },
    {
      name: 'Groceries',
      icon: '🛒',
      color: '#FF69B4'
    },
    {
      name: 'Dining',
      icon: '🍽️',
      color: '#CD5C5C'
    },
    {
      name: 'Transport',
      icon: '🚗',
      color: '#4682B4'
    },
    {
      name: 'Utilities',
      icon: '💡',
      color: '#32CD32'
    },
    {
      name: 'Rent',
      icon: '🏠',
      color: '#8A2BE2'
    },
    {
      name: 'Insurance',
      icon: '🛡️',
      color: '#FF8C00'
    },
    {
      name: 'Investment',
      icon: '📈',
      color: '#00CED1'
    },
    {
      name: 'Gifts',
      icon: '🎁',
      color: '#FF1493'
    },
    {
      name: 'Charity',
      icon: '❤️',
      color: '#DC143C'
    },
    {
      name: 'Personal',
      icon: '💇',
      color: '#20B2AA'
    },
    {
      name: 'Sports',
      icon: '⚽',
      color: '#FF4500'
    },
    {
      name: 'Hobbies',
      icon: '🎨',
      color: '#9370DB'
    },
    {
      name: 'Subscriptions',
      icon: '📺',
      color: '#00FA9A'
    },
    {
      name: 'Taxes',
      icon: '💰',
      color: '#B22222'
    },
    {
      name: 'Emergency',
      icon: '🚨',
      color: '#FF0000'
    }
  ];
const Category = ({navigation}) => {
  return (
    <View style={tailwind`px-5 mt-2 flex-1`}>
      <View >
        <Pressable onPress={()=> navigation.goBack()} >
        <Text style={tailwind`text-2xl font-bold`}>X</Text>
        </Pressable>
        <Text style={tailwind`text-3xl font-bold mt-4 `}>Select Category</Text>
        <Text style={tailwind`text-base mt-2 text-gray-500 `}>Select a category that describes what you spent money on</Text>
      </View>
      <FlatList
      data={categories}
      keyExtractor={item => item.name}
      renderItem={({item}) => <RenderItemCard item={item} /> }
      numColumns={2}
      contentContainerStyle={tailwind`px-4 mb-10`}
      />
    </View>
  )
}

export default Category