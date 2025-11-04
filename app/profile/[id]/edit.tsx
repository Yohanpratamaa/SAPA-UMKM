import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { UMKMProfileForm } from "../../../components/UMKMProfileForm";
import { ProfileStorageService } from "../../../services";
import { UMKMFormData, UMKMProfile } from "../../../types";

function EditProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<UMKMFormData>>({});
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    // Handle both string and array cases from router params
    const profileId = Array.isArray(id) ? id[0] : id;
    console.log("Edit (dynamic) - ID received:", profileId);

    if (!profileId || profileId === undefined) {
      console.log("Edit (dynamic) - No ID found");
      Alert.alert("Error", "ID profil tidak ditemukan");
      router.back();
      return;
    }

    try {
      setProfileLoading(true);
      console.log("Edit (dynamic) - Loading profile with ID:", profileId);
      const profile = await ProfileStorageService.getProfileById(profileId);
      console.log("Edit (dynamic) - Profile loaded:", profile);

      if (!profile) {
        console.log("Edit (dynamic) - Profile not found");
        Alert.alert("Error", "Profil tidak ditemukan");
        router.back();
        return;
      }

      // Convert UMKMProfile to UMKMFormData
      setInitialData({
        namaUsaha: profile.namaUsaha,
        jenisUsaha: profile.jenisUsaha,
        deskripsiUsaha: profile.deskripsiUsaha,
        alamatLengkap: profile.alamatLengkap,
        kota: profile.kota,
        provinsi: profile.provinsi,
        kodePos: profile.kodePos,
        nib: profile.nib,
        nomorKontak: profile.nomorKontak,
        email: profile.email,
        website: profile.website,
        fotoLogo: profile.fotoLogo,
      });
      console.log("Edit (dynamic) - Initial data set");
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Gagal memuat data profil");
      router.back();
    } finally {
      setProfileLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: UMKMFormData) => {
    // Handle both string and array cases from router params
    const profileId = Array.isArray(id) ? id[0] : id;
    if (!profileId) return;

    setLoading(true);
    try {
      // Get existing profile to preserve metadata
      const existingProfile = await ProfileStorageService.getProfileById(
        profileId
      );

      if (!existingProfile) {
        Alert.alert("Error", "Profil tidak ditemukan");
        return;
      }

      // Convert form data to profile and preserve existing metadata
      const updatedProfile: UMKMProfile = {
        ...existingProfile,
        namaUsaha: formData.namaUsaha,
        jenisUsaha: formData.jenisUsaha,
        deskripsiUsaha: formData.deskripsiUsaha,
        alamatLengkap: formData.alamatLengkap,
        kota: formData.kota,
        provinsi: formData.provinsi,
        kodePos: formData.kodePos,
        nib: formData.nib,
        nomorKontak: formData.nomorKontak,
        email: formData.email,
        website: formData.website,
        fotoLogo: formData.fotoLogo,
      };

      await ProfileStorageService.saveProfile(updatedProfile);

      Alert.alert("Berhasil", "Profil UMKM berhasil diperbarui!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Gagal memperbarui profil UMKM");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat data profil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <UMKMProfileForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onBack={handleBack}
        loading={loading}
        isEdit={true}
      />
    </SafeAreaView>
  );
}

export default function ProtectedEditProfileScreen() {
  return (
    <ProtectedRoute>
      <EditProfileScreen />
    </ProtectedRoute>
  );
}
