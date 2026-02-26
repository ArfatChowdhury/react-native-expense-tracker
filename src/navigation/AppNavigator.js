import React, { useState, useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Platform, TouchableOpacity, View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Svg, { Path } from "react-native-svg"
import { BlurView } from "expo-blur"

import Home from "../screens/Home"
import Create from "../screens/Create"
import Insight from "../screens/Insight"
import Budget from "../screens/Budget"
import Settings from "../screens/Settings"
import Category from "../screens/Category"
import AddIncome from "../screens/AddIncome"
import LoginScreen from "../screens/LoginScreen"
import { onAuthStateChanged } from "../services/firestoreService"

const { width } = Dimensions.get("window")
const TAB_BAR_WIDTH = width - 40
const TAB_BAR_HEIGHT = 70

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

/* ---------------- NOTCH BACKGROUND ---------------- */

const NotchedBackground = () => {
  const center = TAB_BAR_WIDTH / 2
  const r = 40 // radius of cutout
  const corner = 30

  const path = `
    M ${corner} 0
    H ${center - r}
    A ${r} ${r} 0 0 1 ${center + r} 0
    H ${TAB_BAR_WIDTH - corner}
    Q ${TAB_BAR_WIDTH} 0 ${TAB_BAR_WIDTH} ${corner}
    V ${TAB_BAR_HEIGHT - corner}
    Q ${TAB_BAR_WIDTH} ${TAB_BAR_HEIGHT} ${TAB_BAR_WIDTH - corner} ${TAB_BAR_HEIGHT}
    H ${corner}
    Q 0 ${TAB_BAR_HEIGHT} 0 ${TAB_BAR_HEIGHT - corner}
    V ${corner}
    Q 0 0 ${corner} 0
    Z
  `

  return (
    <View style={styles.svgWrapper}>
      <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
      <Svg width={TAB_BAR_WIDTH} height={TAB_BAR_HEIGHT}>
        <Path d={path} fill="#F8F9FA" stroke="#E5E7EB" strokeWidth={1.5} />
      </Svg>
    </View>
  )
}

/* ---------------- TABS ---------------- */

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Insight" component={Insight} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="SettingsTab" component={Settings} />
    </Tab.Navigator>
  )
}

/* ---------------- FLOATING TAB ---------------- */

const FloatingTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <NotchedBackground />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index
          const isCreate = route.name === "Create"

          let icon
          let label

          switch (route.name) {
            case "Home":
              icon = isFocused ? "home" : "home-outline"
              label = "Home"
              break
            case "Insight":
              icon = isFocused ? "stats-chart" : "stats-chart-outline"
              label = "Insights"
              break
            case "Budget":
              icon = isFocused ? "wallet" : "wallet-outline"
              label = "Budget"
              break
            case "SettingsTab":
              icon = isFocused ? "person" : "person-outline"
              label = "Account"
              break
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          /* ---- CENTER CREATE BUTTON ---- */

          if (isCreate) {
            return (
              <View key={index} style={styles.centerWrapper}>
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.8}
                  style={styles.centerButton}
                >
                  <Ionicons name="add" size={32} color="#FFF" />
                </TouchableOpacity>
              </View>
            )
          }

          /* ---- NORMAL TAB ---- */

          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icon}
                size={22}
                color={isFocused ? "#000" : "#9CA3AF"}
              />
              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    height: TAB_BAR_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 20,
  },

  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: "hidden",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    marginTop: 2,
  },

  activeLabel: {
    color: "#000",
  },

  /* ---- CREATE BUTTON ---- */

  centerWrapper: {
    flex: 1, // Let it take space in the flex row
    alignItems: "center",
    justifyContent: "center",
  },

  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#1E1B4B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40, // Raise properly into the notch
    shadowColor: "#1E1B4B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
})

/* ---------------- AUTH NAV ---------------- */

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) setIsAuthenticated(true)
      setIsInitializing(false)
    })
    return unsubscribe
  }, [])

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onSkip={() => setIsAuthenticated(true)} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="BottomTabs" component={MyTabs} />
          <Stack.Screen name="Category" component={Category} />
          <Stack.Screen name="AddIncome" component={AddIncome} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator