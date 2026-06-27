import { FlatList, Text, View } from 'react-native'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useJobsStore()

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No tienes empleos guardados en favoritos.</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <JobListItem
            job={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
            // más adelante aquí pondremos onPress para ir al detalle
          />
        )}
      />
    </View>
  )
}