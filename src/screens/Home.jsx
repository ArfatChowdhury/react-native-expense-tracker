import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, StatusBar, ImageBackground, Modal, ScrollView as RNScrollView, Image } from 'react-native'
import React, { useContext, useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { COLORS, SHADOW } from '../theme'
import ExpenseItemCard from '../components/ExpenseItemCard'
import EmptyList from '../components/EmptyList'
import DateFilterBar from '../components/DateFilterBar'
import tailwind from 'twrnc'
import { auth } from '../services/firebase'
const Home = ({ navigation }) => {
  const {
    totalSpent, balance, expenses, allTransactions, handleEdit, handleDelete,
    handleDeleteIncome, categoriesWithBudget, currencySymbol, monthlySummary, appNotifications, logAppNotification,
    prevMonthSummary
  } = useContext(AppContext)

  const [selectedPeriod, setSelectedPeriod] = React.useState('month')
  const [showMonthPicker, setShowMonthPicker] = React.useState(false)
  const [showSummaryModal, setShowSummaryModal] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [isBudgetWarningDismissed, setIsBudgetWarningDismissed] = React.useState(false)
  const [hasDismissedSummaryBanner, setHasDismissedSummaryBanner] = React.useState(false)
  const [hasSeenPreClosingThisMonth, setHasSeenPreClosingThisMonth] = React.useState(false)
  const [showNotifications, setShowNotifications] = React.useState(false)



  // Banner & Popup seen status logic
  React.useEffect(() => {
    const checkSeenStatus = async () => {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const [lastDismissedBanner, lastSeenPreClosing] = await Promise.all([
        AsyncStorage.getItem('summaryBannerDismissedMonth'),
        AsyncStorage.getItem('preClosingSeenMonth')
      ]);

      if (lastDismissedBanner === currentMonth) setHasDismissedSummaryBanner(true);
      if (lastSeenPreClosing === currentMonth) setHasSeenPreClosingThisMonth(true);
    };
    checkSeenStatus();
  }, []);

  const getNotificationIconColor = (type) => {
    if (type === 'success') return COLORS.income;
    if (type === 'warning') return COLORS.expense;
    return COLORS.primary;
  };

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

  // Filter Transactions based on selectedPeriod
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return allTransactions.filter(item => {
      const itemDate = new Date(item.date);
      if (selectedPeriod === 'today') return item.date === todayStr;
      if (selectedPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (selectedPeriod === 'month') {
        return item.date.startsWith(now.toISOString().slice(0, 7));
      }
      if (selectedPeriod === 'calendar') {
        return item.date.startsWith(selectedMonth);
      }
      return true; // 'all'
    });
  }, [allTransactions, selectedPeriod, selectedMonth]);

  // Dynamic Totals based on filter
  const displayTotals = useMemo(() => {
    const spent = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      spent,
      balance: income - spent
    };
  }, [filteredTransactions]);

  const handlePeriodSelect = (period) => {
    if (period === 'calendar') {
      setShowMonthPicker(true)
    }
    setSelectedPeriod(period)
  }

  const overBudgetCategories = categoriesWithBudget.filter(cat => cat.budgetLimit > 0 && cat.amountSpent > cat.budgetLimit)

  const BudgetWarningBanner = () => {
    if (overBudgetCategories.length === 0 || isBudgetWarningDismissed) return null
    return (
      <View style={styles.warningBanner}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Budget')}
          style={tailwind`flex-row items-center flex-1`}
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
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsBudgetWarningDismissed(true)}
          style={tailwind`p-2`}
        >
          <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    )
  }

  const MonthlySummaryBanner = () => {
    if (!monthlySummary.isClosingTime) return null

    // Pre-Closing Info Banner (Last 3 days but not the last day)
    if (monthlySummary.isPreClosing) {
      if (hasSeenPreClosingThisMonth) return null
      return (
        <View style={styles.preClosingBanner}>
          <View style={styles.warningIconBox}>
            <Ionicons name="time" size={24} color="#FFF" />
          </View>
          <View style={styles.warningTextContent}>
            <Text style={styles.warningTitle}>Month Closing Soon</Text>
            <Text style={styles.warningDesc}>
              A new month starts soon! Recurring items will be added automatically.
            </Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              const currentMonth = new Date().toISOString().slice(0, 7);
              await AsyncStorage.setItem('preClosingSeenMonth', currentMonth);
              setHasSeenPreClosingThisMonth(true);
            }}
            style={tailwind`p-2`}
          >
            <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      )
    }

    // actual Closing Day Banner - ONLY SHOW ON LAST DAY
    if (!monthlySummary.isLastDay || hasDismissedSummaryBanner) return null
    const isSavings = monthlySummary.savings > 0;
    const bannerStyle = isSavings ? styles.closingBannerSuccess : styles.closingBannerWarning;
    const iconName = isSavings ? 'trophy' : 'stats-chart';

    return (
      <View style={bannerStyle}>
        <TouchableOpacity
          style={tailwind`flex-row items-center flex-1`}
          activeOpacity={0.8}
          onPress={() => setShowSummaryModal(true)}
        >
          <View style={styles.warningIconBox}>
            <Ionicons name={iconName} size={24} color="#FFF" />
          </View>
          <View style={styles.warningTextContent}>
            <Text style={styles.warningTitle}>
              {isSavings ? 'Monthly Savings!' : 'Monthly Close'}
            </Text>
            <Text style={styles.warningDesc}>
              {isSavings
                ? `Great job! Click to see how much you saved.`
                : `Monthly summary is ready. You've spent slightly more.`}
            </Text>
            <Text style={styles.insightText}>
              Click to see your full summary
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const currentMonth = new Date().toISOString().slice(0, 7);
            await AsyncStorage.setItem('summaryBannerDismissedMonth', currentMonth);
            setHasDismissedSummaryBanner(true);
            logAppNotification("📊 Monthly Summary Ready!", "Your final results for this month are in! Tap to see how you did.", "info");
          }}
          style={tailwind`p-2`}
        >
          <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    )
  }

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Header Top */}
      <View style={styles.topBar}>
        <View style={tailwind`flex-row items-center gap-3`}>
          {auth.currentUser?.photoURL ? (
            <Image source={{ uri: auth.currentUser.photoURL }} style={styles.profilePic} />
          ) : (
            <View style={[styles.profilePic, { backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={20} color={COLORS.black} />
            </View>
          )}
          <View>
            <Text style={styles.greeting}>Hi, {auth.currentUser?.displayName?.split(" ")[0] || "User"} 👋</Text>
            <Text style={styles.subGreeting}>Welcome back!</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMain} />
            {appNotifications?.length > 0 && <View style={styles.dot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <ImageBackground
        source={require('../../assets/card-bg.jpg')}
        style={[
          styles.balanceCard,
          monthlySummary.isDebt && { borderColor: COLORS.expense, borderExtraWidth: 2 }
        ]}
        imageStyle={{ borderRadius: 32 }}
      >
        <View style={styles.cardOverlay} />
        <View style={tailwind`w-full flex-row justify-between items-center`}>
          <Text style={styles.balanceLabel}>
            {selectedPeriod === 'all' ? 'Spent so far' : `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Spending`}
          </Text>
          {prevMonthSummary && selectedPeriod === 'month' && (
            <View style={styles.comparisonBadge}>
              <Ionicons
                name={displayTotals.spent > prevMonthSummary.totalSpent ? "trending-up" : "trending-down"}
                size={12}
                color={displayTotals.spent > prevMonthSummary.totalSpent ? COLORS.expense : COLORS.income}
              />
              <Text style={[styles.comparisonText, { color: displayTotals.spent > prevMonthSummary.totalSpent ? COLORS.expense : COLORS.income }]}>
                {Math.abs(((displayTotals.spent - prevMonthSummary.totalSpent) / (prevMonthSummary.totalSpent || 1)) * 100).toFixed(0)}% vs last
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.balanceAmount}>{currencySymbol}{Number(displayTotals.spent).toFixed(2)}</Text>

        {/* Budget Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill,
              {
                width: `${Math.min((displayTotals.spent / (totalSpent + balance || 1)) * 100, 100)}%`,
                backgroundColor: (displayTotals.spent / (totalSpent + balance || 1)) > 0.9 ? COLORS.expense : COLORS.primary
              }
            ]} />
          </View>
          <View style={tailwind`flex-row justify-between mt-1`}>
            <Text style={styles.progressLabel}>Budget Usage</Text>
            <Text style={styles.progressValue}>{Math.round((displayTotals.spent / (totalSpent + balance || 1)) * 100)}%</Text>
          </View>
        </View>

        <View style={styles.balanceFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Balance left to spend</Text>
            <Text style={[
              styles.footerValue,
              monthlySummary.isDebt && { color: COLORS.expense }
            ]}>
              {currencySymbol}{Number(displayTotals.balance).toFixed(2)}
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Budget Warning Banner */}
      <BudgetWarningBanner />

      {/* Monthly Closing Summary */}
      <MonthlySummaryBanner />

      <DateFilterBar
        selectedPeriod={selectedPeriod}
        onSelect={handlePeriodSelect}
      />

      {selectedPeriod === 'calendar' && (
        <View style={styles.calendarFilterInfo}>
          <Ionicons name="calendar" size={16} color={COLORS.textSub} />
          <Text style={styles.calendarFilterText}>
            Showing: {new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
            <Text style={styles.changeMonthBtn}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={filteredTransactions}
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

      {/* Month Selector Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.monthPickerContainer}>
            <Text style={styles.monthPickerTitle}>Select Month</Text>
            <RNScrollView style={styles.monthList}>
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const val = d.toISOString().slice(0, 7);
                const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
                return (
                  <TouchableOpacity
                    key={val}
                    onPress={() => {
                      setSelectedMonth(val);
                      setShowMonthPicker(false);
                    }}
                    style={[
                      styles.monthItem,
                      selectedMonth === val && styles.monthItemActive
                    ]}
                  >
                    <Text style={[
                      styles.monthItemText,
                      selectedMonth === val && styles.monthItemTextActive
                    ]}>
                      {label}
                    </Text>
                    {selectedMonth === val && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </RNScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Summary Tips Modal */}
      <Modal
        visible={showSummaryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.summaryModalContainer}>
            <View style={[styles.summaryIconBox, { backgroundColor: monthlySummary.isDebt ? '#FEF3C7' : '#D1FAE5' }]}>
              <Ionicons
                name={monthlySummary.isDebt ? 'alert-circle' : 'sparkles'}
                size={40}
                color={monthlySummary.isDebt ? '#D97706' : '#059669'}
              />
            </View>

            <Text style={styles.summaryTitle}>
              {monthlySummary.isDebt ? 'Month Insights' : 'Amazing Progress!'}
            </Text>

            <Text style={styles.summaryAmount}>
              {currencySymbol}{Math.abs(monthlySummary.savings).toFixed(2)}
            </Text>
            <Text style={styles.summarySub}>
              {monthlySummary.isDebt ? 'over your budget this month' : 'saved in your pocket!'}
            </Text>

            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={20} color={COLORS.primary} />
              <Text style={styles.tipText}>
                {monthlySummary.isDebt
                  ? `Tip: You spent most on ${monthlySummary.topCategory}. Try setting a tighter budget for it next month!`
                  : `Tip: Great job saving! Consider putting this ${currencySymbol}${Math.abs(monthlySummary.savings).toFixed(0)} into your emergency fund.`}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowSummaryModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.notificationModalContainer}>
            <Text style={styles.notificationModalTitle}>Notifications</Text>
            <RNScrollView style={tailwind`w-full`} showsVerticalScrollIndicator={false}>
              {(!appNotifications || appNotifications.length === 0) ? (
                <Text style={[tailwind`text-center text-gray-400 mt-10`, { fontWeight: '600' }]}>No notifications yet.</Text>
              ) : appNotifications.map(nav => (
                <View key={nav.id} style={styles.notificationItem}>
                  <View style={[styles.notificationIconBox, { backgroundColor: `${getNotificationIconColor(nav.type)}20` }]}>
                    <Ionicons
                      name={nav.type === 'warning' ? 'warning' : 'information-circle'}
                      size={24}
                      color={getNotificationIconColor(nav.type)}
                    />
                  </View>
                  <View style={tailwind`flex-1`}>
                    <Text style={styles.notificationTitle}>{nav.title}</Text>
                    <Text style={styles.notificationBody}>{nav.body}</Text>
                    <Text style={styles.notificationDate}>{nav.date}</Text>
                  </View>
                </View>
              ))}
            </RNScrollView>
            <TouchableOpacity
              style={[styles.closeModalBtn, { marginTop: 20 }]}
              onPress={() => setShowNotifications(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  subGreeting: { fontSize: 13, color: COLORS.textSub, marginTop: 2, fontWeight: '600' },
  profilePic: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: COLORS.border },

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
  balanceAmount: { color: COLORS.white, fontSize: 44, fontWeight: '900', marginTop: 8 },

  comparisonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  comparisonText: { fontSize: 10, fontWeight: '800' },

  progressContainer: { width: '100%', marginTop: 20 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressLabel: { color: COLORS.gray400, fontSize: 10, fontWeight: '700' },
  progressValue: { color: COLORS.white, fontSize: 10, fontWeight: '800' },

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
  calendarFilterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    gap: 8,
  },
  calendarFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMain,
    flex: 1,
  },
  changeMonthBtn: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  insightText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginTop: 4, fontStyle: 'italic' },
  preClosingBanner: {
    backgroundColor: '#0D9488', // Teal for info
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOW.md,
  },
  closingBannerSuccess: {
    backgroundColor: COLORS.income,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOW.md,
  },
  closingBannerWarning: {
    backgroundColor: '#F59E0B', // Orange for warning
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOW.md,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  monthPickerContainer: {
    width: '100%',
    maxHeight: '60%',
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,
    ...SHADOW.lg,
  },
  monthPickerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  monthList: {
    width: '100%',
  },
  monthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  monthItemActive: {
    borderBottomColor: COLORS.primary,
  },
  monthItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  monthItemTextActive: {
    color: COLORS.textMain,
    fontWeight: '800',
  },
  summaryModalContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    ...SHADOW.lg,
  },
  summaryIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textMain,
    marginVertical: 10,
  },
  summarySub: {
    fontSize: 14,
    color: COLORS.textSub,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '600',
    lineHeight: 20,
  },
  closeModalBtn: {
    backgroundColor: COLORS.black,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    ...SHADOW.md,
  },
  closeModalBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  notificationModalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    ...SHADOW.lg,
  },
  notificationModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  notificationIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: COLORS.textSub,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 6,
    fontWeight: '600',
  }
})

export default Home
