import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import FilterDropdown from '@/src/shared/components/FilterDropdown'

export default function JobsListScreen() {
  const { jobs, categories, status, error, loadJobs, loadCategories, toggleFavorite, isFavorite } =
    useJobsStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
    loadCategories()
  }, [loadJobs, loadCategories])

  const jobTypes = useMemo(
    () => [...new Set(jobs.map((j) => j.jobType))].sort(),
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return jobs.filter((job) => {
      if (query && !job.title.toLowerCase().includes(query) && !job.companyName.toLowerCase().includes(query)) {
        return false
      }
      if (categoryFilter && job.category !== categoryFilter) return false
      if (typeFilter && job.jobType !== typeFilter) return false
      return true
    })
  }, [jobs, searchQuery, categoryFilter, typeFilter])

  const handleRefresh = useCallback(() => {
    loadJobs()
  }, [loadJobs])

  if (status === 'loading' && jobs.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.centeredText}>Cargando empleos...</Text>
      </View>
    )
  }

  if (status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o empresa..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filters}>
        <FilterDropdown
          label="Categoría"
          options={categories}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
        <FilterDropdown
          label="Tipo de trabajo"
          options={jobTypes}
          selected={typeFilter}
          onSelect={setTypeFilter}
        />
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        refreshing={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || categoryFilter || typeFilter
                ? 'No se encontraron empleos con los filtros seleccionados.'
                : 'No hay empleos disponibles en este momento.'}
            </Text>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})