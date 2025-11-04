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
import { AuthTestUtils } from "../../utils/AuthTestUtils";
import { LoginDebugger } from "../../utils/LoginDebugger";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: LoginFormData) => {
    console.log("LoginScreen: handleLogin called with:", formData);
    setLoading(true);
    try {
      console.log("LoginScreen: Calling AuthService.login");
      const response = await AuthService.login(formData);
      console.log("LoginScreen: AuthService response:", response);

      if (response.success && response.user && response.token) {
        console.log("LoginScreen: Login successful, saving user data");
        console.log("LoginScreen: About to save user:", response.user);

        try {
          // Simpan user dan token
          console.log("LoginScreen: Calling saveCurrentUser...");
          await AuthService.saveCurrentUser(response.user);
          console.log("LoginScreen: User saved successfully");

          console.log("LoginScreen: Calling saveToken...");
          await AuthService.saveToken(response.token);
          console.log("LoginScreen: Token saved successfully");

          console.log("LoginScreen: About to show success alert");

          // Try immediate navigation without alert for testing
          console.log(
            "LoginScreen: 🚀 Attempting immediate navigation for testing"
          );
          try {
            router.replace("/(tabs)/home");
            console.log("LoginScreen: ✅ Navigation attempted successfully");
          } catch (navError) {
            console.error("LoginScreen: ❌ Navigation failed:", navError);
          }

          // Also show alert with delay
          setTimeout(() => {
            Alert.alert("Berhasil", response.message || "Login berhasil!", [
              {
                text: "OK",
                onPress: () => {
                  console.log(
                    "LoginScreen: Alert OK pressed, navigating to home"
                  );
                  // Navigate ke halaman utama
                  setTimeout(() => {
                    console.log("LoginScreen: About to call router.replace");
                    router.replace("/(tabs)/home");
                    console.log("LoginScreen: router.replace called");
                  }, 100);
                },
              },
            ]);
            console.log("LoginScreen: Alert.alert called");
          }, 100);
        } catch (saveError) {
          console.error("LoginScreen: Error saving user data:", saveError);
          Alert.alert(
            "Error",
            "Gagal menyimpan data login: " + String(saveError)
          );
        }
      } else {
        console.log("LoginScreen: Login failed:", response.message);
        Alert.alert(
          "Login Gagal",
          response.message || "Terjadi kesalahan saat login"
        );
      }
    } catch (error) {
      console.error("LoginScreen: Login error:", error);
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

  const handleDemoLogin = () => {
    Alert.alert(
      "Demo Login",
      "Pilih akun demo untuk login:\n\n1. UMKM Demo\n   Email: demo@umkm.com\n   Password: demo123\n\n2. Pendamping Demo\n   Email: pendamping@demo.com\n   Password: demo123",
      [
        {
          text: "Login UMKM",
          onPress: () => {
            handleLogin({
              emailOrUsername: "demo@umkm.com",
              password: "demo123",
              rememberMe: true,
            });
          },
        },
        {
          text: "Login Pendamping",
          onPress: () => {
            handleLogin({
              emailOrUsername: "pendamping@demo.com",
              password: "demo123",
              rememberMe: true,
            });
          },
        },
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const handleDebugAction = async () => {
    Alert.alert("Debug Menu", "Pilih aksi debug:", [
      {
        text: "Test Login",
        onPress: () => AuthTestUtils.testLogin(),
      },
      {
        text: "Debug Auth State",
        onPress: () => AuthTestUtils.debugAuthState(),
      },
      {
        text: "Test Alert Only",
        onPress: () => {
          console.log("🧪 Testing basic alert");
          Alert.alert(
            "Test Alert",
            "This is a test alert to verify Alert works"
          );
        },
      },
      {
        text: "Test Direct Navigation",
        onPress: () => {
          console.log("🧪 Testing direct navigation to home");
          router.replace("/(tabs)/home");
        },
      },
      {
        text: "Run Full Diagnostic",
        onPress: async () => {
          console.log("🔍 Starting complete authentication debug tests...");
          try {
            await LoginDebugger.runFullDiagnostic();
            Alert.alert(
              "Debug",
              "Diagnostic completed! Check console for results."
            );
          } catch (error) {
            console.error("❌ Debug tests failed:", error);
            Alert.alert("Error", "Diagnostic failed: " + error);
          }
        },
      },
      {
        text: "Create Demo Users",
        onPress: async () => {
          await AuthService.createDemoUsers();
          Alert.alert("Success", "Demo users created!");
        },
      },
      {
        text: "Clear All Data",
        style: "destructive",
        onPress: async () => {
          await AuthService.clearAllData();
          Alert.alert("Success", "All data cleared!");
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
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
            onDemoLogin={handleDemoLogin}
            onDebugAction={handleDebugAction}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
