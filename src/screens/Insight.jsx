import { FlatList, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { AppContext } from '../Contex/ContextApi'
import tailwind from 'twrnc'
import RenderInsightitem from '../components/RenderInsightitem'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { categories } from '../Data/categoriesData'

const Insight = () => {
  const { filteredExpenses, expenses, totalSpent, totalIncome, balance } = useContext(AppContext)

  const allExpenses = filteredExpenses ?? expenses

  if (totalSpent === 0 || expenses.length === 0) {
    return (
      <SafeAreaView style={tailwind`flex-1 justify-center items-center bg-gray-100`}>
        <Text style={tailwind`text-5xl mb-4`}>📊</Text>
        <Text style={tailwind`text-lg font-bold text-gray-600`}>No data yet</Text>
        <Text style={tailwind`text-sm text-gray-400 mt-1`}>Add expenses to see insights</Text>
      </SafeAreaView>
    )
  }

  const spendingByCategory = allExpenses.reduce((acc, expense) => {
    const categoryName = expense.category?.name || 'Other';
    const amount = Number(expense.amount) || 0;
    acc[categoryName] = (acc[categoryName] || 0) + amount;
    return acc;
  }, {});

  const periodTotal = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const chartData = Object.keys(spendingByCategory).map((categoryName) => {
    const amount = spendingByCategory[categoryName]
    const percentage = Math.round((amount / (periodTotal || 1)) * 100)
    const categoryInfo = categories.find((cat) => cat.name === categoryName)
    return {
      value: percentage,
      color: categoryInfo?.color || '#6b7280',
      text: `${percentage}%`,
      label: categoryName
    }
  })

  const flatListData = Object.keys(spendingByCategory).map((categoryName) => {
    const amount = spendingByCategory[categoryName]
    const categoryInfo = categories.find((cat) => cat.name === categoryName)
    return {
      id: categoryName,
      category: {
        name: categoryName,
        color: categoryInfo?.color || '#6b7280'
      },
      amount
    }
  }).sort((a, b) => b.amount - a.amount)

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
      <View style={tailwind`px-5 pt-3 pb-1`}>
        <Text style={tailwind`text-2xl font-bold text-gray-900`}>Insights</Text>
        <Text style={tailwind`text-sm text-gray-400 mt-1`}>Your spending breakdown</Text>
      </View>

      {/* Income vs Expenses summary */}
      <View style={tailwind`flex-row px-5 gap-3 mt-3`}>
        <LinearGradient colors={['#052e16', '#166534']} style={tailwind`flex-1 rounded-2xl p-4 flex-row items-center`}>
          <Ionicons name="arrow-down" size={18} color="#4ade80" />
          <View style={tailwind`ml-2`}>
            <Text style={tailwind`text-green-300 text-xs`}>Income</Text>
            <Text style={tailwind`text-white font-bold`}>${totalIncome.toFixed(2)}</Text>
          </View>
        </LinearGradient>
        <LinearGradient colors={['#450a0a', '#7f1d1d']} style={tailwind`flex-1 rounded-2xl p-4 flex-row items-center`}>
          <Ionicons name="arrow-up" size={18} color="#f87171" />
          <View style={tailwind`ml-2`}>
            <Text style={tailwind`text-red-300 text-xs`}>Spent</Text>
            <Text style={tailwind`text-white font-bold`}>${totalSpent.toFixed(2)}</Text>
          </View>
        </LinearGradient>
        <LinearGradient
          colors={balance >= 0 ? ['#1e3a5f', '#1e40af'] : ['#450a0a', '#7f1d1d']}
          style={tailwind`flex-1 rounded-2xl p-4 flex-row items-center`}
        >
          <Ionicons name="wallet" size={18} color={balance >= 0 ? '#93c5fd' : '#f87171'} />
          <View style={tailwind`ml-2`}>
            <Text style={[tailwind`text-xs`, { color: balance >= 0 ? '#93c5fd' : '#f87171' }]}>Balance</Text>
            <Text style={tailwind`text-white font-bold`}>${Math.abs(balance).toFixed(2)}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Pie Chart */}
      <View style={tailwind`items-center my-5`}>
        <PieChart
          donut
          data={chartData}
          radius={120}
          textColor="gray"
          fontWeight="bold"
          textSize={12}
          showTextBackground={false}
        />
      </View>

      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderInsightitem item={item} />}
        contentContainerStyle={tailwind`pb-6`}
      />
    </SafeAreaView>
  )
}

export default Insight