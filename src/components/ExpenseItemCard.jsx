import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import tailwind from 'twrnc';

const ExpenseItemCard = ({ item, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const handleLongPress = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit(item);
  };

  const handleDelete = () => {
    setMenuVisible(false);
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
    <>
      <TouchableOpacity 
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={tailwind`my-2`}
      >
        <View style={tailwind`bg-white p-4 rounded-xl`}>
          <View style={tailwind`flex-row items-center justify-between`}>
            
            <View style={tailwind`flex-row items-center flex-1`}>
              <View style={tailwind`w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4`}>
                <Text>{item.icon || item.category?.icon}</Text>
              </View>
              
              <View style={tailwind`flex-1`}>
                <Text style={tailwind`text-base font-bold text-gray-800`}>{item.title}</Text>
                <View style={[
                  tailwind`mt-1 px-2 py-1 rounded-lg self-start`,
                  { backgroundColor: item.category?.color || '#FF6B6B' }
                ]}>
                  <Text style={tailwind`text-xs font-bold text-gray-700`}>
                    {item.category?.name || 'Uncategorized'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={tailwind`items-end`}>
              <Text style={tailwind`text-base font-bold`}>${item.amount}</Text>
              <Text style={tailwind`text-xs text-gray-500`}>{item.date}</Text>
            </View>
            
          </View>
        </View>
      </TouchableOpacity>

      {/* Custom Context Menu */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={tailwind`flex-1`}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[tailwind`absolute bg-white rounded-lg shadow-lg p-2 w-40`, 
            { top: menuPosition.y - 100, left: menuPosition.x - 150 }]}>
            
            <TouchableOpacity 
              style={tailwind`flex-row items-center px-4 py-3`}
              onPress={handleEdit}
            >
              <Text style={tailwind`ml-2 text-base text-gray-800`}>Edit</Text>
            </TouchableOpacity>
            
            <View style={tailwind`h-px bg-gray-200 mx-2`} />
            
            <TouchableOpacity 
              style={tailwind`flex-row items-center px-4 py-3`}
              onPress={handleDelete}
            >
              <Text style={tailwind`ml-2 text-base text-red-600`}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ExpenseItemCard;