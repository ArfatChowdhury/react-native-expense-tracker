import {
  FlatList, Pressable, StatusBar,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { categories } from '../Data/categoriesData'

const Category = ({ navigation }) => {
  const handleCategory = (itemCat) => {
    navigation.popTo('BottomTabs', {
      screen: 'Create',
      params: { itemCat }
    })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategory(item)}
      style={styles.catCard}
      activeOpacity={0.75}
    >
      <LinearGradient
        colors={[item.color + '22', item.color + '11']}
        style={styles.catCardInner}
      >
        <View style={[styles.catIconWrap, { borderColor: item.color + '55', backgroundColor: item.color + '22' }]}>
          <Text style={{ fontSize: 28 }}>{item.icon}</Text>
        </View>
        <Text style={styles.catName}>{item.name}</Text>
        <View style={[styles.catColorDot, { backgroundColor: item.color }]} />
      </LinearGradient>
    </TouchableOpacity>
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1320" />
      <LinearGradient colors={['#0d1320', '#0a0a14']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#f1f5f9" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Select Category</Text>
            <Text style={styles.subtitle}>Choose what you spent money on</Text>
          </View>
        </View>

        <FlatList
          data={categories}
          keyExtractor={item => item.name}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0d1320' },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  headerText: {},
  title: { color: '#f1f5f9', fontSize: 20, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },

  grid: { padding: 12, paddingBottom: 40 },
  row: { justifyContent: 'space-between', gap: 12 },

  catCard: {
    flex: 1,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  catCardInner: {
    padding: 16,
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  catIconWrap: {
    width: 56, height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catName: { color: '#f1f5f9', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  catColorDot: { width: 6, height: 6, borderRadius: 3 },
})

export default Category