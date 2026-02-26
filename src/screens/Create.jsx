import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi';
import { COLORS, SHADOW } from '../theme';

const Create = ({ navigation, route }) => {
  const [activeField, setActiveField] = useState(null);
  const [type, setType] = useState('expense'); // 'income' or 'expense'

  const {
    handleAddTransaction, category, setCategory,
    title, setTitle, amount, setAmount,
    editingId, setEditingId, handleUpdateTransaction
  } = useContext(AppContext)

  const isEditing = editingId !== null

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
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

    const transactionData = {
      type,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString(),
    };

    if (isEditing) {
      handleUpdateTransaction(navigation);
    } else {
      handleAddTransaction(navigation, transactionData);
    }
  }

  useEffect(() => {
    if (route.params?.itemCat) {
      setCategory(route.params?.itemCat)
    }
  }, [route.params?.itemCat])

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setType('expense')}
            style={[styles.toggleBtn, type === 'expense' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, type === 'expense' && styles.toggleTextActive]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('income')}
            style={[styles.toggleBtn, type === 'income' && styles.toggleBtnActiveIncome]}
          >
            <Text style={[styles.toggleText, type === 'income' && styles.toggleTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={[styles.amountInputWrap, activeField === 'amount' && styles.inputActive]}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              placeholder="0.00"
              style={styles.amountInput}
              onFocus={() => setActiveField('amount')}
              onBlur={() => setActiveField(null)}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={COLORS.gray400}
            />
          </View>
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="e.g. Grocery Shopping"
            style={[styles.input, activeField === 'title' && styles.inputActive]}
            onFocus={() => setActiveField('title')}
            onBlur={() => setActiveField(null)}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={COLORS.gray400}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Category')}
            style={[styles.input, !category?.name && styles.inputError]}
          >
            <View style={styles.categoryRow}>
              <View style={styles.catInfo}>
                <Text style={styles.catIcon}>{category?.icon || '📁'}</Text>
                <Text style={[styles.catName, !category?.name && { color: COLORS.gray400 }]}>
                  {category?.name || 'Select Category'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitBtn, { backgroundColor: type === 'expense' ? COLORS.black : COLORS.income }]}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>
            {isEditing ? 'Update Transaction' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            onPress={() => { setEditingId(null); navigation.goBack(); }}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textMain },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: 16,
    padding: 6,
    marginBottom: 30,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleBtnActive: { backgroundColor: COLORS.black },
  toggleBtnActiveIncome: { backgroundColor: COLORS.income },
  toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.textSub },
  toggleTextActive: { color: COLORS.white },

  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.textMain,
  },
  inputActive: { borderColor: COLORS.black },
  inputError: { borderColor: '#FEE2E2' },

  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  currency: { fontSize: 24, fontWeight: '800', marginRight: 8, color: COLORS.textMain },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textMain,
  },

  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catInfo: { flexDirection: 'row', alignItems: 'center' },
  catIcon: { fontSize: 24, marginRight: 12 },
  catName: { fontSize: 16, fontWeight: '600', color: COLORS.textMain },

  submitBtn: {
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    ...SHADOW.md,
  },
  submitText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },

  cancelBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: { color: COLORS.textSub, fontSize: 16, fontWeight: '600' },
})

export default Create
