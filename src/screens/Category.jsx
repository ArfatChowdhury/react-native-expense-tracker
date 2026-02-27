import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import RenderItemCard from '../components/RenderItemCard';
import { categories } from '../Data/categoriesData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const Category = ({ navigation }) => {
  const handleCategory = (itemCat) => {
    navigation.popTo('BottomTabs', {
      screen: 'Create',
      params: { itemCat }
    })
  }
  return (
    <SafeAreaView style={styles.root}>
      <View style={tailwind`px-5 mt-2`}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close-circle" size={32} color={COLORS.textMain} />
        </Pressable>
        <Text style={tailwind`text-3xl font-bold mt-4 `}>Select Category</Text>
        <Text style={tailwind`text-base mt-2 text-gray-500 `}>Select a category that describes what you spent money on</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <RenderItemCard item={item} handleCategory={handleCategory} />}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  closeBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 120, // Avoid overlap with bottom tabs
    paddingTop: 20,
  }
})

export default Category