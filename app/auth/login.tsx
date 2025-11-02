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
import { AuthService } from "../../services";
import { LoginFormData } from "../../types";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AuthService.login(formData);

      if (response.success && response.user && response.token) {
        // Simpan user dan token
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        Alert.alert("Berhasil", response.message || "Login berhasil!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate ke halaman utama
              router.replace("/(tabs)");
            },
          },
        ]);
      } else {
        Alert.alert(
          "Login Gagal",
          response.message || "Terjadi kesalahan saat login"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
