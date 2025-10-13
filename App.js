import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc'
import AppNavigator from './src/navigation/AppNavigator';
import { AppContextProvider } from './src/Contex/ContextApi';
export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppContextProvider>



  );
}

