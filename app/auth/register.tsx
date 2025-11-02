import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { RegisterForm } from "../../components/auth";
import { AuthService } from "../../services";
import { RegisterFormData } from "../../types";

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await AuthService.register(formData);

      if (response.success && response.user && response.token) {
        // Simpan user dan token
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        Alert.alert("Berhasil", response.message || "Akun berhasil dibuat!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate ke halaman utama
              router.replace("/(tabs)");
            },
          },
        ]);
      } else {
        // Tampilkan error
        let errorMessage =
          response.message || "Terjadi kesalahan saat mendaftar";

        if (response.errors) {
          const errorValues = Object.values(response.errors);
          if (errorValues.length > 0) {
            errorMessage = errorValues[0];
          }
        }

        Alert.alert("Pendaftaran Gagal", errorMessage);
      }
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Error", "Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-4">
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onSignIn={handleSignIn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
