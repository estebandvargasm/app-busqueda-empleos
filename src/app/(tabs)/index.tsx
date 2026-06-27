import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { JobListItem } from '@/src/features/jobs/components/JobListItem'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import FilterDropdown from '@/src/shared/components/FilterDropdown'

export default function JobsListScreen() {
  const { jobs, status, error, loadJobs, toggleFavorite, isFavorite } =
    useJobsStore()

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const categories = useMemo(
    () => [...new Set(jobs.map((j) => j.category))].sort(),
    [jobs],
  )
  const jobTypes = useMemo(
    () => [...new Set(jobs.map((j) => j.jobType))].sort(),
    [jobs],
  )

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (categoryFilter && job.category !== categoryFilter) return false
      if (typeFilter && job.jobType !== typeFilter) return false
      return true
    })
  }, [jobs, categoryFilter, typeFilter])

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Cargando empleos...</Text>
      </View>
    )
  }

  if (status === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No se encontraron empleos con los filtros seleccionados.
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