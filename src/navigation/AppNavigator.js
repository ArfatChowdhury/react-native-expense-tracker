import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Home from "../screens/Home"
import Create from "../screens/Create"
import Insight from "../screens/Insight"
import { createStackNavigator } from "@react-navigation/stack"
import Check from "../screens/Check"



const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
function MyTabs () {
    return(
    <Tab.Navigator>
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Create" component={Create}/>
        <Tab.Screen name="Insight" component={Insight}/>
    </Tab.Navigator>
    )
}


const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="BottomTabs" component={MyTabs}/>
        <Stack.Screen name='Check' component={Check}/>
    </Stack.Navigator>
  )
}

export default AppNavigator

