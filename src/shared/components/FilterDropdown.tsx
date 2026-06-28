import { useState } from 'react'
import { Modal, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface FilterDropdownProps {
  label: string
  options: string[]
  selected: string | null
  onSelect: (value: string | null) => void
}

export default function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)

  const displayText = selected ?? label

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, !!selected && styles.triggerTextActive]} numberOfLines={1}>
          {displayText}
        </Text>
        <Ionicons name="chevron-down" size={12} color={selected ? '#3b6df0' : '#b0b3c1'} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{label}</Text>

            <FlatList
              data={['All', ...options]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isAll = item === 'All'
                const isSelected = isAll ? selected === null : item === selected
                return (
                  <Pressable
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      onSelect(isAll ? null : item)
                      setOpen(false)
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color="#3b6df0" />}
                  </Pressable>
                )
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  triggerText: {
    fontSize: 13,
    color: '#8e92a2',
    flex: 1,
  },
  triggerTextActive: {
    color: '#1a1a2e',
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#d0d3dc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
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
  optionSelected: {
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#3b6df0',
  },
})
