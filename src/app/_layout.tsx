import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'
import Colors from '@/src/shared/theme/Colors'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background)
  }, [colors.background])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 20 },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
