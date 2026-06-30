import React from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

type Props = {
  children: React.ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export default function AnimatedHeart({ children, onPress, style }: Props) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    scale.value = withSpring(0.4, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 6 })
    })
    onPress()
  }

  return (
    <Pressable onPress={handlePress} style={style}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  )
}
