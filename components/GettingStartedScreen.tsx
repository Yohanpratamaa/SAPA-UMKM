import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface GettingStartedScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function GettingStartedScreen({
  onGetStarted,
  onLogin,
}: GettingStartedScreenProps) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"]}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Enhanced Background Pattern */}
      <View className="absolute inset-0">
        <View
          className="absolute rounded-full"
          style={{
            width: width * 1.5,
            height: width * 1.5,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            top: -width * 0.5,
            right: -width * 0.4,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: width * 1.2,
            height: width * 1.2,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            bottom: -width * 0.3,
            left: -width * 0.3,
          }}
        />

        {/* Additional decorative elements */}
        <View
          className="absolute rounded-full"
          style={{
            width: width * 0.4,
            height: width * 0.4,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            top: height * 0.15,
            left: -width * 0.1,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            top: height * 0.25,
            right: width * 0.1,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            bottom: height * 0.35,
            left: width * 0.15,
          }}
        />
      </View>

      {/* Content Container */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Enhanced Logo Section */}
        <View className="items-center mb-12">
          <View
            className="bg-white rounded-full p-10 mb-8"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
            }}
          >
            <View
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
              }}
            />
            <Ionicons name="business" size={90} color="#1E40AF" />
          </View>

          <Text
            className="text-white text-5xl font-black text-center mb-3"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.3)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
              letterSpacing: 2,
            }}
          >
            SAPA UMKM
          </Text>
          <View className="bg-white bg-opacity-20 rounded-full px-6 py-2 mb-2">
            <Text className="text-white text-base text-center font-semibold">
              Sistem Aplikasi Pendampingan
            </Text>
          </View>
          <Text className="text-blue-100 text-base text-center font-medium opacity-90">
            Adaptasi UMKM Indonesia
          </Text>
        </View>

        {/* Welcome Message */}
        <View className="items-center mb-16">
          <Text className="text-white text-2xl font-bold text-center mb-4">
            Siap Memulai Perjalanan Digital Anda?
          </Text>
          <Text className="text-blue-100 text-base text-center leading-6 opacity-90">
            Bergabunglah dengan ribuan UMKM lainnya yang telah merasakan manfaat
            teknologi digital untuk mengembangkan usaha mereka.
          </Text>
        </View>

        {/* Features Highlight */}
        <View className="w-full mb-12">
          <View className="flex-row items-center mb-4 px-4">
            <View className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text className="text-white text-base flex-1">
              Kelola profil UMKM dengan mudah
            </Text>
          </View>

          <View className="flex-row items-center mb-4 px-4">
            <View className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text className="text-white text-base flex-1">
              Akses bantuan dan pendampingan profesional
            </Text>
          </View>

          <View className="flex-row items-center px-4">
            <View className="bg-white bg-opacity-20 rounded-full p-2 mr-4">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text className="text-white text-base flex-1">
              Platform marketplace terintegrasi
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-8 pb-12">
        {/* Get Started Button */}
        <TouchableOpacity
          onPress={onGetStarted}
          className="bg-white rounded-xl py-4 mb-4 shadow-lg"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-blue-700 text-lg font-bold mr-2">
              Mulai Sekarang
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#1D4ED8" />
          </View>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={onLogin}
          className="border-2 border-white rounded-xl py-4 bg-transparent"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-in-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Sudah Punya Akun? Masuk
            </Text>
          </View>
        </TouchableOpacity>

        {/* Help Text */}
        <View className="items-center mt-6">
          <Text className="text-blue-200 text-sm text-center">
            Dengan melanjutkan, Anda menyetujui{" "}
          </Text>
          <View className="flex-row">
            <TouchableOpacity>
              <Text className="text-white text-sm underline">
                Syarat & Ketentuan
              </Text>
            </TouchableOpacity>
            <Text className="text-blue-200 text-sm"> dan </Text>
            <TouchableOpacity>
              <Text className="text-white text-sm underline">
                Kebijakan Privasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Support Info */}
      <View className="absolute bottom-2 left-0 right-0">
        <View className="flex-row items-center justify-center">
          <Ionicons name="help-circle-outline" size={16} color="#93C5FD" />
          <Text className="text-blue-200 text-xs ml-2">
            Butuh bantuan? Hubungi support kami
          </Text>
        </View>
      </View>
    </View>
  );
}
