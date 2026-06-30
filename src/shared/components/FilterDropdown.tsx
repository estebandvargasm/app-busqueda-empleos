import { useRef, useState } from 'react'
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/src/shared/theme/Colors'

interface FilterDropdownProps {
  label: string
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
}

export default function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const translateY = useRef(new Animated.Value(300)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  const openSheet = () => {
    setOpen(true)
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start()
  }

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 300, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setOpen(false))
  }

  const displayText = selected ?? label

  return (
    <>
      <Pressable style={[styles.trigger, { backgroundColor: colors.card }]} onPress={openSheet}>
        <Text
          style={[
            styles.triggerText,
            { color: selected ? colors.text : colors.muted },
            !!selected && styles.triggerTextActive,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={12} color={selected ? colors.tint : colors.muted} />
      </Pressable>

      <Modal visible={open} transparent animationType="none" onRequestClose={closeSheet}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }, { backgroundColor: colors.card }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>{label}</Text>
            <FlatList
              data={['All', ...options]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isAll = item === 'All'
                const isSelected = isAll ? selected === null : item === selected
                return (
                  <Pressable
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: colors.inputBg },
                    ]}
                    onPress={() => {
                      onSelect(isAll ? null : item)
                      closeSheet()
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? colors.tint : colors.text },
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.tint} />}
                  </Pressable>
                )
              }}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  triggerText: {
    fontSize: 13,
    flex: 1,
  },
  triggerTextActive: {
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 15,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
})
