import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  const loadingDots = useMemo(
    () => [
      new Animated.Value(0.3),
      new Animated.Value(0.3),
      new Animated.Value(0.3),
    ],
    []
  );

  useEffect(() => {
    const animationSequence = () => {
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Logo scale and fade in with bounce effect
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // Text fade in
      setTimeout(() => {
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1000);

      // Loading dots animation
      setTimeout(() => {
        const animateLoadingDots = () => {
          loadingDots.forEach((dot, index) => {
            Animated.loop(
              Animated.sequence([
                Animated.timing(dot, {
                  toValue: 1,
                  duration: 400,
                  delay: index * 200,
                  useNativeDriver: true,
                }),
                Animated.timing(dot, {
                  toValue: 0.3,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            ).start();
          });
        };
        animateLoadingDots();
      }, 1500);

      // Auto navigate after animation
      setTimeout(() => {
        onFinish();
      }, 3500);
    };

    animationSequence();
  }, [
    onFinish,
    backgroundOpacity,
    logoScale,
    logoOpacity,
    textOpacity,
    loadingDots,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Background with Complex Gradient */}
      <Animated.View
        style={[styles.backgroundContainer, { opacity: backgroundOpacity }]}
      >
        <LinearGradient
          colors={["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"]}
          locations={[0, 0.3, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Background Pattern - Multiple layers */}
        <View style={styles.patternContainer}>
          {/* Large decorative circles */}
          <View
            style={[
              styles.circle,
              {
                width: width * 1.2,
                height: width * 1.2,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                top: -width * 0.6,
                right: -width * 0.4,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: width * 0.9,
                height: width * 0.9,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                bottom: -width * 0.3,
                left: -width * 0.25,
              },
            ]}
          />

          {/* Medium circles */}
          <View
            style={[
              styles.circle,
              {
                width: width * 0.4,
                height: width * 0.4,
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                top: height * 0.15,
                left: -width * 0.1,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: width * 0.3,
                height: width * 0.3,
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                bottom: height * 0.2,
                right: -width * 0.05,
              },
            ]}
          />

          {/* Small accent circles */}
          <View
            style={[
              styles.circle,
              {
                width: 60,
                height: 60,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                top: height * 0.25,
                right: width * 0.15,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: 40,
                height: 40,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                bottom: height * 0.35,
                left: width * 0.2,
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          {/* Logo Background with shadow and glow effect */}
          <View style={styles.logoBackground}>
            <View style={styles.logoGlow} />
            <Ionicons name="business" size={90} color="#1E40AF" />
          </View>

          {/* App Name with better typography */}
          <Animated.View style={{ opacity: textOpacity }}>
            <Text style={styles.appTitle}>SAPA UMKM</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Sistem Aplikasi Pendampingan</Text>
            </View>
            <Text style={styles.description}>Adaptasi UMKM Indonesia</Text>
          </Animated.View>
        </Animated.View>

        {/* Enhanced Loading Indicator */}
        <Animated.View
          style={[styles.loadingContainer, { opacity: textOpacity }]}
        >
          <View style={styles.dotsContainer}>
            {loadingDots.map((dot, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    opacity: dot,
                    transform: [
                      {
                        scale: dot.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [1, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.loadingText}>Memuat aplikasi...</Text>
        </Animated.View>

        {/* Enhanced Version Info */}
        <Animated.View
          style={[styles.versionContainer, { opacity: textOpacity }]}
        >
          <View style={styles.versionBox}>
            <Text style={styles.versionText}>
              Versi 1.0.0 • © 2025 SAPA UMKM
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoBackground: {
    backgroundColor: "white",
    borderRadius: 80,
    padding: 40,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 80,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  appTitle: {
    color: "white",
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  subtitleContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  description: {
    color: "#BFDBFE",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingDot: {
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  loadingText: {
    color: "#BFDBFE",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  versionContainer: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  versionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  versionText: {
    color: "#BFDBFE",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
