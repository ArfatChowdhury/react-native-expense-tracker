import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"
import Create from "../screens/Create"
import Insight from "../screens/Insight"
import { createStackNavigator } from "@react-navigation/stack"
import Check from "../screens/Check"
import Category from "../screens/Category"
import { Platform } from "react-native"
import { AntDesign, Ionicons } from "@expo/vector-icons"



const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="home" size={size} color={color} />)

      }} />
      <Tab.Screen name="Create" component={Create} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name="add-circle" color={color} size={size} />
        )
      }} />
      <Tab.Screen name="Insight" component={Insight}  options={{
        tabBarIcon: ({ color, size, focused }) => (
          <AntDesign name="pie-chart" color={color} size={size} />
        )
      }}  />
    </Tab.Navigator>
  )
}


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={MyTabs} />
      <Stack.Screen name="Category" component={Category}

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
    </Stack.Navigator>
  )
}

export default AppNavigator

