import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Platform } from "react-native"
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import Home from "../screens/Home"
import Create from "../screens/Create"
import Insight from "../screens/Insight"
import Budget from "../screens/Budget"
import Settings from "../screens/Settings"
import Category from "../screens/Category"
import AddIncome from "../screens/AddIncome"
import LoginScreen from "../screens/LoginScreen"
import React, { useState, useEffect } from "react"
import { onAuthStateChanged } from "../services/firestoreService"
import { ActivityIndicator, View } from "react-native"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          height: Platform.OS === 'android' ? 60 : 80,
          paddingBottom: Platform.OS === 'android' ? 8 : 20,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size + 4} />,
        }}
      />
      <Tab.Screen
        name="Insight"
        component={Insight}
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
        options={{
          tabBarLabel: 'Budget',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bullseye-arrow" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        // Only set false if they haven't manually skipped
        setIsAuthenticated(prev => prev ? true : false)
      }
      setIsInitializing(false)
    })
    return unsubscribe
  }, [])

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} onSkip={() => setIsAuthenticated(true)} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="BottomTabs" component={MyTabs} />
          <Stack.Screen
            name="Category"
            component={Category}
            options={{
              presentation: 'transparentModal',
              cardStyle: {
                marginTop: Platform.OS === 'android' ? 75 : 0,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              cardOverlayEnabled: true,
            }}
          />
          <Stack.Screen
            name="AddIncome"
            component={AddIncome}
            options={{ presentation: 'card' }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
