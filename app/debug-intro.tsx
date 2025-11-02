import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DebugState = "splash" | "onboarding" | "getting-started" | "complete";

export default function DebugIntroScreen() {
  const [currentState, setCurrentState] = useState<DebugState>("splash");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (currentState === "splash" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentState === "splash" && countdown === 0) {
      setCurrentState("onboarding");
    }
  }, [currentState, countdown]);

  const resetFlow = () => {
    setCurrentState("splash");
    setCountdown(3);
  };

  if (currentState === "splash") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SAPA UMKM</Text>
        <Text style={styles.subtitle}>Splash Screen</Text>
        <Text style={styles.countdown}>Auto-next in: {countdown}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentState("onboarding")}
        >
          <Text style={styles.buttonText}>Skip to Onboarding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentState === "onboarding") {
    return (
      <View style={[styles.container, { backgroundColor: "#3B82F6" }]}>
        <Text style={[styles.title, { color: "white" }]}>Onboarding</Text>
        <Text style={[styles.subtitle, { color: "white" }]}>
          Welcome to SAPA UMKM
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentState("getting-started")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetFlow}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentState === "getting-started") {
    return (
      <View style={[styles.container, { backgroundColor: "#10B981" }]}>
        <Text style={[styles.title, { color: "white" }]}>Getting Started</Text>
        <Text style={[styles.subtitle, { color: "white" }]}>
          Ready to begin?
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentState("complete")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentState("complete")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetFlow}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#8B5CF6" }]}>
      <Text style={[styles.title, { color: "white" }]}>Complete!</Text>
      <Text style={[styles.subtitle, { color: "white" }]}>
        App flow finished
      </Text>
      <TouchableOpacity style={styles.button} onPress={resetFlow}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
    textAlign: "center",
  },
  countdown: {
    fontSize: 16,
    marginBottom: 30,
    color: "#888",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    minWidth: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
