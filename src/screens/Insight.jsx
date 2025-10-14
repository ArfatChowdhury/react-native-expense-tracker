import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { AppContext } from '../Contex/ContextApi'
import tailwind from 'twrnc'
import RenderInsightitem from '../components/RenderInsightitem'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categories } from '../Data/categoriesData'


const Insight = () => {
  const data = [{ value: 80 }, { value: 80 }, { value: 90 }, { value: 70 }]
  const { expenses, totalSpent } = useContext(AppContext)

  if(totalSpent === 0 || expenses.length === 0){
    return (
      <SafeAreaView style={tailwind`flex-1 justify-center items-center`}>
        <Text style={tailwind`text-lg text-gray-500`}>No expenses to show</Text>
      </SafeAreaView>
    )
  }
  
  const spendingByCategory = expenses.reduce((acc, expense) => {
    const categoryName = expense.category?.name || 'Other';
    // Convert to number before adding
    const amount = Number(expense.amount) || 0;
    acc[categoryName] = (acc[categoryName] || 0) + amount;
    return acc;
}, {});


  
  const chartData =  Object.keys(spendingByCategory).map((categoryName)=>{
    const amount = spendingByCategory[categoryName]
    const percentage = Math.round((amount /  totalSpent) *100 )
    const categoryInfo = categories.find((cat) => cat.name === categoryName)
    // console.log(categoryInfo?.color, 'categoryinfo');
  
    return{
      value: percentage, // This is what PieChart uses for slice size
      color: categoryInfo?.color || '#000000',
      text: `${percentage}%`,
      label: categoryName // For reference
    }
  })
  
  const flatListData = Object.keys(spendingByCategory).map((categoryName) => {
    const amount = spendingByCategory[categoryName]
    const categoryInfo = categories.find((cat) => cat.name === categoryName)
    
    return {
      id: categoryName, // Use category name as ID
      category: {
        name: categoryName,
        color: categoryInfo?.color || '#000000'
      },
      amount: amount
    }
  })
  
  return (
    <SafeAreaView style={tailwind`flex-1`} >
      <View style={tailwind`items-center my-5`}>
        <Text style={tailwind`text-2xl font-bold`}>Spending Summary</Text>
      </View>
      <View style={tailwind`items-center`}>
        <PieChart
           donut
           data={chartData}
           radius={150}
           textColor="gray"
           fontWeight="bold"
           textSize={14}
           showTextBackground={false}
           textBackgroundRadius={15}
           showText={chartData.map(item => item.value >= 5)}
        />
      </View>

      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderInsightitem item={item} />}
      />

    </SafeAreaView>
  )
}

export default Insight

const styles = StyleSheet.create({})