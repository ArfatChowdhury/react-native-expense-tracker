import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tailwind from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../services/firebase'

WebBrowser.maybeCompleteAuthSession()

/**
 * LoginScreen
 *
 * Currently shows the UI for Google Sign-In.
 * To activate real authentication:
 *
 * 1. Follow the setup steps in src/services/firebase.js
 * 2. Uncomment the import and call below:
 *    import { signInWithGoogle } from '../services/firestoreService'
 * 3. Replace handleGoogleSignIn body with:
 *    const userCredential = await signInWithGoogle()
 *    // Navigation is handled automatically by the auth gate in AppNavigator
 */

const LoginScreen = ({ onSkip }) => {
    const [loading, setLoading] = useState(false)

    // Using exact web client ID. Note: For a real Expo Go / EAS build, you usually need
    // an explicitly created iOS/Android client ID or an Expo proxy setup.
    // For this example, we assume the web client ID from your env vars mapped via proxy.
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || 'missing-client-id',
        // Depending on your setup, you might need expoClientId, iosClientId, androidClientId
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            setLoading(true);
            signInWithCredential(auth, credential)
                .then(() => {
                    // Navigation handled automatically by AppNavigator's onAuthStateChanged observer
                })
                .catch((e) => {
                    console.log('Firebase credential auth error:', e)
                    alert('Sign in failed. Check console for details.')
                    setLoading(false)
                })
        }
    }, [response]);

    const handleGoogleSignIn = () => {
        if (!process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID) {
            alert('Missing EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID in your .env file.\n\nPlease check src/services/firebase.js for setup steps.')
            return;
        }
        promptAsync();
    }

    return (
        <LinearGradient
            colors={['#0f172a', '#1e293b', '#0f3460']}
            style={tailwind`flex-1 justify-between px-8 py-16`}
        >
            {/* Logo & Branding */}
            <View style={tailwind`items-center mt-12`}>
                <View style={tailwind`bg-green-500 w-24 h-24 rounded-3xl justify-center items-center mb-6 shadow-lg`}>
                    <Text style={tailwind`text-5xl`}>💰</Text>
                </View>
                <Text style={tailwind`text-4xl font-bold text-white`}>Wallety</Text>
                <Text style={tailwind`text-base text-gray-400 mt-2 text-center`}>
                    Track your money.{'\n'}Build your future.
                </Text>
            </View>

            {/* Feature highlights */}
            <View style={tailwind`gap-3`}>
                {[
                    { icon: 'wallet-outline', text: 'Track expenses & income in one place' },
                    { icon: 'pie-chart-outline', text: 'Visual spending insights by category' },
                    { icon: 'shield-checkmark-outline', text: 'Cloud sync — data safe across devices' },
                    { icon: 'trending-up-outline', text: 'Set budgets & hit your goals' },
                ].map((f, i) => (
                    <View key={i} style={tailwind`flex-row items-center`}>
                        <View style={tailwind`bg-green-500 bg-opacity-20 w-10 h-10 rounded-full justify-center items-center mr-4`}>
                            <Ionicons name={f.icon} size={20} color="#4ade80" />
                        </View>
                        <Text style={tailwind`text-gray-300 text-sm flex-1`}>{f.text}</Text>
                    </View>
                ))}
            </View>

            {/* Buttons */}
            <View style={tailwind`gap-4`}>
                <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                    style={tailwind`bg-white rounded-2xl py-4 flex-row justify-center items-center`}
                >
                    {loading ? (
                        <ActivityIndicator color="#1a1a1a" />
                    ) : (
                        <>
                            <Text style={tailwind`text-2xl mr-3`}>🔵</Text>
                            <Text style={tailwind`text-gray-900 font-bold text-base`}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={onSkip} style={tailwind`items-center py-3`}>
                    <Text style={tailwind`text-gray-400 text-sm`}>Skip for now — use offline</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default LoginScreen
