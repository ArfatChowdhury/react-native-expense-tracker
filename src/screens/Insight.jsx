import {
  FlatList, StatusBar, StyleSheet, Text, View
} from 'react-native'
import React, { useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { AppContext } from '../Contex/ContextApi'
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
      <View style={styles.root}>
        <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.emptyWrap}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>📊</Text>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptySub}>Add expenses to see insights</Text>
        </SafeAreaView>
      </View>
    )
  }

  const spendingByCategory = allExpenses.reduce((acc, expense) => {
    const name = expense.category?.name || 'Other'
    acc[name] = (acc[name] || 0) + Number(expense.amount)
    return acc
  }, {})

  const periodTotal = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const chartData = Object.keys(spendingByCategory).map((name) => {
    const amount = spendingByCategory[name]
    const pct = Math.round((amount / (periodTotal || 1)) * 100)
    const cat = categories.find(c => c.name === name)
    return { value: pct, color: cat?.color || '#6b7280', text: `${pct}%`, label: name }
  })

  const flatListData = Object.keys(spendingByCategory).map((name) => {
    const amount = spendingByCategory[name]
    const cat = categories.find(c => c.name === name)
    return { id: name, category: { name, color: cat?.color || '#6b7280' }, amount }
  }).sort((a, b) => b.amount - a.amount)

  const isPositive = balance >= 0

  const ListHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Your spending breakdown</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: 'rgba(0,245,155,0.3)' }]}>
          <View style={styles.statIconWrap}>
            <Ionicons name="arrow-down" size={14} color="#00f59b" />
          </View>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.statValue}>${totalIncome.toFixed(2)}</Text>
        </View>

        <View style={[styles.statCard, { borderColor: 'rgba(255,90,90,0.3)' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: 'rgba(255,90,90,0.15)' }]}>
            <Ionicons name="arrow-up" size={14} color="#ff5a5a" />
          </View>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={[styles.statValue, { color: '#ff5a5a' }]}>${totalSpent.toFixed(2)}</Text>
        </View>

        <View style={[styles.statCard, { borderColor: isPositive ? 'rgba(96,165,250,0.3)' : 'rgba(255,90,90,0.3)' }]}>
          <View style={[styles.statIconWrap, { backgroundColor: isPositive ? 'rgba(96,165,250,0.15)' : 'rgba(255,90,90,0.15)' }]}>
            <Ionicons name="wallet" size={14} color={isPositive ? '#60a5fa' : '#ff5a5a'} />
          </View>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statValue, { color: isPositive ? '#60a5fa' : '#ff5a5a' }]}>
            ${Math.abs(balance).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Pie Chart */}
      <View style={styles.chartWrap}>
        <View style={styles.chartCard}>
          <PieChart
            donut
            data={chartData}
            radius={110}
            innerRadius={70}
            textColor="#94a3b8"
            fontWeight="bold"
            textSize={11}
            centerLabelComponent={() => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>Total Spent</Text>
                <Text style={{ color: '#f1f5f9', fontSize: 18, fontWeight: '800' }}>
                  ${periodTotal.toFixed(0)}
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      <Text style={styles.breakdownTitle}>By Category</Text>
    </>
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
      <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={flatListData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <RenderInsightitem item={item} />}
          ListHeaderComponent={<ListHeader />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a14' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: '#f1f5f9', fontSize: 20, fontWeight: '700' },
  emptySub: { color: '#94a3b8', fontSize: 14, marginTop: 4 },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  title: { color: '#f1f5f9', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 13, marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-start',
    gap: 4,
  },
  statIconWrap: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,245,155,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '600' },
  statValue: { color: '#f1f5f9', fontSize: 14, fontWeight: '700' },

  chartWrap: { alignItems: 'center', marginTop: 20 },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 24,
    padding: 20,
  },

  breakdownTitle: {
    color: '#f1f5f9', fontSize: 16, fontWeight: '700',
    marginTop: 20, marginLeft: 20, marginBottom: 4,
  },
  listContent: { paddingBottom: 120 },
})

export default Insight