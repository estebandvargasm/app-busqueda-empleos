import { router } from 'expo-router'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import type { JobItem } from '../types/job'

type Props = {
  job: JobItem
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function JobListItem({ job, isFavorite, onToggleFavorite }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
    >
      {/* Logo */}
      {job.companyLogoUrl ? (
        <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
      ) : (
        <View style={[styles.logo, styles.logoPlaceholder]} />
      )}

      {/* Info principal */}
      <View style={styles.info}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.companyName}</Text>
        <Text style={styles.location}>{job.candidateLocation}</Text>
        <Text style={styles.meta}>
          {job.category} • {job.jobType} • {new Date(job.publicationDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Favorito */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ fontSize: 18 }}>{isFavorite ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  logoPlaceholder: {
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  company: {
    fontSize: 13,
    color: '#555',
  },
  location: {
    fontSize: 12,
    color: '#777',
  },
  meta: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  favoriteButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
})