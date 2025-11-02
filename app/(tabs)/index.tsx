import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const features = [
    {
      id: 1,
      title: "Manajemen Profil UMKM",
      description: "Kelola data profil usaha, NIB, dan informasi kontak",
      icon: "business-outline" as const,
      color: "bg-blue-500",
      route: "/profile",
      status: "Tersedia",
    },
    {
      id: 2,
      title: "Bantuan & Pendampingan",
      description: "Akses program bantuan dan pendampingan UMKM",
      icon: "people-outline" as const,
      color: "bg-green-500",
      route: "#",
      status: "Segera Hadir",
    },
    {
      id: 3,
      title: "Marketplace Digital",
      description: "Platform jual beli produk UMKM secara online",
      icon: "storefront-outline" as const,
      color: "bg-purple-500",
      route: "#",
      status: "Segera Hadir",
    },
    {
      id: 4,
      title: "Pelatihan & Edukasi",
      description: "Materi pelatihan dan workshop untuk UMKM",
      icon: "school-outline" as const,
      color: "bg-orange-500",
      route: "#",
      status: "Segera Hadir",
    },
  ];

  const handleFeaturePress = (route: string, status: string) => {
    if (status === "Tersedia" && route !== "#") {
      router.push(route as any);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 py-8 rounded-b-3xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-2">
              SAPA UMKM
            </Text>
            <Text className="text-blue-100 text-base">
              Sistem Aplikasi Pendampingan Adaptasi UMKM
            </Text>
          </View>
          <View className="bg-white bg-opacity-20 p-3 rounded-full">
            <Ionicons name="business" size={32} color="white" />
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="mx-6 -mt-6 bg-white rounded-xl p-4 shadow-sm">
        <Text className="text-gray-800 font-semibold mb-3">
          Ringkasan Aktivitas
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">1</Text>
            <Text className="text-xs text-gray-600">Fitur Aktif</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">0</Text>
            <Text className="text-xs text-gray-600">Profil UMKM</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-600">3</Text>
            <Text className="text-xs text-gray-600">Fitur Segera</Text>
          </View>
        </View>
      </View>

      {/* Features Grid */}
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Fitur Aplikasi
        </Text>

        <View className="grid grid-cols-1 gap-4">
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => handleFeaturePress(feature.route, feature.status)}
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${
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
          UMKM
        </Text>
        <TouchableOpacity className="bg-blue-600 py-3 rounded-lg">
          <Text className="text-white text-center font-semibold">
            Hubungi Support
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
