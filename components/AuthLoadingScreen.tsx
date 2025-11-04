import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const AuthLoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.backgroundGradient}
      />

      <View style={styles.contentContainer}>
        <Text style={styles.appTitle}>SAPA UMKM</Text>
        <Text style={styles.subtitle}>Sistem Aplikasi Pendampingan Usaha</Text>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 60,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "white",
    marginTop: 16,
    fontWeight: "600",
  },
});
