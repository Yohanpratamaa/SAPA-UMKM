import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts";
import {
  ProductStorageService,
  ProfileStorageService,
  TrainingStorageService,
} from "../../services";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [productStats, setProductStats] = useState({
    total: 0,
    aktif: 0,
    nonAktif: 0,
    kategoriStats: {} as { [key: string]: number },
  });
  const [profileCount, setProfileCount] = useState(0);
  const [trainingStats, setTrainingStats] = useState({
    totalModules: 0,
    completedModules: 0,
    availableCategories: 0,
  });

  // Debug: Check if logout function is available
  console.log("🔍 HomeScreen: useAuth logout function:", typeof logout);

  // Load statistics
  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          // Load product statistics
          const stats = await ProductStorageService.getProductStatistics();
          setProductStats(stats);

          // Load profile count
          const profiles = await ProfileStorageService.getAllProfiles();
          setProfileCount(profiles.length);

          // Load training statistics
          const trainingData =
            await TrainingStorageService.getTrainingStatistics();
          setTrainingStats({
            totalModules: trainingData.total,
            completedModules: trainingData.aktif,
            availableCategories: Object.keys(trainingData.kategoriStats).length,
          });
        } catch (error) {
          console.error("Error loading statistics:", error);
        }
      };

      loadStats();
    }, [])
  );

  const features = [
    {
      id: 1,
      title: "Manajemen Profil UMKM",
      description: "Kelola data profil usaha, NIB, dan informasi kontak",
      icon: "business-outline" as const,
      color: "bg-blue-500",
      route: "/profile",
      status: "Tersedia",
      summary: {
        total: profileCount,
        label: "Profil Terdaftar",
        action: "Kelola Profil",
      },
    },
    {
      id: 2,
      title: "Konsultasi Digital UMKM",
      description: "Konsultasi interaktif dengan FAQ dan panduan bisnis",
      icon: "chatbubble-ellipses-outline" as const,
      color: "bg-teal-500",
      route: "/(tabs)/consultation/",
      status: "Tersedia",
      summary: {
        total: 12,
        label: "FAQ Tersedia",
        action: "Mulai Konsultasi",
      },
    },
    {
      id: 3,
      title: "Marketplace Digital",
      description: "Platform jual beli produk UMKM secara online",
      icon: "storefront-outline" as const,
      color: "bg-purple-500",
      route: "/(tabs)/marketplace/",
      status: "Tersedia",
      summary: {
        total: productStats.aktif,
        label: "Produk Aktif",
        action: "Kelola Produk",
      },
    },
    {
      id: 4,
      title: "Pelatihan & Edukasi",
      description: "Materi pelatihan dan workshop untuk UMKM",
      icon: "school-outline" as const,
      color: "bg-orange-500",
      route: "/(tabs)/training/",
      status: "Tersedia",
      summary: {
        total: trainingStats.totalModules,
        label: "Modul Tersedia",
        action: "Mulai Belajar",
      },
    },

  ];

  const handleFeaturePress = (route: string, status: string) => {
    if (status === "Tersedia" && route !== "#") {
      router.push(route as any);
    }
  };

  const handleDirectLogout = async () => {
    console.log("🚪 HomeScreen: Direct logout called (bypassing alert)");
    try {
      console.log("🚪 HomeScreen: Calling logout function directly");
      await logout();
      console.log("🚪 HomeScreen: Logout successful, navigating to login");
      router.replace("/auth/login");
      console.log("🚪 HomeScreen: Navigation completed");
    } catch (error) {
      console.error("🚪 HomeScreen: Direct logout error:", error);
      Alert.alert("Error", "Gagal logout: " + String(error));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-4 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold mb-2">
                SAPA UMKM
              </Text>
              <Text className="text-blue-100 text-base">
                Sistem Aplikasi Pendampingan Adaptasi UMKM
              </Text>
              {user && (
                <Text className="text-blue-100 text-sm mt-2">
                  Selamat datang, {user.fullName}
                </Text>
              )}
            </View>
            <View className="items-center">
              <View className="bg-white bg-opacity-20 p-3 rounded-full mb-2">
                <Ionicons name="business" size={32} color="white" />
              </View>

              {/* Direct Logout Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log("🚪 Direct Logout Button Pressed");
                  handleDirectLogout();
                }}
                className="bg-red-500 bg-opacity-90 px-4 py-2 rounded-full"
              >
                <Text className="text-white text-xs font-semibold">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Info Card */}
        {user && (
          <View className="mx-6 -mt-6 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-800 font-semibold mb-3">
              Informasi Akun
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2 text-sm">
                  {user.fullName}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2 text-sm">{user.email}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="shield-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2 text-sm capitalize">
                  {user.role}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View
          className={`mx-6 ${
            user ? "mt-6" : "-mt-6"
          } bg-white rounded-xl p-4 shadow-sm`}
        >
          <Text className="text-gray-800 font-semibold mb-3">
            Ringkasan Aktivitas
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">4</Text>
              <Text className="text-xs text-gray-600">Fitur Aktif</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {profileCount}
              </Text>
              <Text className="text-xs text-gray-600">Profil UMKM</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {productStats.aktif}
              </Text>
              <Text className="text-xs text-gray-600">Produk Aktif</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {trainingStats.totalModules}
              </Text>
              <Text className="text-xs text-gray-600">Modul Training</Text>
            </View>
          </View>
        </View>

        {/* Training Quick Stats */}
        {trainingStats.totalModules > 0 && (
          <View className="mx-6 mt-4 bg-orange-50 rounded-xl p-4 border border-orange-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="school" size={20} color="#EA580C" />
                <Text className="text-orange-800 font-semibold ml-2">
                  Pelatihan & Edukasi
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/training/" as any)}
                className="bg-orange-600 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-medium">Lihat</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-lg font-bold text-orange-600">
                  {trainingStats.totalModules}
                </Text>
                <Text className="text-xs text-orange-700">Total Modul</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-green-600">
                  {trainingStats.completedModules}
                </Text>
                <Text className="text-xs text-orange-700">Aktif</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-blue-600">
                  {trainingStats.availableCategories}
                </Text>
                <Text className="text-xs text-orange-700">Kategori</Text>
              </View>
            </View>
          </View>
        )}

        {/* Profile Quick Stats */}
        {profileCount > 0 && (
          <View className="mx-6 mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="business" size={20} color="#2563EB" />
                <Text className="text-blue-800 font-semibold ml-2">
                  Profil UMKM
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/profile" as any)}
                className="bg-blue-600 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-medium">Kelola</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-lg font-bold text-blue-600">
                  {profileCount}
                </Text>
                <Text className="text-xs text-blue-700">Profil Terdaftar</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-green-600">
                  {profileCount}
                </Text>
                <Text className="text-xs text-blue-700">Verifikasi</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-orange-600">100</Text>
                <Text className="text-xs text-blue-700">%Kelengkapan</Text>
              </View>
            </View>
          </View>
        )}

        {/* Consultation Quick Stats */}
        <View className="mx-6 mt-4 bg-teal-50 rounded-xl p-4 border border-teal-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0F766E" />
              <Text className="text-teal-800 font-semibold ml-2">
                Konsultasi Digital
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/consultation/" as any)}
              className="bg-teal-600 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-xs font-medium">Konsultasi</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-bold text-teal-600">12</Text>
              <Text className="text-xs text-teal-700">FAQ Tersedia</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">4</Text>
              <Text className="text-xs text-teal-700">Kategori</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">24/7</Text>
              <Text className="text-xs text-teal-700">Tersedia</Text>
            </View>
          </View>
        </View>

        {/* Marketplace Quick Stats - Show only if there are products */}
        {productStats.total > 0 && (
          <View className="mx-6 mt-4 bg-purple-50 rounded-xl p-4 border border-purple-200">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Ionicons name="storefront" size={20} color="#7C3AED" />
                <Text className="text-purple-800 font-semibold ml-2">
                  Marketplace Digital
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/marketplace/" as any)}
                className="bg-purple-600 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-medium">Lihat</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-lg font-bold text-purple-600">
                  {productStats.total}
                </Text>
                <Text className="text-xs text-purple-700">Total Produk</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-green-600">
                  {productStats.aktif}
                </Text>
                <Text className="text-xs text-purple-700">Aktif</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-orange-600">
                  {Object.keys(productStats.kategoriStats).length}
                </Text>
                <Text className="text-xs text-purple-700">Kategori</Text>
              </View>
            </View>
          </View>
        )}

        {/* Features Grid */}
        <View className="px-6 py-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Fitur Aplikasi
          </Text>

          <View>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                onPress={() =>
                  handleFeaturePress(feature.route, feature.status)
                }
                className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4 ${
                  feature.status === "Segera Hadir" ? "opacity-70" : ""
                }`}
                disabled={feature.status === "Segera Hadir"}
              >
                <View className="flex-row items-start">
                  <View className={`${feature.color} p-3 rounded-xl mr-4`}>
                    <Ionicons name={feature.icon} size={24} color="white" />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-lg font-semibold text-gray-800">
                        {feature.title}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          feature.status === "Tersedia"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            feature.status === "Tersedia"
                              ? "text-green-800"
                              : "text-yellow-800"
                          }`}
                        >
                          {feature.status}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-600 text-sm mb-3">
                      {feature.description}
                    </Text>

                    {/* Feature Summary */}
                    <View className="bg-gray-50 rounded-lg p-3 mb-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-white p-2 rounded-full mr-3">
                            <Text className="text-lg font-bold text-gray-800">
                              {feature.summary.total}
                            </Text>
                          </View>
                          <Text className="text-gray-600 text-sm">
                            {feature.summary.label}
                          </Text>
                        </View>
                        {feature.status === "Tersedia" && (
                          <View className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-blue-700 text-xs font-medium">
                              {feature.summary.action}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {feature.status === "Tersedia" && (
                      <View className="flex-row items-center">
                        <Text className="text-blue-600 text-sm font-medium mr-1">
                          Mulai gunakan
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color="#3B82F6"
                        />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress & Achievements */}
        <View className="mx-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Progress & Pencapaian
          </Text>

          {/* Overall Progress */}
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-800 font-semibold">
                Kelengkapan Profil
              </Text>
              <Text className="text-blue-600 font-bold">
                {profileCount > 0 ? "100%" : "0%"}
              </Text>
            </View>
            <View className="bg-gray-200 rounded-full h-2 mb-2">
              <View
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: profileCount > 0 ? "100%" : "0%" }}
              />
            </View>
            <Text className="text-gray-600 text-sm">
              {profileCount > 0
                ? "Profil UMKM sudah lengkap!"
                : "Lengkapi profil UMKM Anda"}
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="text-gray-800 font-semibold mb-3">
              Pencapaian Terbaru
            </Text>
            <View>
              {profileCount > 0 && (
                <View className="flex-row items-center mb-3">
                  <View className="bg-green-100 p-2 rounded-full mr-3">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10B981"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium text-sm">
                      Profil UMKM Lengkap
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      Berhasil mendaftarkan profil usaha
                    </Text>
                  </View>
                </View>
              )}

              {productStats.aktif > 0 && (
                <View className="flex-row items-center mb-3">
                  <View className="bg-purple-100 p-2 rounded-full mr-3">
                    <Ionicons name="storefront" size={20} color="#7C3AED" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium text-sm">
                      Produk Pertama Ditambahkan
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      Mulai berjualan di marketplace
                    </Text>
                  </View>
                </View>
              )}

              {trainingStats.completedModules > 0 && (
                <View className="flex-row items-center mb-3">
                  <View className="bg-orange-100 p-2 rounded-full mr-3">
                    <Ionicons name="school" size={20} color="#EA580C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium text-sm">
                      Mulai Belajar
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      Mengakses modul pelatihan
                    </Text>
                  </View>
                </View>
              )}

              {/* Default achievement if no data */}
              {profileCount === 0 &&
                productStats.aktif === 0 &&
                trainingStats.completedModules === 0 && (
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-full mr-3">
                      <Ionicons name="rocket" size={20} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-medium text-sm">
                        Selamat Datang!
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        Mulai perjalanan digital UMKM Anda
                      </Text>
                    </View>
                  </View>
                )}
            </View>
          </View>
        </View>
        <View className="mx-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Aksi Cepat
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() => router.push("/profile/create" as any)}
              className="bg-blue-500 rounded-xl p-4 flex-row items-center mb-3"
              style={{ width: "48%" }}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text className="text-white font-semibold ml-2 text-xs flex-1">
                Tambah Profil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/marketplace/create" as any)}
              className="bg-purple-500 rounded-xl p-4 flex-row items-center mb-3"
              style={{ width: "48%" }}
            >
              <Ionicons name="storefront" size={20} color="white" />
              <Text className="text-white font-semibold ml-2 text-xs flex-1">
                Jual Produk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/training/" as any)}
              className="bg-orange-500 rounded-xl p-4 flex-row items-center"
              style={{ width: "48%" }}
            >
              <Ionicons name="school" size={20} color="white" />
              <Text className="text-white font-semibold ml-2 text-xs flex-1">
                Mulai Belajar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/consultation/" as any)}
              className="bg-teal-500 rounded-xl p-4 flex-row items-center"
              style={{ width: "48%" }}
            >
              <Ionicons name="chatbubbles" size={20} color="white" />
              <Text className="text-white font-semibold ml-2 text-xs flex-1">
                Konsultasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips & Insights */}
        <View className="mx-6 mb-6 bg-blue-600 rounded-xl p-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Tips Hari Ini
            </Text>
          </View>
          <Text className="text-blue-100 text-sm mb-4">
            Lengkapi profil UMKM Anda untuk meningkatkan kredibilitas dan
            mendapatkan akses ke program bantuan pemerintah.
          </Text>
          <TouchableOpacity className="bg-white bg-opacity-20 py-2 px-4 rounded-lg self-start">
            <Text className="text-white font-semibold text-sm">
              Pelajari Lebih Lanjut
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View className="mx-6 mb-6 bg-blue-50 rounded-xl p-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="help-circle" size={24} color="#3B82F6" />
            <Text className="text-blue-800 font-semibold ml-2">
              Butuh Bantuan?
            </Text>
          </View>
          <Text className="text-blue-700 text-sm mb-4">
            Tim support kami siap membantu Anda dalam menggunakan aplikasi SAPA
            UMKM. Dapatkan panduan lengkap atau konsultasi langsung.
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-blue-600 py-3 px-4 rounded-lg mr-2 flex-1">
              <Text className="text-white text-center font-semibold text-sm">
                Hubungi Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/consultation/" as any)}
              className="bg-blue-100 py-3 px-4 rounded-lg flex-1"
            >
              <Text className="text-blue-600 text-center font-semibold text-sm">
                FAQ & Panduan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
