import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { COLORS, SHADOW } from '../theme'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'

const Home = ({ navigation }) => {
  const { totalSpent, balance, expenses, handleEdit, handleDelete } = useContext(AppContext)

  const handleEditExpense = (item) => {
    handleEdit(item)
    navigation.navigate('Create')
  }

  const handleDeleteExpense = (id) => {
    Alert.alert('Delete Expense', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) }
    ])
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header Top */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello👋</Text>
          <Text style={styles.subGreeting}>Start tracking your expenses</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMain} />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('SettingsTab')}
          >
            <Ionicons name="settings-outline" size={22} color={COLORS.textMain} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Spent so far</Text>
        <Text style={styles.balanceAmount}>${Number(totalSpent).toFixed(2)}</Text>

        <View style={styles.balanceFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Remaining Balance</Text>
            <Text style={styles.footerValue}>${Number(balance).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <ExpenseItemCard
            item={item}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
        ListEmptyComponent={<EmptyList />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 100 },

  headerContainer: { paddingHorizontal: 20, paddingTop: 10 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: { fontSize: 32, fontWeight: '800', color: COLORS.textMain },
  subGreeting: { fontSize: 14, color: COLORS.textSub, marginTop: 2 },

  headerActions: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dot: {
    position: 'absolute',
    top: 12, right: 12,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.expense,
    borderWidth: 2,
    borderColor: COLORS.gray100,
  },

  balanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    marginBottom: 30,
    ...SHADOW.md,
  },
  balanceLabel: { color: COLORS.gray400, fontSize: 14, fontWeight: '600' },
  balanceAmount: { color: COLORS.white, fontSize: 48, fontWeight: '900', marginTop: 8 },

  balanceFooter: {
    width: '100%',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  footerItem: { alignItems: 'center' },
  footerLabel: { color: COLORS.gray500, fontSize: 12, fontWeight: '600' },
  footerValue: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginTop: 4 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
})

export default Home
