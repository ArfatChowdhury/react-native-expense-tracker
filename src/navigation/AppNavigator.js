import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Platform, TouchableOpacity, View, Text } from "react-native"
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
import { ActivityIndicator, } from "react-native"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: 'home',
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          tabBarIcon: 'add',
        }}
      />
      <Tab.Screen
        name="Insight"
        component={Insight}
        options={{
          tabBarIcon: 'pie-chart',
        }}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
        options={{
          tabBarIcon: 'wallet',
        }}
      />
    </Tab.Navigator>
  )
}

const FloatingTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const isCreate = route.name === 'Create'

          let iconName = options.tabBarIcon
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline'
          else if (route.name === 'Insight') iconName = isFocused ? 'pie-chart' : 'pie-chart-outline'
          else if (route.name === 'Budget') iconName = isFocused ? 'wallet' : 'wallet-outline'
          else if (route.name === 'SettingsTab') iconName = isFocused ? 'settings' : 'settings-outline'

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name)
          }

          if (isCreate) {
            return (
              <TouchableOpacity key={index} onPress={onPress} style={styles.createBtn} activeOpacity={0.8}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity key={index} onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? '#000000' : '#9CA3AF'}
              />
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = {
  tabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000000',
    marginTop: 4,
  },
  createBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 4,
  },
};

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
