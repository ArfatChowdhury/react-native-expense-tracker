import { View, Text } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const RenderInsightitem = ({item}) => {
  return (
    <View>
      <View><Text style={[tailwind`rounded-full`, {backgroundColor: item.category.color}]}>{}</Text>
      <Text>{item.title}</Text></View>
    </View>
  )
}

export default RenderInsightitem