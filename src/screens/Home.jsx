import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import tailwind from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import DateFilterBar from '../components/DateFilterBar'
import { AppContext } from '../Contex/ContextApi'

const Home = ({ navigation }) => {
  const { filteredExpenses, expenses, totalSpent, totalIncome, balance, handleEdit, handleDelete, selectedPeriod, setSelectedPeriod } = useContext(AppContext)

  const handleEditExpense = (item) => {
    handleEdit(item);
    navigation.navigate('Create');
  };

  const handleDeleteExpense = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) }
      ]
    );
  };

  const displayList = filteredExpenses ?? expenses;

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tailwind`px-5 pt-2 pb-1 flex-row justify-between items-center`}>
        <View>
          <Text style={tailwind`text-3xl font-bold text-gray-900`}>Hello 👋</Text>
          <Text style={tailwind`text-sm text-gray-500 mt-1`}>Track your money, own your life</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddIncome')}
          style={tailwind`bg-green-500 px-3 py-2 rounded-xl flex-row items-center`}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text style={tailwind`text-white text-sm font-bold ml-1`}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={tailwind`px-5 mt-3 mb-2`}>
        {/* Balance Card */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={tailwind`rounded-3xl p-6 mb-3`}
        >
          <Text style={tailwind`text-sm text-gray-400 text-center`}>Current Balance</Text>
          <Text style={[tailwind`text-5xl font-bold text-center mt-2`, { color: balance >= 0 ? '#4ade80' : '#f87171' }]}>
            ${Math.abs(balance).toFixed(2)}
          </Text>
          {balance < 0 && <Text style={tailwind`text-red-400 text-center text-xs mt-1`}>⚠️ Overspent</Text>}
        </LinearGradient>

        {/* Income / Expense Row */}
        <View style={tailwind`flex-row gap-3`}>
          <LinearGradient
            colors={['#052e16', '#14532d']}
            style={tailwind`flex-1 rounded-2xl p-4 flex-row items-center`}
          >
            <View style={tailwind`bg-green-500 w-9 h-9 rounded-full justify-center items-center mr-3`}>
              <Ionicons name="arrow-down" size={18} color="white" />
            </View>
            <View>
              <Text style={tailwind`text-green-400 text-xs`}>Income</Text>
              <Text style={tailwind`text-white font-bold text-lg`}>${totalIncome.toFixed(2)}</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#450a0a', '#7f1d1d']}
            style={tailwind`flex-1 rounded-2xl p-4 flex-row items-center`}
          >
            <View style={tailwind`bg-red-500 w-9 h-9 rounded-full justify-center items-center mr-3`}>
              <Ionicons name="arrow-up" size={18} color="white" />
            </View>
            <View>
              <Text style={tailwind`text-red-400 text-xs`}>Expenses</Text>
              <Text style={tailwind`text-white font-bold text-lg`}>${totalSpent.toFixed(2)}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Date Filter */}
      <DateFilterBar selectedPeriod={selectedPeriod} onSelect={setSelectedPeriod} />

      {/* Expense List */}
      <View style={tailwind`px-5 pt-3 pb-1 flex-row justify-between items-center`}>
        <Text style={tailwind`text-base font-bold text-gray-800`}>Recent Transactions</Text>
        <Text style={tailwind`text-xs text-gray-400`}>{displayList.length} entries</Text>
      </View>

      <FlatList
        data={displayList}
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
    </SafeAreaView>
  )
}

export default Home