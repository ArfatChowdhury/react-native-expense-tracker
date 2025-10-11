import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home</Text>
      <TouchableOpacity onPress={() =>  navigation.navigate('Check')}>
        <Text>Check</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})