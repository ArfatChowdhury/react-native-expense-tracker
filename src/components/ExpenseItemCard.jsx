import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import tailwind from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const SWIPE_THRESHOLD = 80;

const ExpenseItemCard = ({ item, onEdit, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swiped, setSwiped] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e) => {
    setStartX(e.nativeEvent.pageX);
  };

  const handleTouchMove = (e) => {
    const diff = e.nativeEvent.pageX - startX;
    if (diff < 0) {
      // Only allow swiping left
      Animated.timing(translateX, {
        toValue: Math.max(diff, -140),
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleTouchEnd = (e) => {
    const diff = e.nativeEvent.pageX - startX;
    if (diff < -SWIPE_THRESHOLD) {
      // Snap to reveal buttons
      Animated.spring(translateX, {
        toValue: -140,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
      setSwiped(true);
    } else {
      // Snap back
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
      setSwiped(false);
    }
  };

  const closeSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setSwiped(false);
  };

  const handleEdit = () => {
    closeSwipe();
    onEdit(item);
  };

  const handleDelete = () => {
    closeSwipe();
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) }
      ]
    );
  };

  return (
    <View style={tailwind`my-2 overflow-hidden rounded-xl`}>
      {/* Action buttons behind card */}
      <View style={[tailwind`absolute right-0 top-0 bottom-0 flex-row`]}>
        <TouchableOpacity
          onPress={handleEdit}
          style={[tailwind`bg-blue-500 justify-center items-center`, { width: 70 }]}
        >
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={tailwind`text-white text-xs mt-1 font-medium`}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[tailwind`bg-red-500 justify-center items-center rounded-r-xl`, { width: 70 }]}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={tailwind`text-white text-xs mt-1 font-medium`}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable card */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={swiped ? closeSwipe : undefined}
          style={tailwind`bg-white p-4 rounded-xl`}
        >
          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-row items-center flex-1`}>
              <View style={tailwind`w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4`}>
                <Text style={tailwind`text-2xl`}>{item.icon || item.category?.icon}</Text>
              </View>
              <View style={tailwind`flex-1`}>
                <Text style={tailwind`text-base font-bold text-gray-800`}>{item.title}</Text>
                <View style={[
                  tailwind`mt-1 px-2 py-0.5 rounded-lg self-start`,
                  { backgroundColor: item.category?.color || '#e5e7eb' }
                ]}>
                  <Text style={tailwind`text-xs font-bold text-gray-700`}>
                    {item.category?.name || 'Uncategorized'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tailwind`items-end`}>
              <Text style={tailwind`text-base font-bold text-gray-900`}>-${item.amount}</Text>
              <Text style={tailwind`text-xs text-gray-400 mt-0.5`}>{item.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ExpenseItemCard;