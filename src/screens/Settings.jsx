import { Alert, Share, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import tailwind from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { AppContext } from '../Contex/ContextApi'

const CURRENCIES = ['USD', 'BDT', 'EUR', 'GBP', 'INR', 'SAR', 'AED']

const Settings = () => {
    const { expenses, incomes, currency, setCurrency, setExpenses, setIncomes, isDarkMode, toggleDarkMode } = useContext(AppContext)

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

    const MenuItem = ({ icon, label, subtitle, onPress, danger }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={tailwind`bg-white rounded-2xl p-4 mb-3 flex-row items-center mx-5 shadow-sm`}
        >
            <View style={[tailwind`w-10 h-10 rounded-full justify-center items-center mr-4`, danger ? tailwind`bg-red-100` : tailwind`bg-green-100`]}>
                <Ionicons name={icon} size={20} color={danger ? '#ef4444' : '#16a34a'} />
            </View>
            <View style={tailwind`flex-1`}>
                <Text style={[tailwind`font-semibold text-base`, danger ? tailwind`text-red-600` : tailwind`text-gray-800`]}>{label}</Text>
                {subtitle ? <Text style={tailwind`text-xs text-gray-400 mt-0.5`}>{subtitle}</Text> : null}
            </View>
            {onPress ? <Ionicons name="chevron-forward" size={18} color="#d1d5db" /> : null}
            {label === 'Dark Mode' && (
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{ false: '#d1d5db', true: '#16a34a' }}
                    thumbColor="#ffffff"
                />
            )}
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
            <View style={tailwind`px-5 pt-3 pb-5`}>
                <Text style={tailwind`text-2xl font-bold text-gray-900`}>Settings</Text>
            </View>

            {/* Currency */}
            <View style={tailwind`px-5 mb-2`}>
                <Text style={tailwind`text-xs font-bold text-gray-400 uppercase mb-2 ml-1`}>Currency</Text>
                <View style={tailwind`bg-white rounded-2xl p-4 flex-row flex-wrap gap-2`}>
                    {CURRENCIES.map(c => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => setCurrency(c)}
                            style={[
                                tailwind`px-4 py-2 rounded-full border-2`,
                                currency === c ? tailwind`border-green-500 bg-green-500` : tailwind`border-gray-200`
                            ]}
                        >
                            <Text style={[tailwind`text-sm font-bold`, currency === c ? tailwind`text-white` : tailwind`text-gray-600`]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Actions */}
            <View style={tailwind`mt-4`}>
                <Text style={tailwind`text-xs font-bold text-gray-400 uppercase mb-2 ml-6`}>Preferences</Text>
                <MenuItem
                    icon="moon-outline"
                    label="Dark Mode"
                    subtitle="Coming soon to all screens"
                />

                <Text style={tailwind`text-xs font-bold text-gray-400 uppercase mb-2 ml-6 mt-4`}>Data</Text>
                <MenuItem
                    icon="share-outline"
                    label="Export to CSV"
                    subtitle={`${expenses.length} expenses · ${incomes.length} incomes`}
                    onPress={handleExportCSV}
                />
                <MenuItem
                    icon="trash-outline"
                    label="Clear All Data"
                    subtitle="This cannot be undone"
                    onPress={handleClearAll}
                    danger
                />
            </View>

            {/* App info */}
            <View style={tailwind`items-center mt-8`}>
                <Text style={tailwind`text-gray-300 text-sm`}>Wallety v1.0.0</Text>
                <Text style={tailwind`text-gray-300 text-xs mt-1`}>Track your money, own your life</Text>
            </View>
        </SafeAreaView>
    )
}

export default Settings
