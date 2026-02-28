import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import tailwind from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../services/firebase'
import { COLORS } from '../theme' // <-- Fixed named import

WebBrowser.maybeCompleteAuthSession()

const LoginScreen = ({ onSkip }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const webClientId = process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || 'missing-client-id';
    const androidClientId = process.env.EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID || webClientId;

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: webClientId,
        androidClientId: androidClientId,
        iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID || webClientId,
        expoClientId: webClientId,
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            setLoading(true);
            signInWithCredential(auth, credential)
                .catch((e) => {
                    console.log('Firebase credential auth error:', e)
                    alert('Sign in failed. Check console for details.')
                    setLoading(false)
                })
        }
    }, [response]);

    const handleGoogleSignIn = () => {
        if (!process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID) {
            alert('Missing Google Client ID. Check environment variables.')
            return;
        }
        promptAsync();
    }

    const handleEmailAuth = () => {
        setLoading(true);
        // Placeholder for Email Auth logic
        setTimeout(() => {
            setLoading(false);
            alert(isLogin ? "Logged in (Demo)" : "Signed up (Demo)");
            // Note: In real implementation, wire up Firebase SDK functions:
            // signInWithEmailAndPassword or createUserWithEmailAndPassword
        }, 1000)
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={tailwind`flex-grow justify-center px-8 py-10`} showsVerticalScrollIndicator={false}>

                {/* Logo & Branding */}
                <View style={tailwind`items-center mt-10 mb-8`}>
                    <View style={[tailwind`w-20 h-20 rounded-3xl justify-center items-center mb-4 p-2 bg-white`, { ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 }, android: { elevation: 8 } }) }]}>
                        <Image source={require('../../assets/wallety_logo.png')} style={tailwind`w-full h-full rounded-2xl`} resizeMode="contain" />
                    </View>
                    <Text style={[tailwind`text-4xl font-extrabold`, { color: COLORS.textMain }]}>Wallety</Text>
                    <Text style={[tailwind`text-sm mt-2 text-center font-semibold`, { color: COLORS.textSub }]}>
                        Track your money. Build your future.
                    </Text>
                </View>

                {/* Auth Form */}
                <View style={[tailwind`p-6 rounded-3xl mb-8`, { backgroundColor: COLORS.gray100 }]}>
                    <Text style={[tailwind`text-2xl font-bold mb-6`, { color: COLORS.textMain }]}>
                        {isLogin ? 'Welcome Back 👋' : 'Create Account ✨'}
                    </Text>

                    {!isLogin && (
                        <View style={tailwind`mb-4`}>
                            <Text style={[tailwind`text-xs font-bold ml-1 mb-2 uppercase`, { color: COLORS.textSub }]}>Full Name</Text>
                            <TextInput
                                style={[tailwind`px-4 py-4 rounded-2xl font-semibold`, { backgroundColor: COLORS.background, color: COLORS.textMain }]}
                                placeholder="John Doe"
                                placeholderTextColor={COLORS.gray400}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    )}

                    <View style={tailwind`mb-4`}>
                        <Text style={[tailwind`text-xs font-bold ml-1 mb-2 uppercase`, { color: COLORS.textSub }]}>Email Address</Text>
                        <TextInput
                            style={[tailwind`px-4 py-4 rounded-2xl font-semibold`, { backgroundColor: COLORS.background, color: COLORS.textMain }]}
                            placeholder="you@example.com"
                            placeholderTextColor={COLORS.gray400}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={tailwind`mb-6`}>
                        <Text style={[tailwind`text-xs font-bold ml-1 mb-2 uppercase`, { color: COLORS.textSub }]}>Password</Text>
                        <TextInput
                            style={[tailwind`px-4 py-4 rounded-2xl font-semibold`, { backgroundColor: COLORS.background, color: COLORS.textMain }]}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.gray400}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleEmailAuth}
                        disabled={loading}
                        style={[tailwind`rounded-2xl py-4 items-center`, { backgroundColor: COLORS.primary }]}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.black} />
                        ) : (
                            <Text style={[tailwind`font-bold text-lg`, { color: COLORS.black }]}>
                                {isLogin ? 'Log In' : 'Sign Up'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsLogin(!isLogin)}
                        style={tailwind`mt-5 items-center`}
                    >
                        <Text style={[tailwind`font-semibold`, { color: COLORS.textSub }]}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <Text style={{ color: COLORS.primary }}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Social Login */}
                <View style={tailwind`items-center mb-6`}>
                    <Text style={[tailwind`text-xs font-bold mb-4 uppercase`, { color: COLORS.gray500 }]}>Or continue with</Text>
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                        style={[tailwind`flex-row items-center w-full justify-center py-4 rounded-2xl border`, { borderColor: COLORS.gray100, backgroundColor: COLORS.background }]}
                    >
                        <Ionicons name="logo-google" size={20} color={COLORS.textMain} style={tailwind`mr-3`} />
                        <Text style={[tailwind`font-bold text-base`, { color: COLORS.textMain }]}>Google</Text>
                    </TouchableOpacity>
                </View>

                {/* Offline Mode */}
                <TouchableOpacity onPress={onSkip} style={tailwind`items-center py-4`}>
                    <Text style={[tailwind`text-sm font-semibold underline`, { color: COLORS.gray400 }]}>
                        Skip for now — use offline
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen
