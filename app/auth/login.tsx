import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { LoginForm } from "../../components/auth";
import { useAuth } from "../../contexts";
import { LoginFormData } from "../../types";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (formData: LoginFormData) => {
    console.log("🔐 LoginScreen: handleLogin called");
    setLoading(true);
    try {
      // Use login from AuthContext to ensure state is synchronized
      const success = await login(formData);
      console.log("🔐 LoginScreen: AuthContext.login result:", success);

      if (success) {
        console.log("✅ LoginScreen: Login successful, navigating to home");

        // Give a small delay to ensure state is fully updated
        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 100);
      } else {
        console.log("❌ LoginScreen: Login failed");
        Alert.alert("Login Gagal", "Email/Username atau password salah");
      }
    } catch (error) {
      console.error("❌ LoginScreen: Login error:", error);
      Alert.alert("Error", "Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Lupa Password",
      "Fitur reset password akan segera tersedia. Silakan hubungi administrator untuk bantuan.",
      [{ text: "OK" }]
    );
  };

  const handleSignUp = () => {
    router.push("/auth/register");
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
