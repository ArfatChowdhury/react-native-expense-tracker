import {
  Alert, Animated, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const SWIPE_THRESHOLD = 80

const ExpenseItemCard = ({ item, onEdit, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current
  const [swiped, setSwiped] = useState(false)
  const [startX, setStartX] = useState(0)

  const handleTouchStart = (e) => setStartX(e.nativeEvent.pageX)

  const handleTouchMove = (e) => {
    const diff = e.nativeEvent.pageX - startX
    if (diff < 0) {
      Animated.timing(translateX, {
        toValue: Math.max(diff, -140),
        duration: 0,
        useNativeDriver: true,
      }).start()
    }
  }

  const handleTouchEnd = (e) => {
    const diff = e.nativeEvent.pageX - startX
    if (diff < -SWIPE_THRESHOLD) {
      Animated.spring(translateX, { toValue: -140, useNativeDriver: true, bounciness: 4 }).start()
      setSwiped(true)
    } else {
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start()
      setSwiped(false)
    }
  }

  const closeSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()
    setSwiped(false)
  }

  const handleEditPress = () => { closeSwipe(); onEdit(item) }
  const handleDeletePress = () => {
    closeSwipe()
    Alert.alert('Delete Expense', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item.id) }
    ])
  }

  const catColor = item.category?.color || '#6b7280'

  return (
    <View style={styles.wrapper}>
      {/* Background action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editBtn}>
          <Ionicons name="pencil" size={18} color="white" />
          <Text style={styles.actionLbl}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeletePress} style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="white" />
          <Text style={styles.actionLbl}>Delete</Text>
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
          activeOpacity={0.9}
          onPress={swiped ? closeSwipe : undefined}
          style={styles.card}
        >
          {/* Left color strip */}
          <View style={[styles.colorStrip, { backgroundColor: catColor }]} />

          <View style={styles.row}>
            {/* Category icon */}
            <View style={[styles.iconBox, { backgroundColor: catColor + '25' }]}>
              <Text style={{ fontSize: 20 }}>{item.icon || item.category?.icon || '💸'}</Text>
            </View>

            {/* Details */}
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <View style={[styles.catBadge, { backgroundColor: catColor + '22', borderColor: catColor + '60' }]}>
                <Text style={[styles.catText, { color: catColor }]}>{item.category?.name || 'Uncategorized'}</Text>
              </View>
            </View>

            {/* Amount + date */}
            <View style={styles.right}>
              <Text style={styles.amount}>-${item.amount}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },

  actionsContainer: {
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    flexDirection: 'row',
  },
  editBtn: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    gap: 3,
  },
  deleteBtn: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    gap: 3,
  },
  actionLbl: { color: '#fff', fontSize: 10, fontWeight: '700' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#161b2e',   // solid dark — avoids Android transparency issues
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
  },
  colorStrip: { width: 4, alignSelf: 'stretch' },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  iconBox: {
    width: 44, height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: { flex: 1, marginRight: 8 },
  title: { color: '#f1f5f9', fontWeight: '700', fontSize: 14, marginBottom: 5 },
  catBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  catText: { fontSize: 10, fontWeight: '700' },

  right: { alignItems: 'flex-end' },
  amount: { color: '#ff5a5a', fontWeight: '800', fontSize: 15, marginBottom: 3 },
  date: { color: '#475569', fontSize: 11 },
})

export default ExpenseItemCard