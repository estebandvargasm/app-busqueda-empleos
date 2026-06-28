import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import { Text, View } from '@/src/shared/components/Themed'
import { useJobsStore } from '@/src/features/jobs/state/jobsStore'
import Colors from '@/src/shared/theme/Colors'
import { useColorScheme } from '@/src/shared/components/useColorScheme'

function wrapHtml(html: string, dark: boolean): string {
  const bg = dark ? '#0f0f1a' : '#f5f6fa'
  const text = dark ? '#d1d3db' : '#3d3f4e'
  const link = '#3b6df0'
  const cardBg = dark ? '#1a1a2e' : '#ffffff'

  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<style>
  body {
    margin: 0;
    padding: 10px;
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: ${text};
    background: ${cardBg};
  }
  strong, b { font-weight: 600; }
  em, i { font-style: italic; }
  a { color: ${link}; text-decoration: underline; }
  ul, ol { padding-left: 20px; margin: 8px 0; }
  li { margin-bottom: 4px; }
  p { margin: 0 0 10px 0; }
  h1, h2, h3, h4, h5, h6 { font-weight: 600; margin: 14px 0 8px 0; }
  h1 { font-size: 1.4em; } h2 { font-size: 1.25em; } h3 { font-size: 1.15em; }
  img { display: none; }
</style>
<script>
  window.onload = function() {
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  };
  window.onresize = function() {
    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
  };
</script>
</head>
<body>${html}</body>
</html>`
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
  const [webHeight, setWebHeight] = useState(400)

  if (!job) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Empleo', headerStyle: { backgroundColor: '#f5f6fa' } }} />
        <Ionicons name="alert-circle-outline" size={48} color="#b0b3c1" />
        <Text style={styles.notFoundText}>No se encontró el empleo solicitado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const fav = isFavorite(job.id)

  const handleApply = () => {
    WebBrowser.openBrowserAsync(job.applyUrl)
  }

  const handleShare = () => {
    Share.share({
      message: `${job.title} en ${job.companyName}\n${job.applyUrl}`,
    })
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: job.companyName, headerStyle: { backgroundColor: '#f5f6fa' } }} />

      <View style={styles.header}>
        {job.companyLogoUrl ? (
          <Image source={{ uri: job.companyLogoUrl }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="business-outline" size={36} color="#b0b3c1" />
          </View>
        )}

        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.companyName}>{job.companyName}</Text>
      </View>

      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Ionicons name="location-outline" size={14} color="#3b6df0" />
          <Text style={styles.chipText}>{job.candidateLocation}</Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="time-outline" size={14} color="#3b6df0" />
          <Text style={styles.chipText}>{new Date(job.publicationDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="pricetag-outline" size={14} color="#3b6df0" />
          <Text style={styles.chipText}>{job.category}</Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="briefcase-outline" size={14} color="#3b6df0" />
          <Text style={styles.chipText}>{job.jobType}</Text>
        </View>
      </View>

      {job.tags && job.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {job.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {job.salary ? (
        <View style={styles.salaryCard}>
          <View style={styles.salaryInner}>
            <Ionicons name="cash-outline" size={22} color="#22c55e" />
            <View>
              <Text style={styles.salaryLabel}>Salario</Text>
              <Text style={styles.salaryValue}>{job.salary}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <WebView
          style={[styles.webview, { height: webHeight }]}
          source={{ html: wrapHtml(job.descriptionHtml, colorScheme === 'dark') }}
          scrollEnabled={false}
          originWhitelist={['*']}
          onMessage={(e) => {
            const h = Number(e.nativeEvent.data)
            if (h > 0) setWebHeight(h)
          }}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.85}
        >
          <Ionicons name="open-outline" size={20} color="#fff" />
          <Text style={styles.applyButtonText}>Aplicar ahora</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleFavorite(job)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={24}
              color={fav ? '#ef4444' : '#8e92a2'}
            />
            <Text style={[styles.iconButtonText, fav && { color: '#ef4444' }]}>
              {fav ? 'Guardado' : 'Favorito'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={24} color="#8e92a2" />
            <Text style={styles.iconButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f5f6fa',
    gap: 16,
  },
  notFoundText: {
    fontSize: 15,
    color: '#8e92a2',
    textAlign: 'center',
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#3b6df0',
    borderRadius: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#f0f1f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a2e',
    lineHeight: 26,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b6df0',
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipText: {
    fontSize: 12,
    color: '#5c5f6e',
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 6,
  },
  tagChip: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#3b6df0',
    fontWeight: '500',
  },
  salaryCard: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  salaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  salaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  salaryValue: {
    fontSize: 19,
    fontWeight: '700',
    color: '#166534',
  },
  descriptionCard: {
    margin: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 14,
  },
  webview: {
    backgroundColor: 'transparent',
  },
  actions: {
    padding: 12,
    gap: 10,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b6df0',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#3b6df0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e92a2',
  },
})
