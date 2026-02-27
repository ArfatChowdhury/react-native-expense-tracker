import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import tailwind from 'twrnc'
import { COLORS, SHADOW } from '../../theme'
import { AppContext } from '../../Contex/ContextApi'

const FixedIncomeSetup = ({ navigation }) => {
    const { handleAddIncome, addRecurringTransaction } = useContext(AppContext);

    const [salary, setSalary] = useState('');
    const [business, setBusiness] = useState('');
    const [sideHustle, setSideHustle] = useState('');

    const handleNext = () => {
        if (salary) {
            addRecurringTransaction({
                type: 'income',
                title: 'Salary',
                amount: parseFloat(salary),
                category: { name: 'Salary', icon: '💰' },
            });
            handleAddIncome({ amount: salary, source: 'Initial Salary', navigation: null });
        }
        if (business) {
            addRecurringTransaction({
                type: 'income',
                title: 'Business Profit',
                amount: parseFloat(business),
                category: { name: 'Salary', icon: '🏢' },
            });
            handleAddIncome({ amount: business, source: 'Initial Business', navigation: null });
        }
        if (sideHustle) {
            addRecurringTransaction({
                type: 'income',
                title: 'Side Hustle',
                amount: parseFloat(sideHustle),
                category: { name: 'Salary', icon: '⚡' },
            });
            handleAddIncome({ amount: sideHustle, source: 'Initial Hustle', navigation: null });
        }

        navigation.navigate('FixedExpensesSetup');
    }

    return (
        <SafeAreaView style={styles.root}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={tailwind`px-6 pt-10 flex-1`}>
                        <View>
                            <Text style={tailwind`text-sm font-bold text-primary uppercase tracking-widest`}>Step 3 of 5</Text>
                            <Text style={tailwind`text-3xl font-extrabold text-gray-900 mt-2`}>Monthly Income</Text>
                            <Text style={tailwind`text-base text-gray-500 mt-2`}>
                                Add your regular incoming money to calculate your savings potential.
                            </Text>
                        </View>

                        <View style={styles.infoBanner}>
                            <Ionicons name="information-circle" size={24} color="#0D9488" />
                            <Text style={styles.infoText}>
                                <Text style={{ fontWeight: '800' }}>Tip:</Text> You can edit or delete these anytime in <Text style={{ fontWeight: '700' }}>Settings {'>'} Recurring Items</Text>.
                            </Text>
                        </View>

                        <View style={tailwind`mt-6`}>
                            {/* Salary */}
                            <View style={styles.inputGroup}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="cash-outline" size={24} color={COLORS.black} />
                                </View>
                                <View style={tailwind`flex-1 ml-4`}>
                                    <Text style={styles.label}>Salary</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={salary}
                                        onChangeText={setSalary}
                                    />
                                </View>
                            </View>

                            {/* Business */}
                            <View style={styles.inputGroup}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="business-outline" size={24} color={COLORS.black} />
                                </View>
                                <View style={tailwind`flex-1 ml-4`}>
                                    <Text style={styles.label}>Business Profit</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={business}
                                        onChangeText={setBusiness}
                                    />
                                </View>
                            </View>

                            {/* Side Hustle */}
                            <View style={styles.inputGroup}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="flash-outline" size={24} color={COLORS.black} />
                                </View>
                                <View style={tailwind`flex-1 ml-4`}>
                                    <Text style={styles.label}>Side Hustle / Freelance</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={sideHustle}
                                        onChangeText={setSideHustle}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={tailwind`mt-auto pb-10 pt-6`}>
                            <TouchableOpacity
                                style={[styles.btn, (!salary && !business && !sideHustle) && styles.skipBtn]}
                                onPress={handleNext}
                            >
                                <Text style={[styles.btnText, (!salary && !business && !sideHustle) && styles.skipBtnText]}>
                                    {(!salary && !business && !sideHustle) ? 'Skip for now' : 'Continue'}
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={24}
                                    color={(!salary && !business && !sideHustle) ? '#6B7280' : COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#F0FDFA',
        padding: 16,
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCFBF1',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 13,
        color: '#0D9488',
        fontWeight: '600',
        lineHeight: 18,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        ...SHADOW.sm,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: COLORS.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.gray500,
        marginBottom: 4,
    },
    input: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.black,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    btn: {
        backgroundColor: COLORS.black,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 24,
        gap: 12,
        ...SHADOW.md,
    },
    btnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '800',
    },
    skipBtn: {
        backgroundColor: COLORS.gray100,
        ...SHADOW.none,
    },
    skipBtnText: {
        color: '#6B7280',
    }
})

export default FixedIncomeSetup
