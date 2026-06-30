import { useState, useEffect } from 'react'
import { Modal, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
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

  const translateY = useSharedValue(300)
  const overlayOpacity = useSharedValue(0)

  useEffect(() => {
    if (open) {
      translateY.value = withTiming(0, { duration: 300 })
      overlayOpacity.value = withTiming(1, { duration: 300 })
    }
  }, [open])

  const handleClose = () => {
    translateY.value = withTiming(300, { duration: 200 })
    overlayOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(setOpen)(false)
    })
  }

  const animatedSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const animatedOverlay = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  const displayText = selected ?? label

  return (
    <>
      <Pressable style={[styles.trigger, { backgroundColor: colors.card }]} onPress={() => setOpen(true)}>
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

      <Modal visible={open} transparent animationType="none" onRequestClose={handleClose}>
        <Animated.View style={[styles.overlay, animatedOverlay]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <Animated.View style={[styles.sheet, animatedSheet, { backgroundColor: colors.card }]}>
            <Pressable onPress={() => {}}>
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
                        handleClose()
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
            </Pressable>
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
