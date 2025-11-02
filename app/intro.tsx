import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { GettingStartedScreen } from "../components/GettingStartedScreenSimple";
import { OnboardingScreen } from "../components/OnboardingScreenSimple";
import { SplashScreen } from "../components/SplashScreen";

type AppFlowState = "splash" | "onboarding" | "getting-started";

export default function IntroScreen() {
  const [currentState, setCurrentState] = useState<AppFlowState>("splash");

  console.log("Current intro state:", currentState);

  const handleSplashFinish = () => {
    console.log("Splash finished");
    setCurrentState("onboarding");
  };

  const handleOnboardingFinish = () => {
    console.log("Onboarding finished");
    setCurrentState("getting-started");
  };

  const handleRegister = () => {
    console.log("Navigating to register");
    router.push("/auth/register");
  };

  const handleLogin = () => {
    console.log("Navigating to login");
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      {currentState === "splash" && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentState === "onboarding" && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}

      {currentState === "getting-started" && (
        <GettingStartedScreen
          onGetStarted={handleRegister}
          onLogin={handleLogin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
