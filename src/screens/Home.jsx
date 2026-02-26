import {
  Alert, FlatList, Image, StatusBar,
  StyleSheet, Text, TouchableOpacity, View, ScrollView
} from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import { AppContext } from '../Contex/ContextApi'
import { auth } from '../services/firebase'

const PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'All', value: 'all' },
]

const Home = ({ navigation }) => {
  const {
    filteredExpenses, expenses, totalSpent, totalIncome,
    balance, handleEdit, handleDelete, selectedPeriod, setSelectedPeriod
  } = useContext(AppContext)

  const user = auth.currentUser
  const isLoggedIn = !!user
  const firstName = user?.displayName?.split(' ')[0] || 'User'
  const isPositive = balance >= 0

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

  const displayList = filteredExpenses ?? expenses

  const ListHeader = () => (
    <>
      {/* ── TOP HEADER ───────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Left: user greeting */}
        <View style={styles.headerLeft}>
          {isLoggedIn ? (
            <View style={styles.userRow}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{firstName[0]}</Text>
                </View>
              )}
              <View>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.userName}>{user?.displayName || 'User'} 👋</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.helloText}>Hello 👋</Text>
              <Text style={styles.helloSub}>Track your money</Text>
            </View>
          )}
        </View>

        {/* Right: icons */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BALANCE CARD ─────────────────────────────────────── */}
      <View style={styles.balanceCard}>
        <LinearGradient
          colors={['#1b1f3b', '#222749', '#1b1f3b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Top label + chip */}
        <View style={styles.balanceTopRow}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={[styles.balanceBadge, { backgroundColor: isPositive ? 'rgba(0,245,155,0.15)' : 'rgba(255,90,90,0.15)' }]}>
            <View style={[styles.badgeDot, { backgroundColor: isPositive ? '#00f59b' : '#ff5a5a' }]} />
            <Text style={[styles.badgeText, { color: isPositive ? '#00f59b' : '#ff5a5a' }]}>
              {isPositive ? 'Healthy' : 'Overspent'}
            </Text>
          </View>
        </View>

        {/* Big number */}
        <Text style={[styles.balanceAmount, { color: isPositive ? '#00f59b' : '#ff5a5a' }]}>
          ${Math.abs(balance).toFixed(2)}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Income / Expense Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(0,245,155,0.15)' }]}>
              <Ionicons name="arrow-down" size={13} color="#00f59b" />
            </View>
            <View>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>${totalIncome.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.statSep} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,90,90,0.15)' }]}>
              <Ionicons name="arrow-up" size={13} color="#ff5a5a" />
            </View>
            <View>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={[styles.statValue, { color: '#ff5a5a' }]}>${totalSpent.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.btnIncome}
            onPress={() => navigation.navigate('AddIncome')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={15} color="#0a0a14" />
            <Text style={styles.btnIncomeText}>Add Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnExpense}
            onPress={() => navigation.navigate('Create')}
            activeOpacity={0.85}
          >
            <Ionicons name="remove" size={15} color="#ff5a5a" />
            <Text style={styles.btnExpenseText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── TRANSACTIONS HEADER + FILTER ────────────────────── */}
      <View style={styles.txHeaderRow}>
        <View style={styles.txTitleWrap}>
          <Text style={styles.txTitle}>Transactions</Text>
          <View style={styles.txCountBadge}>
            <Text style={styles.txCount}>{displayList.length}</Text>
          </View>
        </View>

        {/* Filter chips inline */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {PERIODS.map(p => {
            const active = selectedPeriod === p.value
            return (
              <TouchableOpacity
                key={p.value}
                onPress={() => setSelectedPeriod(p.value)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </>
  )

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
      <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={displayList}
          keyExtractor={item => item.id}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => (
            <ExpenseItemCard
              item={item}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 12 }}>
              <EmptyList />
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a14' },

  // ── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 9, right: 9,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#00f59b',
    borderWidth: 1.5, borderColor: '#0a0a14',
  },

  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#00f59b', marginRight: 10 },
  avatarPlaceholder: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,245,155,0.15)',
    borderWidth: 2, borderColor: '#00f59b',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  avatarInitial: { color: '#00f59b', fontWeight: '800', fontSize: 14 },
  welcomeText: { color: '#94a3b8', fontSize: 11, marginBottom: 1 },
  userName: { color: '#f1f5f9', fontWeight: '800', fontSize: 15 },
  helloText: { color: '#f1f5f9', fontWeight: '800', fontSize: 22 },
  helloSub: { color: '#94a3b8', fontSize: 13 },

  // ── Balance Card ────────────────────────────────
  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  balanceAmount: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 16,
  },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 14 },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  statItem: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  statIcon: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  statLabel: { color: '#94a3b8', fontSize: 11 },
  statValue: { color: '#f1f5f9', fontWeight: '700', fontSize: 16 },
  statSep: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Action Buttons
  actionRow: { flexDirection: 'row', gap: 10 },
  btnIncome: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00f59b',
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#00f59b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  btnIncomeText: { color: '#0a0a14', fontWeight: '800', fontSize: 13 },
  btnExpense: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,90,90,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,90,90,0.35)',
    paddingVertical: 13,
    borderRadius: 14,
  },
  btnExpenseText: { color: '#ff5a5a', fontWeight: '800', fontSize: 13 },

  // ── Transaction section ──────────────────────────
  txHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  txTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txTitle: { color: '#f1f5f9', fontWeight: '800', fontSize: 15 },
  txCountBadge: {
    backgroundColor: 'rgba(0,245,155,0.15)',
    borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  txCount: { color: '#00f59b', fontSize: 10, fontWeight: '700' },

  // Filter pills (horizontal, compact, to the right)
  filterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: '#00f59b',
    borderColor: '#00f59b',
  },
  filterText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: '#0a0a14', fontWeight: '700' },

  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
})

export default Home