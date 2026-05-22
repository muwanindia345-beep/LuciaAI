import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

// Sakura petal component
function SakuraPetal({ delay, startX, duration }) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay,
      withRepeat(
        withTiming(120, { duration, easing: Easing.linear }),
        -1, false
      )
    );
    translateX.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(startX + 20, { duration: duration / 2 }),
          withTiming(startX - 10, { duration: duration / 2 }),
        ),
        -1, true
      )
    );
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: 300 }),
          withTiming(0.8, { duration: duration - 600 }),
          withTiming(0, { duration: 300 }),
        ),
        -1, false
      )
    );
    rotate.value = withDelay(delay,
      withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1, false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.petal, style]}>🌸</Animated.Text>
  );
}

// Main Lucia Avatar
export default function LuciaAvatar({ isTyping = false, size = 'large' }) {
  const glow = useSharedValue(1);
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    // Breathing glow
    glow.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, true
    );

    // Subtle scale pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 }),
      ),
      -1, true
    );

    // Ring pulse
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1500 }),
        withTiming(1, { duration: 1500 }),
      ),
      -1, true
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 }),
      ),
      -1, true
    );
  }, []);

  // Typing animation — faster pulse
  useEffect(() => {
    if (isTyping) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 400 }),
          withTiming(0.95, { duration: 400 }),
        ),
        -1, true
      );
    } else {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500 }),
          withTiming(1, { duration: 1500 }),
        ),
        -1, true
      );
    }
  }, [isTyping]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value * 0.6,
    shadowRadius: glow.value * 15,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      {/* Sakura petals — only large */}
      {isLarge && (
        <>
          <SakuraPetal delay={0}    startX={-30} duration={3000} />
          <SakuraPetal delay={800}  startX={10}  duration={3500} />
          <SakuraPetal delay={1500} startX={30}  duration={2800} />
          <SakuraPetal delay={400}  startX={-10} duration={4000} />
          <SakuraPetal delay={2000} startX={20}  duration={3200} />
        </>
      )}

      {/* Outer ring */}
      <Animated.View style={[
        styles.ring,
        isLarge ? styles.ringLarge : styles.ringSmall,
        ringStyle
      ]} />

      {/* Avatar */}
      <Animated.View style={[
        styles.avatar,
        isLarge ? styles.avatarLarge : styles.avatarSmall,
        glowStyle, avatarStyle
      ]}>
        <Text style={isLarge ? styles.emojiLarge : styles.emojiSmall}>
          🌸
        </Text>
      </Animated.View>

      {/* Typing dots */}
      {isTyping && isLarge && (
        <View style={styles.typingDots}>
          {[0, 1, 2].map(i => (
            <TypingDot key={i} delay={i * 200} />
          ))}
        </View>
      )}
    </View>
  );
}

function TypingDot({ delay }) {
  const ty = useSharedValue(0);
  useEffect(() => {
    ty.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        -1, false
      )
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }]
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLarge: {
    height: 140,
    width: 140,
  },
  avatar: {
    borderRadius: 100,
    backgroundColor: '#1f2c34',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00a884',
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  avatarLarge: { width: 90, height: 90 },
  avatarSmall: { width: 36, height: 36 },
  emojiLarge: { fontSize: 48 },
  emojiSmall: { fontSize: 20 },
  ring: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#00a884',
  },
  ringLarge: { width: 100, height: 100 },
  ringSmall: { width: 42, height: 42 },
  petal: {
    position: 'absolute',
    fontSize: 14,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: '#00a884',
  },
});
