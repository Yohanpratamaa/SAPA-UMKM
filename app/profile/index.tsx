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
import { SafeAreaView } from "react-native-safe-area-context";
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
    console.log(
      "Profile List - Delete requested for profile:",
      profile.id,
      profile.namaUsaha
    );
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
              console.log("Profile List - Deleting profile:", profile.id);
              await ProfileStorageService.deleteProfile(profile.id);
              console.log("Profile List - Profile deleted successfully");
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

  const renderProfile = ({
    item,
    index,
  }: {
    item: UMKMProfile;
    index: number;
  }) => (
    <ProfileCard
      profile={item}
      index={index}
      onPress={() => {
        console.log("Profile List - Navigating to detail with ID:", item.id);
        console.log("Profile List - Full item:", JSON.stringify(item, null, 2));
        try {
          router.push(`/profile/${item.id}`);
          console.log("Profile List - Navigation called for detail");
        } catch (error) {
          console.error("Profile List - Navigation error for detail:", error);
        }
      }}
      onEdit={() => {
        console.log("Profile List - Navigating to edit with ID:", item.id);
        try {
          router.push(`/profile/${item.id}/edit`);
          console.log("Profile List - Navigation called for edit");
        } catch (error) {
          console.error("Profile List - Navigation error for edit:", error);
        }
      }}
      onDelete={() => handleDeleteProfile(item)}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View
        className="bg-white rounded-full p-8 mb-6"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Ionicons name="business-outline" size={80} color="#9CA3AF" />
      </View>
      <Text className="text-gray-600 text-xl font-semibold mb-2">
        {searchQuery
          ? "Tidak ada profil yang ditemukan"
          : "Belum ada profil UMKM"}
      </Text>
      <Text className="text-gray-500 text-center px-8 mb-8 leading-6">
        {searchQuery
          ? "Coba gunakan kata kunci yang berbeda untuk mencari profil UMKM"
          : "Mulai dengan menambahkan profil UMKM pertama Anda untuk memulai perjalanan digitalisasi usaha"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          onPress={() => router.push("/profile/create")}
          className="bg-blue-600 px-8 py-4 rounded-2xl flex-row items-center"
          style={{
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Tambah Profil UMKM
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <View
            className="bg-white rounded-2xl p-8 items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-700 mt-4 font-medium text-lg">
              Memuat profil UMKM...
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Sedang mengambil data profil usaha Anda
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Modern Header with gradient */}
      <View
        className="px-6 pt-4 pb-6"
        style={{
          backgroundColor: "#3B82F6",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">
              Profil UMKM
            </Text>
            <Text className="text-blue-100 text-sm">
              Kelola data profil usaha Anda
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleDebugAuth}
              className="bg-white bg-opacity-20 p-2 rounded-full mr-2"
            >
              <Ionicons name="bug" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 bg-opacity-90 p-2 rounded-full mr-2"
            >
              <Ionicons name="log-out" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile/create")}
              className="bg-white bg-opacity-20 p-2 rounded-full"
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Search Bar */}
        <View
          className="flex-row items-center bg-white rounded-2xl px-4 py-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Cari nama usaha, jenis, atau lokasi..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modern Statistics Cards */}
      {profiles.length > 0 && (
        <View className="px-4 py-4 -mt-6">
          <View className="flex-row justify-between">
            <View
              className="bg-white rounded-2xl p-4 flex-1 mr-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="bg-blue-100 p-2 rounded-full">
                  <Ionicons name="business" size={20} color="#3B82F6" />
                </View>
                <Text className="text-2xl font-bold text-blue-600">
                  {profiles.length}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 font-medium">
                Total UMKM
              </Text>
            </View>

            <View
              className="bg-white rounded-2xl p-4 flex-1 mx-1"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="bg-green-100 p-2 rounded-full">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
                <Text className="text-2xl font-bold text-green-600">
                  {profiles.filter((p) => p.status === "aktif").length}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 font-medium">Aktif</Text>
            </View>

            <View
              className="bg-white rounded-2xl p-4 flex-1 ml-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="bg-yellow-100 p-2 rounded-full">
                  <Ionicons name="time" size={20} color="#F59E0B" />
                </View>
                <Text className="text-2xl font-bold text-yellow-600">
                  {profiles.filter((p) => p.status === "pending").length}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 font-medium">Pending</Text>
            </View>
          </View>
        </View>
      )}

      {/* Profile List */}
      <FlatList
        data={filteredProfiles}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingTop: profiles.length > 0 ? 16 : 0,
        }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/profile/create")}
        className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4"
        style={{
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
