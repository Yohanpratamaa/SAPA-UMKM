import { Redirect } from "expo-router";
import React from "react";
import { AuthLoadingScreen } from "../components/AuthLoadingScreen";
import { useAuth } from "../contexts";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/intro" />;
  }
}
