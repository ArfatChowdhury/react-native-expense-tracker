import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import tailwind from 'twrnc'
import { COLORS, SHADOW } from '../../theme'
import { AppContext } from '../../Contex/ContextApi'

const WelcomeScreen = ({ navigation }) => {
    const { setUserName } = useContext(AppContext);
    const [name, setName] = useState('');

    const handleNext = () => {
        if (!name.trim()) return;
        setUserName(name.trim());
        navigation.navigate('CurrencySetup');
    }

    return (
        <SafeAreaView style={styles.root}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={tailwind`px-6 pt-10 flex-1 justify-between pb-10`}>
                        <View>
                            <View style={styles.iconContainer}>
                                <Ionicons name="wallet-outline" size={60} color={COLORS.black} />
                            </View>

                            <Text style={tailwind`text-sm font-bold text-primary uppercase tracking-widest mt-8`}>Step 1 of 5</Text>
                            <Text style={[tailwind`text-4xl font-extrabold text-gray-900 mt-2`, { lineHeight: 48 }]}>
                                Welcome to{"\n"}
                                <Text style={{ color: COLORS.primary }}>Wallety</Text>
                            </Text>

                            <Text style={tailwind`text-lg text-gray-500 mt-4 leading-6`}>
                                Your premium companion for tracking expenses and saving money with ease.
                            </Text>

                            <View style={tailwind`mt-12`}>
                                <Text style={tailwind`text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest`}>What's your name?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.btn, !name.trim() && { opacity: 0.5 }]}
                            onPress={handleNext}
                            disabled={!name.trim()}
                        >
                            <Text style={styles.btnText}>Let's Get Started</Text>
                            <Ionicons name="arrow-forward" size={24} color={COLORS.white} />
                        </TouchableOpacity>
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
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOW.md,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 18,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.black,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...SHADOW.sm,
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
    }
})

export default WelcomeScreen
