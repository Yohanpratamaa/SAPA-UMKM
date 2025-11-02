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
import { ProfileCard } from "../../../components/ProfileCard";
import { ProfileStorageService } from "../../../services";
import { UMKMProfile } from "../../../types";

export default function ProfileListScreen() {
  const [profiles, setProfiles] = useState<UMKMProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UMKMProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderProfile = ({ item }: { item: UMKMProfile }) => (
    <ProfileCard
      profile={item}
      onPress={() => {
        /* TODO: Add detail view */
      }}
      onEdit={() => {
        /* TODO: Add edit functionality */
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
          <TouchableOpacity
            onPress={() => router.push("/profile/create")}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Tambah</Text>
          </TouchableOpacity>
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
