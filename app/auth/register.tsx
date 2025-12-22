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
import { useAuth } from "../../contexts";
import { RegisterFormData } from "../../types";

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (formData: RegisterFormData) => {
    console.log("📝 RegisterScreen: Starting registration process");
    setLoading(true);
    try {
      // Use register from AuthContext to ensure state is synchronized
      const success = await register(formData);
      console.log("📝 RegisterScreen: AuthContext.register result:", success);

      if (success) {
        console.log("✅ RegisterScreen: Registration successful");

        Alert.alert(
          "Registrasi Berhasil",
          "Akun Anda berhasil dibuat. Anda akan diarahkan ke halaman utama.",
          [
            {
              text: "OK",
              onPress: () => {
                console.log("📝 RegisterScreen: Navigating to home");
                // Give a small delay to ensure state is fully updated
                setTimeout(() => {
                  router.replace("/(tabs)/home");
                }, 100);
              },
            },
          ]
        );
      } else {
        console.log("❌ RegisterScreen: Registration failed");
        Alert.alert(
          "Pendaftaran Gagal",
          "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
        );
      }
    } catch (error) {
      console.error("❌ RegisterScreen: Register error:", error);
      Alert.alert("Error", "Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onSignIn={handleSignIn}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
