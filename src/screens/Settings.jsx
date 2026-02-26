import {
    Alert, Share, StatusBar, StyleSheet, Switch,
    Text, TouchableOpacity, View
} from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'
import { auth } from '../services/firebase'

const CURRENCIES = ['USD', 'BDT', 'EUR', 'GBP', 'INR', 'SAR', 'AED']

const Settings = ({ navigation }) => {
    const { expenses, incomes, currency, setCurrency, setExpenses, setIncomes, isDarkMode, toggleDarkMode } = useContext(AppContext)
    const user = auth.currentUser

    const handleClearAll = () => {
        Alert.alert('Clear All Data', 'This will permanently delete all your data. Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete All', style: 'destructive', onPress: () => { setExpenses([]); setIncomes([]) } }
        ])
    }

    const handleExportCSV = () => {
        const header = 'Type,Title/Source,Amount,Category,Date\n'
        const expenseRows = expenses.map(e => `Expense,"${e.title}",${e.amount},"${e.category?.name || ''}",${e.date}`).join('\n')
        const incomeRows = incomes.map(i => `Income,"${i.source}",${i.amount},,${i.date}`).join('\n')
        Share.share({ message: header + expenseRows + (incomeRows ? '\n' + incomeRows : ''), title: 'My Expense Data' })
    }

    const MenuItem = ({ icon, label, subtitle, onPress, danger, right }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress && !right}
            style={styles.menuItem}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={[styles.menuIcon, danger ? styles.menuIconDanger : styles.menuIconDefault]}>
                <Ionicons name={icon} size={18} color={danger ? '#ff5a5a' : '#00f59b'} />
            </View>
            <View style={styles.menuTextWrap}>
                <Text style={[styles.menuLabel, danger && { color: '#ff5a5a' }]}>{label}</Text>
                {subtitle ? <Text style={styles.menuSub}>{subtitle}</Text> : null}
            </View>
            {right || (onPress && !right ? <Ionicons name="chevron-forward" size={16} color="#475569" /> : null)}
        </TouchableOpacity>
    )

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
            <LinearGradient colors={['#0a0a14', '#0d1320']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={22} color="#f1f5f9" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* User Card */}
                {user && (
                    <View style={styles.userCard}>
                        <View style={styles.userAvatarWrap}>
                            <Text style={styles.userInitial}>{user.displayName?.[0] || 'U'}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.displayName || 'User'}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                        <View style={styles.userBadge}>
                            <Text style={styles.userBadgeText}>Synced ☁️</Text>
                        </View>
                    </View>
                )}

                {/* Currency */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Currency</Text>
                    <View style={styles.currencyCard}>
                        <View style={styles.chipsWrap}>
                            {CURRENCIES.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setCurrency(c)}
                                    style={[styles.chip, currency === c && styles.chipActive]}
                                >
                                    <Text style={[styles.chipText, currency === c && styles.chipTextActive]}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.card}>
                        <MenuItem
                            icon="moon-outline"
                            label="Dark Mode"
                            subtitle="Coming soon to all screens"
                            right={
                                <Switch
                                    value={isDarkMode}
                                    onValueChange={toggleDarkMode}
                                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(0,245,155,0.4)' }}
                                    thumbColor={isDarkMode ? '#00f59b' : '#94a3b8'}
                                />
                            }
                        />
                    </View>
                </View>

                {/* Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>
                    <View style={styles.card}>
                        <MenuItem
                            icon="share-outline"
                            label="Export to CSV"
                            subtitle={`${expenses.length} expenses · ${incomes.length} incomes`}
                            onPress={handleExportCSV}
                        />
                        <View style={styles.divider} />
                        <MenuItem
                            icon="trash-outline"
                            label="Clear All Data"
                            subtitle="This cannot be undone"
                            onPress={handleClearAll}
                            danger
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Wallety v1.0.0</Text>
                    <Text style={styles.footerSub}>Track your money, own your life</Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0a0a14' },
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
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
        justifyContent: 'center', alignItems: 'center',
    },
    title: { color: '#f1f5f9', fontSize: 22, fontWeight: '800' },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: 18,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        gap: 12,
    },
    userAvatarWrap: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(0,245,155,0.15)',
        borderWidth: 1.5, borderColor: '#00f59b',
        justifyContent: 'center', alignItems: 'center',
    },
    userInitial: { color: '#00f59b', fontWeight: '800', fontSize: 18 },
    userInfo: { flex: 1 },
    userName: { color: '#f1f5f9', fontWeight: '700', fontSize: 15 },
    userEmail: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
    userBadge: {
        backgroundColor: 'rgba(0,245,155,0.12)',
        borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: 4,
        borderWidth: 1, borderColor: 'rgba(0,245,155,0.25)',
    },
    userBadgeText: { color: '#00f59b', fontSize: 11, fontWeight: '600' },

    section: { marginHorizontal: 16, marginBottom: 16 },
    sectionTitle: {
        color: '#475569', fontSize: 11, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: 8, marginLeft: 4,
    },

    currencyCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18, padding: 14,
    },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 30, borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    chipActive: { backgroundColor: 'rgba(0,245,155,0.15)', borderColor: '#00f59b' },
    chipText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    chipTextActive: { color: '#00f59b' },

    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18, overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    menuIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    menuIconDefault: { backgroundColor: 'rgba(0,245,155,0.12)' },
    menuIconDanger: { backgroundColor: 'rgba(255,90,90,0.12)' },
    menuTextWrap: { flex: 1 },
    menuLabel: { color: '#f1f5f9', fontWeight: '600', fontSize: 14 },
    menuSub: { color: '#475569', fontSize: 12, marginTop: 2 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 64 },

    footer: { alignItems: 'center', marginTop: 16, paddingBottom: 20 },
    footerText: { color: '#475569', fontSize: 13 },
    footerSub: { color: '#334155', fontSize: 11, marginTop: 2 },
})

export default Settings
