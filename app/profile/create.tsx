import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { UMKMProfileForm } from "../../components/UMKMProfileForm";
import { ProfileStorageService } from "../../services";
import { UMKMFormData } from "../../types";

export default function CreateProfileScreen() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: UMKMFormData) => {
    setLoading(true);
    try {
      const profile = ProfileStorageService.formDataToProfile(formData);
      await ProfileStorageService.saveProfile(profile);

      Alert.alert("Berhasil", "Profil UMKM berhasil disimpan!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Gagal menyimpan profil UMKM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <UMKMProfileForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
}
