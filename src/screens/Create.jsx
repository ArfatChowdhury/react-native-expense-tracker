import {
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View, Pressable
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'

const Create = ({ navigation, route }) => {
  const [activeField, setActiveField] = useState(null)
  const {
    handleAddExpense, category, setCategory,
    title, setTitle, amount, setAmount,
    editingId, setEditingId, handleUpdateExpense
  } = useContext(AppContext)

  const isEditing = editingId !== null

  const handleSubmit = () => {
    if (!title.trim()) { alert('Please enter a title'); return }
    if (!amount || parseFloat(amount) <= 0) { alert('Please enter a valid amount'); return }
    if (!category?.name) { alert('Please select a category'); return }
    isEditing ? handleUpdateExpense(navigation) : handleAddExpense(navigation)
  }

  useEffect(() => {
    if (route.params?.itemCat) setCategory(route.params?.itemCat)
  }, [route.params?.itemCat])

  const fieldStyle = (field) => [
    styles.input,
    activeField === field && styles.inputFocused,
  ]

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
      <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Expense' : 'New Expense'}
            </Text>
            <Text style={styles.headerSub}>
              {isEditing ? 'Update your expense details' : 'Enter spending details'}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount */}
          <View style={styles.field}>
            <Text style={styles.label}>Amount</Text>
            <View style={[styles.inputWrap, activeField === 'amount' && styles.inputWrapFocused]}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#475569"
                style={fieldStyle('amount')}
                onFocus={() => setActiveField('amount')}
                onBlur={() => setActiveField(null)}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              placeholder="What was it for?"
              placeholderTextColor="#475569"
              style={[styles.inputBlock, activeField === 'title' && styles.inputBlockFocused]}
              onFocus={() => setActiveField('title')}
              onBlur={() => setActiveField(null)}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <Pressable onPress={() => navigation.navigate('Category')}>
              <View style={[styles.categoryBox, !category?.name && styles.categoryBoxEmpty]}>
                <View style={styles.catLeft}>
                  <View style={[styles.catIcon, { backgroundColor: category?.color ? category.color + '33' : 'rgba(255,255,255,0.1)' }]}>
                    <Text style={{ fontSize: 20 }}>{category?.icon || '📁'}</Text>
                  </View>
                  <Text style={[styles.catName, !category?.name && { color: '#475569' }]}>
                    {category?.name || 'Select Category'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#475569" />
              </View>
            </Pressable>
            {!category?.name && (
              <Text style={styles.fieldHint}>* Tap to choose a category</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitWrap}>
            <LinearGradient
              colors={isEditing ? ['#3b82f6', '#2563eb'] : ['#00f59b', '#00d4aa']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Ionicons name={isEditing ? 'checkmark' : 'add'} size={20} color="#0a0a14" />
              <Text style={styles.submitText}>
                {isEditing ? 'Update Expense' : 'Add Expense'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              onPress={() => { setEditingId(null); navigation.goBack() }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a14' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },

  content: { paddingHorizontal: 16, paddingBottom: 100 },
  field: { marginBottom: 20 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },

  // Amount with symbol
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  inputWrapFocused: { borderColor: '#00f59b' },
  currencySymbol: { color: '#00f59b', fontSize: 22, fontWeight: '700', marginRight: 4 },
  input: { flex: 1, color: '#f1f5f9', fontSize: 28, fontWeight: '700', paddingVertical: 14 },
  inputFocused: {},

  inputBlock: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f1f5f9',
    fontSize: 16,
  },
  inputBlockFocused: { borderColor: '#00f59b' },

  categoryBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBoxEmpty: { borderColor: 'rgba(255,90,90,0.3)' },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  catName: { color: '#f1f5f9', fontSize: 16, fontWeight: '600' },
  fieldHint: { color: '#ff5a5a', fontSize: 11, marginTop: 6, marginLeft: 4 },

  submitWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00f59b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  submitText: { color: '#0a0a14', fontWeight: '800', fontSize: 16 },

  cancelBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: { color: '#94a3b8', fontWeight: '600', fontSize: 15 },
})

export default Create