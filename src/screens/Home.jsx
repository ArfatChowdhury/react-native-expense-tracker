import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar, ImageBackground } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { COLORS, SHADOW } from '../theme'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import DateFilterBar from '../components/DateFilterBar'

const Home = ({ navigation }) => {
  const { totalSpent, balance, expenses, allTransactions, handleEdit, handleDelete, handleDeleteIncome, categoriesWithBudget, currencySymbol } = useContext(AppContext)

  const [selectedPeriod, setSelectedPeriod] = React.useState('all')

  const handleEditExpense = (item) => {
    handleEdit(item)
    navigation.navigate('Create')
  }

  const handleDeleteRecord = (id, type) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          if (type === 'income') handleDeleteIncome(id);
          else handleDelete(id);
        }
      }
    ])
  }

  const overBudgetCategories = categoriesWithBudget.filter(cat => cat.budgetLimit > 0 && cat.amountSpent > cat.budgetLimit)

  const BudgetWarningBanner = () => {
    if (overBudgetCategories.length === 0) return null
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Budget')}
        style={styles.warningBanner}
        activeOpacity={0.9}
      >
        <View style={styles.warningIconBox}>
          <Ionicons name="warning" size={24} color="#FFF" />
        </View>
        <View style={styles.warningTextContent}>
          <Text style={styles.warningTitle}>Budget Alert</Text>
          <Text style={styles.warningDesc}>
            You have exceeded your limit in {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category' : 'categories'}.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    )
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
        </View>
      </View>

      {/* Balance Card */}
      <ImageBackground
        source={require('../../assets/card-bg.jpg')}
        style={styles.balanceCard}
        imageStyle={{ borderRadius: 32 }}
      >
        <View style={styles.cardOverlay} />
        <Text style={styles.balanceLabel}>Spent so far</Text>
        <Text style={styles.balanceAmount}>{currencySymbol}{Number(totalSpent).toFixed(2)}</Text>

        <View style={styles.balanceFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Remaining Balance</Text>
            <Text style={styles.footerValue}>{currencySymbol}{Number(balance).toFixed(2)}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Budget Warning Banner */}
      <BudgetWarningBanner />

      <DateFilterBar
        selectedPeriod={selectedPeriod}
        onSelect={setSelectedPeriod}
      />

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={allTransactions}
        keyExtractor={item => item.id}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <ExpenseItemCard
            item={item}
            onEdit={handleEditExpense}
            onDelete={handleDeleteRecord}
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
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', // Adjust opacity for the "multiply" look
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

  warningBanner: {
    backgroundColor: COLORS.expense,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOW.md,
  },
  warningIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  warningTextContent: { flex: 1 },
  warningTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  warningDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginTop: 2 },
})

export default Home
