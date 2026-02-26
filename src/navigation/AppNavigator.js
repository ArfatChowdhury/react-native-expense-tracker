import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Platform, StyleSheet, View } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import Home from "../screens/Home"
import Create from "../screens/Create"
import Insight from "../screens/Insight"
import Budget from "../screens/Budget"
import Category from "../screens/Category"
import AddIncome from "../screens/AddIncome"
import Settings from "../screens/Settings"
import LoginScreen from "../screens/LoginScreen"
import React, { useState, useEffect } from "react"
import { onAuthStateChanged } from "../services/firestoreService"
import { ActivityIndicator } from "react-native"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function FloatingTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarOuter}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          let iconName
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline'
          else if (route.name === 'Create') iconName = isFocused ? 'add-circle' : 'add-circle-outline'
          else if (route.name === 'Insight') iconName = isFocused ? 'pie-chart' : 'pie-chart-outline'
          else if (route.name === 'Budget') iconName = isFocused ? 'wallet' : 'wallet-outline'

          const isCenter = route.name === 'Create'

          return (
            <View key={route.key} style={[styles.tabItem, isCenter && styles.tabItemCenter]}>
              {isCenter ? (
                <View
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={onPress}
                  style={styles.centerButton}
                >
                  <Ionicons name="add" size={28} color="#0a0a14" />
                </View>
              ) : (
                <View
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={onPress}
                  style={styles.tabTouchable}
                >
                  {isFocused && <View style={styles.activeIndicator} />}
                  <Ionicons
                    name={iconName}
                    size={24}
                    color={isFocused ? '#00f59b' : '#475569'}
                  />
                </View>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Insight" component={Insight} />
      <Tab.Screen name="Budget" component={Budget} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
        setCurrentUser(user)
      } else {
        setIsAuthenticated(prev => prev ? true : false)
        setCurrentUser(null)
      }
      setIsInitializing(false)
    })
    return unsubscribe
  }, [])

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a14' }}>
        <ActivityIndicator size="large" color="#00f59b" />
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
          <Stack.Screen name="BottomTabs">
            {(props) => <MyTabs {...props} />}
          </Stack.Screen>
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="Category"
            component={Category}
            options={{
              presentation: 'transparentModal',
              cardStyle: {
                marginTop: Platform.OS === 'android' ? 75 : 0,
                backgroundColor: '#0d1320',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
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

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 16 : 28,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,19,32,0.95)',
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00f59b',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00f59b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f59b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    marginTop: -12,
  },
})

export default AppNavigator
