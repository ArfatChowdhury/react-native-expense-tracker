import { Alert, Share, Switch, Text, TouchableOpacity, View, StyleSheet, ScrollView, StatusBar } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { COLORS, SHADOW } from '../theme'


const Settings = ({ navigation }) => {
    const {
        expenses, incomes, currency, currencySymbol, setExpenses, setIncomes,
        isDarkMode, toggleDarkMode, recurringTransactions, setRecurringTransactions
    } = useContext(AppContext)

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Data',
            'This will permanently delete all your expenses and income. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: () => {
                        setExpenses([])
                        setIncomes([])
                        setRecurringTransactions([])
                        AsyncStorage.removeItem('recurringTransactions')
                        AsyncStorage.removeItem('lastProcessedMonth')
                    }
                }
            ]
        )
    }

    const handleExportCSV = () => {
        const header = 'Type,Title/Source,Amount,Category,Date\n'
        const expenseRows = expenses.map(e =>
            `Expense,"${e.title}",${e.amount},"${e.category?.name || ''}",${e.date}`
        ).join('\n')
        const incomeRows = incomes.map(i =>
            `Income,"${i.source}",${i.amount},,${i.date}`
        ).join('\n')
        const csv = header + expenseRows + (incomeRows ? '\n' + incomeRows : '')

        Share.share({
            message: csv,
            title: 'My Expense Data',
        })
    }

    const MenuItem = ({ icon, label, subtitle, onPress, danger, isSwitch }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress && !isSwitch}
            style={styles.menuItem}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, danger ? styles.dangerIcon : styles.neutralIcon]}>
                <Ionicons name={icon} size={20} color={danger ? COLORS.expense : COLORS.textMain} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, danger && styles.dangerLabel]}>{label}</Text>
                {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
            </View>
            {isSwitch ? (
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: COLORS.gray200, true: COLORS.black }}
                    thumbColor="#ffffff"
                />
            ) : onPress ? (
                <Ionicons name="chevron-forward" size={18} color={COLORS.gray400} />
            ) : null}
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Account</Text>
                    <Text style={styles.subtitle}>Preferances and settings</Text>
                </View>

                {/* Profile Card Mockup */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="white" />
                    </View>
                    <View>
                        <Text style={styles.profileName}>Premium User</Text>
                        <Text style={styles.profileRole}>Diamond Member</Text>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <MenuItem
                        icon="cash-outline"
                        label="Currency"
                        subtitle={`Currently using ${currency} (${currencySymbol})`}
                        onPress={() => navigation.navigate('CurrencySetup', { isSettings: true })}
                    />
                    <MenuItem
                        icon="moon-outline"
                        label="Dark Mode"
                        subtitle={isDarkMode ? 'Appearance is Dark' : 'Appearance is Light'}
                        isSwitch
                    />
                </View>

                {/* Recurring Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Recurring & Planning</Text>
                    <MenuItem
                        icon="calendar-outline"
                        label="Recurring Items"
                        subtitle={`${recurringTransactions.length} items auto-logged monthly`}
                        onPress={() => navigation.navigate('RecurringManager')}
                    />
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Data & Security</Text>
                    <MenuItem
                        icon="cloud-download-outline"
                        label="Export Data"
                        subtitle={`${expenses.length + incomes.length} records available`}
                        onPress={handleExportCSV}
                    />
                    <MenuItem
                        icon="trash-outline"
                        label="Delete Profile Data"
                        subtitle="Wipes all local storage"
                        onPress={handleClearAll}
                        danger
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerApp}>WALLET APP v1.0.0</Text>
                    <Text style={styles.footerMoto}>Premium Financial Tracking</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.background },
    scrollContent: { paddingBottom: 120 },
    header: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 25 },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.textMain },
    subtitle: { fontSize: 14, color: COLORS.textSub, marginTop: 4 },

    profileCard: {
        backgroundColor: COLORS.card,
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 35,
        ...SHADOW.md,
    },
    avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    profileName: { color: 'white', fontSize: 20, fontWeight: '800' },
    profileRole: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginTop: 2 },

    section: { marginBottom: 35 },
    sectionHeader: { fontSize: 12, fontWeight: '800', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, paddingHorizontal: 25 },

    currencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
    currencyBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
    currencyBtnActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
    currencyText: { fontSize: 14, fontWeight: '700', color: COLORS.textSub },
    currencyTextActive: { color: COLORS.white },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
        ...SHADOW.sm,
    },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    neutralIcon: { backgroundColor: COLORS.gray100 },
    dangerIcon: { backgroundColor: '#FFF1F2' },
    menuContent: { flex: 1 },
    menuLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
    dangerLabel: { color: COLORS.expense },
    menuSubtitle: { fontSize: 12, color: COLORS.textSub, marginTop: 2, fontWeight: '600' },

    footer: { alignItems: 'center', marginTop: 20 },
    footerApp: { fontSize: 11, fontWeight: '800', color: COLORS.gray400, letterSpacing: 1 },
    footerMoto: { fontSize: 10, color: COLORS.gray400, marginTop: 4, fontWeight: '600' },
})

export default Settings
