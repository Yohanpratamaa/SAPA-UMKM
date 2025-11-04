import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ProfileCard } from "../../components/ProfileCard";
import { useAuth } from "../../contexts";
import { AuthService, ProfileStorageService } from "../../services";
import { UMKMProfile } from "../../types";

export default function ProfileListScreen() {
  const [profiles, setProfiles] = useState<UMKMProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UMKMProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const allProfiles = await ProfileStorageService.getAllProfiles();
      setProfiles(allProfiles);
      setFilteredProfiles(allProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
      Alert.alert("Error", "Gagal memuat data profil UMKM");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfiles();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfiles();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProfiles(profiles);
    } else {
      const filtered = profiles.filter(
        (profile) =>
          profile.namaUsaha.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.jenisUsaha
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          profile.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.provinsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.nib.includes(searchQuery)
      );
      setFilteredProfiles(filtered);
    }
  }, [searchQuery, profiles]);

  const handleDeleteProfile = async (profile: UMKMProfile) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus profil "${profile.namaUsaha}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await ProfileStorageService.deleteProfile(profile.id);
              await loadProfiles();
              Alert.alert("Berhasil", "Profil berhasil dihapus");
            } catch (error) {
              console.error("Error deleting profile:", error);
              Alert.alert("Error", "Gagal menghapus profil");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/intro");
        },
      },
    ]);
  };

  const handleDebugAuth = async () => {
    try {
      const debugInfo = await AuthService.getDebugInfo();
      Alert.alert(
        "Debug Auth Info",
        `Current User: ${debugInfo.currentUser?.fullName || "None"}\n` +
          `Role: ${debugInfo.currentUser?.role || "None"}\n` +
          `Email: ${debugInfo.currentUser?.email || "None"}\n` +
          `Token: ${debugInfo.token ? "Present" : "None"}\n` +
          `Remember Me: ${debugInfo.rememberMe}\n` +
          `Total Users: ${debugInfo.allUsers.length}`,
        [
          {
            text: "Clear All Data",
            style: "destructive",
            onPress: async () => {
              await AuthService.clearAllData();
              Alert.alert("Success", "All auth data cleared");
              router.replace("/intro");
            },
          },
          { text: "OK" },
        ]
      );
    } catch {
      Alert.alert("Error", "Failed to get debug info");
    }
  };

  const renderProfile = ({ item }: { item: UMKMProfile }) => (
    <ProfileCard
      profile={item}
      onPress={() => {
        console.log("Navigating to detail with ID:", item.id);
        router.push({
          pathname: "/profile/[id]",
          params: { id: item.id },
        });
      }}
      onEdit={() => {
        console.log("Navigating to edit with ID:", item.id);
        router.push({
          pathname: "/profile/[id]/edit",
          params: { id: item.id },
        });
      }}
      onDelete={() => handleDeleteProfile(item)}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name="business-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4 mb-2">
        {searchQuery
          ? "Tidak ada profil yang ditemukan"
          : "Belum ada profil UMKM"}
      </Text>
      <Text className="text-gray-400 text-center px-8 mb-6">
        {searchQuery
          ? "Coba gunakan kata kunci yang berbeda"
          : "Tambahkan profil UMKM pertama Anda"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          onPress={() => router.push("/profile/create")}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Tambah Profil UMKM</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Memuat data profil...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Profil UMKM</Text>
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={handleDebugAuth}
              className="bg-gray-600 px-3 py-2 rounded-lg flex-row items-center mr-2"
            >
              <Ionicons name="bug" size={16} color="white" />
              <Text className="text-white font-semibold ml-1 text-sm">
                Debug
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-600 px-3 py-2 rounded-lg flex-row items-center mr-2"
            >
              <Ionicons name="log-out" size={16} color="white" />
              <Text className="text-white font-semibold ml-1 text-sm">
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/create")}
              className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Cari berdasarkan nama, jenis usaha, atau lokasi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Statistics */}
      {profiles.length > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {profiles.length}
              </Text>
              <Text className="text-sm text-gray-600">Total UMKM</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {profiles.filter((p) => p.status === "aktif").length}
              </Text>
              <Text className="text-sm text-gray-600">Aktif</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-600">
                {profiles.filter((p) => p.status === "pending").length}
              </Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600">
                {profiles.filter((p) => p.status === "non-aktif").length}
              </Text>
              <Text className="text-sm text-gray-600">Non-Aktif</Text>
            </View>
          </View>
        </View>
      )}

      {/* Profile List */}
      <FlatList
        data={filteredProfiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
