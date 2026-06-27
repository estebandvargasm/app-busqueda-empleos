import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, View } from '@/src/shared/components/Themed'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '')
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  const jobs = useJobsStore((s) => s.jobs)
  const favorites = useJobsStore((s) => s.favorites)
  const toggleFavorite = useJobsStore((s) => s.toggleFavorite)
  const isFavorite = useJobsStore((s) => s.isFavorite)

  const jobId = Number(id)
  const job = [...favorites, ...jobs].find((j) => j.id === jobId)

  if (!job) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Empleo no encontrado' }} />
        <Text>No se encontró el empleo solicitado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: colors.tint }}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleApply = () => {
    WebBrowser.openBrowserAsync(job.applyUrl)
  }

  const handleShare = () => {
    Share.share({
      message: `${job.title} en ${job.companyName}\n${job.applyUrl}`,
      url: job.applyUrl,
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: job.companyName }} />

      <View style={styles.header}>
        {job.companyLogoUrl ? (
          <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Ionicons name="business-outline" size={32} color="#999" />
          </View>
        )}

        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyName}>{job.companyName}</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={16} color={colors.tint} />
          <Text style={styles.metaText}>{job.candidateLocation}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={colors.tint} />
          <Text style={styles.metaText}>
            {new Date(job.publicationDate).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="pricetag-outline" size={16} color={colors.tint} />
          <Text style={styles.metaText}>{job.category}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="briefcase-outline" size={16} color={colors.tint} />
          <Text style={styles.metaText}>{job.jobType}</Text>
        </View>
      </View>

      {job.salary ? (
        <View style={styles.salaryContainer}>
          <Text style={styles.salaryLabel}>Salario</Text>
          <Text style={styles.salaryValue}>{job.salary}</Text>
        </View>
      ) : null}

      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{stripHtml(job.descriptionHtml)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Aplicar ahora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(job)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite(job.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite(job.id) ? '#e74c3c' : colors.text}
          />
          <Text
            style={[
              styles.favoriteButtonText,
              isFavorite(job.id) && { color: '#e74c3c' },
            ]}
          >
            {isFavorite(job.id) ? 'En favoritos' : 'Guardar en favoritos'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={20} color={colors.text} />
          <Text style={styles.shareButtonText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  backButton: { marginTop: 12 },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    opacity: 0.8,
  },
  salaryContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#e8f4e8',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  salaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
  },
  descriptionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.85,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  applyButton: {
    backgroundColor: '#2f95dc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
