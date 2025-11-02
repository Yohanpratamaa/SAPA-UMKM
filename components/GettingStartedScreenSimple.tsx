import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface GettingStartedScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function GettingStartedScreen({
  onGetStarted,
  onLogin,
}: GettingStartedScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"]}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Background decorative elements */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />
        <View style={[styles.circle, styles.circleMiddle]} />
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Ionicons name="business" size={100} color="#1E40AF" />
          </View>

          <Text style={styles.appName}>SAPA UMKM</Text>
          <Text style={styles.tagline}>
            Sistem Aplikasi Pendampingan Adaptasi UMKM
          </Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Mulai perjalanan digital UMKM Anda bersama platform yang dirancang
              khusus untuk mendukung pertumbuhan usaha Indonesia.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
            <Text style={styles.primaryButtonText}>Daftar Sekarang</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onLogin}>
            <Text style={styles.secondaryButtonText}>Masuk</Text>
            <Ionicons name="log-in-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>

          {/* Features highlight */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.featureText}>Aman & Terpercaya</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featureText}>Komunitas UMKM</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons
                name="trending-up"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.featureText}>Analisis Bisnis</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dengan bergabung, Anda menyetujui syarat dan ketentuan kami
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circleTopRight: {
    width: width * 0.6,
    height: width * 0.6,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  circleBottomLeft: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  circleMiddle: {
    width: 80,
    height: 80,
    top: height * 0.3,
    right: width * 0.1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  logoSection: {
    alignItems: "center",
    marginTop: 80,
  },
  logoContainer: {
    backgroundColor: "white",
    borderRadius: 100,
    padding: 50,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  logoGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  appName: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  tagline: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  descriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  description: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.9,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "white",
    borderWidth: 2,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
