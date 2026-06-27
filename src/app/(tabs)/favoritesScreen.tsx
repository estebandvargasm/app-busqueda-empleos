import { FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import { Text, View } from '@/src/shared/components/Themed'
import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useJobsStore()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color={colors.tabIconDefault} />
        <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
        <Text style={styles.emptySubtitle}>
          Guarda empleos tocando el ícono de estrella{'\n'}y los verás aquí.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>{favorites.length} empleo{favorites.length === 1 ? '' : 's'} guardado{favorites.length === 1 ? '' : 's'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobListItem
            job={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
  },
})