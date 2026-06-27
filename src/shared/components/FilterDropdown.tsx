import { useState } from 'react'
import { Modal, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

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
        <FontAwesome name="chevron-down" size={10} color="#888" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
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
                    {isSelected && <FontAwesome name="check" size={14} color="#007AFF" />}
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
  },
  triggerText: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  triggerTextActive: {
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 34,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionSelected: {
    backgroundColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
})
