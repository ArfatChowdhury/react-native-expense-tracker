import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const PERIODS = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'All Time', value: 'all' },
]

const DateFilterBar = ({ selectedPeriod, onSelect }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tailwind`px-5 py-2 gap-2`}
        >
            {PERIODS.map(p => (
                <TouchableOpacity
                    key={p.value}
                    onPress={() => onSelect(p.value)}
                    style={[
                        tailwind`px-4 py-2 rounded-full border-2`,
                        selectedPeriod === p.value
                            ? tailwind`border-green-500 bg-green-500`
                            : tailwind`border-gray-200 bg-white`
                    ]}
                >
                    <Text style={[
                        tailwind`text-sm font-semibold`,
                        selectedPeriod === p.value ? tailwind`text-white` : tailwind`text-gray-500`
                    ]}>
                        {p.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default DateFilterBar
