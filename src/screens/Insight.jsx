import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { AppContext } from '../Contex/ContextApi'
import tailwind from 'twrnc'
import RenderInsightitem from '../components/RenderInsightitem'


const Insight = () => {
  const data = [{ value: 80 }, { value: 80 }, { value: 90 }, { value: 70 }]
  const { expenses } = useContext(AppContext)

  const chartData = expenses.map(expense => ({
    value: expense.amount,
    color: expense.category?.color || '#666',
    text: expense.category?.name || 'other'
  }))
  return (
    <View>
      <View style={tailwind`items-center my-5`}>
        <Text style={tailwind`text-2xl font-bold`}>Spending Summary</Text>
      </View>
      <View style={tailwind`items-center`}>
        <PieChart
          donut
          data={chartData}
          radius={150}
        />
      </View>

      <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({item})=> <RenderInsightitem item={item}/>}
      />

    </View>
  )
}

export default Insight

const styles = StyleSheet.create({})