import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, BackHandler, SafeAreaView } from "react-native";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { UMKMProfileForm } from "../../components/UMKMProfileForm";
import { ProfileStorageService } from "../../services";
import { UMKMFormData } from "../../types";

function CreateProfileScreen() {
  const [loading, setLoading] = useState(false);

  // Handle back navigation
  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const handleBack = () => {
    router.back();
  };

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
    <SafeAreaView className="flex-1">
      <UMKMProfileForm
        onSubmit={handleSubmit}
        onBack={handleBack}
        loading={loading}
      />
    </SafeAreaView>
  );
}

export default function ProtectedCreateProfileScreen() {
  return (
    <ProtectedRoute>
      <CreateProfileScreen />
    </ProtectedRoute>
  );
}
