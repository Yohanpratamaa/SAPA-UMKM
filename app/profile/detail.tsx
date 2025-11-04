import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { BackButton } from "../../components/ui";
import { ProfileStorageService } from "../../services";
import { UMKMProfile } from "../../types";

function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<UMKMProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    console.log("Detail - ID received:", id);

    if (!id) {
      console.log("Detail - No ID found");
      Alert.alert("Error", "ID profil tidak ditemukan");
      router.back();
      return;
    }

    try {
      setLoading(true);
      console.log("Detail - Loading profile with ID:", id);
      const profileData = await ProfileStorageService.getProfileById(id);
      console.log("Detail - Profile loaded:", profileData);

      if (!profileData) {
        console.log("Detail - Profile not found");
        Alert.alert("Error", "Profil tidak ditemukan");
        router.back();
        return;
      }

      setProfile(profileData);
      console.log("Detail - Profile state set");
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Gagal memuat data profil");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/profile/edit?id=${id}`);
  };

  const handleDelete = () => {
    if (!profile) return;

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
              Alert.alert("Berhasil", "Profil berhasil dihapus", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error("Error deleting profile:", error);
              Alert.alert("Error", "Gagal menghapus profil");
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (profile?.nomorKontak) {
      Linking.openURL(`tel:${profile.nomorKontak}`);
    }
  };

  const handleEmail = () => {
    if (profile?.email) {
      Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleWebsite = () => {
    if (profile?.website) {
      Linking.openURL(profile.website);
    }
  };

  const getStatusColor = (status: UMKMProfile["status"]) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "non-aktif":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat data profil...</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Profil tidak ditemukan</Text>
        <BackButton onPress={handleBack} className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <BackButton onPress={handleBack} className="mr-4" />
            <Text className="text-lg font-semibold text-gray-900">
              Detail Profil UMKM
            </Text>
          </View>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-blue-600 px-3 py-2 rounded-lg"
            >
              <Ionicons name="pencil-outline" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-600 px-3 py-2 rounded-lg"
            >
              <Ionicons name="trash-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header Card */}
          <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
            <View className="flex-row">
              {/* Logo */}
              <View className="mr-4">
                {profile.fotoLogo ? (
                  <Image
                    source={{ uri: profile.fotoLogo }}
                    className="w-20 h-20 rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
                    <Ionicons
                      name="business-outline"
                      size={32}
                      color="#9CA3AF"
                    />
                  </View>
                )}
              </View>

              {/* Info Utama */}
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.namaUsaha}
                </Text>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="business-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">
                    {profile.jenisUsaha}
                  </Text>
                </View>

                {/* Status Badge */}
                <View
                  className={`px-3 py-1 rounded-full self-start ${getStatusColor(
                    profile.status
                  )}`}
                >
                  <Text className="text-sm font-medium capitalize">
                    {profile.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Deskripsi */}
            {profile.deskripsiUsaha && (
              <View className="mt-4 pt-4 border-t border-gray-200">
                <Text className="text-gray-700">{profile.deskripsiUsaha}</Text>
              </View>
            )}
          </View>

          {/* Alamat */}
          <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Alamat Usaha
            </Text>

            <View className="space-y-3">
              <View className="flex-row">
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">
                    Alamat Lengkap
                  </Text>
                  <Text className="text-gray-600">{profile.alamatLengkap}</Text>
                </View>
              </View>

              <View className="flex-row">
                <Ionicons name="business-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">Kota</Text>
                  <Text className="text-gray-600">{profile.kota}</Text>
                </View>
              </View>

              <View className="flex-row">
                <Ionicons name="map-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">Provinsi</Text>
                  <Text className="text-gray-600">{profile.provinsi}</Text>
                </View>
              </View>

              <View className="flex-row">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">Kode Pos</Text>
                  <Text className="text-gray-600">{profile.kodePos}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Kontak */}
          <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Kontak
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleCall}
                className="flex-row items-center"
              >
                <Ionicons name="call-outline" size={20} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-900">
                    Nomor Kontak
                  </Text>
                  <Text className="text-blue-600">{profile.nomorKontak}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>

              {profile.email && (
                <TouchableOpacity
                  onPress={handleEmail}
                  className="flex-row items-center"
                >
                  <Ionicons name="mail-outline" size={20} color="#3B82F6" />
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-900">Email</Text>
                    <Text className="text-blue-600">{profile.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}

              {profile.website && (
                <TouchableOpacity
                  onPress={handleWebsite}
                  className="flex-row items-center"
                >
                  <Ionicons name="globe-outline" size={20} color="#3B82F6" />
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-900">Website</Text>
                    <Text className="text-blue-600">{profile.website}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Data Legal */}
          <View className="bg-white rounded-lg p-6 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Data Legal
            </Text>

            <View className="flex-row">
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#6B7280"
              />
              <View className="ml-3 flex-1">
                <Text className="font-medium text-gray-900">NIB</Text>
                <Text className="text-gray-600">{profile.nib}</Text>
              </View>
            </View>
          </View>

          {/* Metadata */}
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Registrasi
            </Text>

            <View className="flex-row">
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <View className="ml-3 flex-1">
                <Text className="font-medium text-gray-900">
                  Tanggal Daftar
                </Text>
                <Text className="text-gray-600">
                  {formatDate(profile.tanggalDaftar)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function ProtectedProfileDetailScreen() {
  return (
    <ProtectedRoute>
      <ProfileDetailScreen />
    </ProtectedRoute>
  );
}
