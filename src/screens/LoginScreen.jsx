import {
    ActivityIndicator, StatusBar, StyleSheet,
    Text, TouchableOpacity, View
} from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../services/firebase'

WebBrowser.maybeCompleteAuthSession()

const FEATURES = [
    { icon: 'wallet-outline', text: 'Track expenses & income in one place' },
    { icon: 'pie-chart-outline', text: 'Visual spending insights by category' },
    { icon: 'shield-checkmark-outline', text: 'Cloud sync — data safe across devices' },
    { icon: 'trending-up-outline', text: 'Set budgets & hit your goals' },
]

const LoginScreen = ({ onSkip }) => {
    const [loading, setLoading] = useState(false)

    const webClientId = process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || 'missing-client-id'
    const androidClientId = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID || webClientId

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId,
        androidClientId,
        iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID || webClientId,
        expoClientId: webClientId,
    })

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params
            const credential = GoogleAuthProvider.credential(id_token)
            setLoading(true)
            signInWithCredential(auth, credential)
                .catch((e) => {
                    console.log('Firebase credential auth error:', e)
                    alert('Sign in failed. Check console for details.')
                    setLoading(false)
                })
        }
    }, [response])

    const handleGoogleSignIn = () => {
        if (!process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID) {
            alert('Missing EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID in your .env file.')
            return
        }
        promptAsync()
    }

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a14" />
            <LinearGradient colors={['#0a0a14', '#0d1320', '#0a1628']} style={StyleSheet.absoluteFill} />

            {/* Background glow accent */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            {/* Logo */}
            <View style={styles.logoSection}>
                <View style={styles.logoWrap}>
                    <LinearGradient
                        colors={['#00f59b', '#00d4aa']}
                        style={styles.logoGradient}
                    >
                        <Text style={styles.logoEmoji}>💰</Text>
                    </LinearGradient>
                    {/* Glow ring */}
                    <View style={styles.logoGlow} />
                </View>
                <Text style={styles.appName}>Wallety</Text>
                <Text style={styles.appTagline}>Track your money.{'\n'}Build your future.</Text>
            </View>

            {/* Feature list */}
            <View style={styles.featuresSection}>
                {FEATURES.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                        <View style={styles.featureIconWrap}>
                            <Ionicons name={f.icon} size={18} color="#00f59b" />
                        </View>
                        <Text style={styles.featureText}>{f.text}</Text>
                    </View>
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.btnSection}>
                <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    style={styles.googleBtn}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#111827" />
                    ) : (
                        <>
                            <Text style={styles.googleG}>G</Text>
                            <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>Skip for now — use offline</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0a0a14' },

    glowTop: {
        position: 'absolute',
        top: -80, left: '20%',
        width: 300, height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(0,245,155,0.08)',
    },
    glowBottom: {
        position: 'absolute',
        bottom: -60, right: '10%',
        width: 220, height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(96,165,250,0.07)',
    },

    logoSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    logoWrap: { position: 'relative', marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
    logoGradient: {
        width: 90, height: 90,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00f59b',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 16,
    },
    logoGlow: {
        position: 'absolute',
        width: 110, height: 110,
        borderRadius: 34,
        borderWidth: 1,
        borderColor: 'rgba(0,245,155,0.25)',
    },
    logoEmoji: { fontSize: 46 },
    appName: { color: '#f1f5f9', fontSize: 42, fontWeight: '900', letterSpacing: -1, marginBottom: 10 },
    appTagline: { color: '#94a3b8', fontSize: 16, textAlign: 'center', lineHeight: 24 },

    featuresSection: {
        paddingHorizontal: 32,
        gap: 14,
        marginBottom: 40,
    },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    featureIconWrap: {
        width: 38, height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(0,245,155,0.12)',
        borderWidth: 1, borderColor: 'rgba(0,245,155,0.2)',
        justifyContent: 'center', alignItems: 'center',
    },
    featureText: { color: '#94a3b8', fontSize: 14, flex: 1, lineHeight: 20 },

    btnSection: { paddingHorizontal: 24, paddingBottom: 48, gap: 12 },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 10,
    },
    googleG: { fontSize: 20, fontWeight: '900', color: '#4285F4' },
    googleBtnText: { color: '#111827', fontWeight: '700', fontSize: 16 },

    skipBtn: { alignItems: 'center', paddingVertical: 12 },
    skipText: { color: '#475569', fontSize: 14 },
})

export default LoginScreen
