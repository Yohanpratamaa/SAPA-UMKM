import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TestRoutingScreen() {
  const testLoginRoute = () => {
    console.log("Testing login route");
    router.push("/auth/login");
  };

  const testRegisterRoute = () => {
    console.log("Testing register route");
    router.push("/auth/register");
  };

  const goToIntro = () => {
    console.log("Going to intro");
    router.push("/intro");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Routing</Text>

      <TouchableOpacity style={styles.button} onPress={testLoginRoute}>
        <Text style={styles.buttonText}>Test Login Route</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testRegisterRoute}>
        <Text style={styles.buttonText}>Test Register Route</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToIntro}>
        <Text style={styles.buttonText}>Go to Intro</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
