import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { TrainingForm } from "../../../components/TrainingForm";
import { TrainingStorageService } from "../../../services";
import { TrainingFormData } from "../../../types";

function EditTrainingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<TrainingFormData>>({});
  const [trainingLoading, setTrainingLoading] = useState(true);

  const loadTraining = useCallback(async () => {
    // Handle both string and array cases from router params
    const trainingId = Array.isArray(id) ? id[0] : id;
    console.log("Edit Training - Raw ID from params:", id);
    console.log("Edit Training - Processed ID:", trainingId);

    if (!trainingId || trainingId === undefined || trainingId === null) {
      console.log("Edit Training - No ID found");
      Alert.alert("Error", "ID pelatihan tidak ditemukan");
      router.back();
      return;
    }

    try {
      setTrainingLoading(true);
      console.log("Edit Training - Loading training with ID:", trainingId);

      const training = await TrainingStorageService.getTrainingById(trainingId);
      console.log("Edit Training - Training loaded:", training);

      if (!training) {
        console.log("Edit Training - Training not found");
        Alert.alert("Error", "Pelatihan tidak ditemukan");
        router.back();
        return;
      }

      // Convert Training to TrainingFormData
      const formData = TrainingStorageService.trainingToFormData(training);
      setInitialData(formData);
      console.log("Edit Training - Initial data set");
    } catch (error) {
      console.error("Error loading training:", error);
      Alert.alert("Error", "Gagal memuat data pelatihan");
      router.back();
    } finally {
      setTrainingLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTraining();
  }, [loadTraining]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: TrainingFormData) => {
    // Handle both string and array cases from router params
    const trainingId = Array.isArray(id) ? id[0] : id;
    if (!trainingId) return;

    setLoading(true);
    try {
      // Get existing training to preserve metadata
      const existingTraining = await TrainingStorageService.getTrainingById(
        trainingId
      );

      if (!existingTraining) {
        Alert.alert("Error", "Pelatihan tidak ditemukan");
        return;
      }

      // Convert form data to training and preserve existing metadata
      const updatedTraining = TrainingStorageService.formDataToTraining(
        formData,
        existingTraining.id
      );

      // Preserve certain metadata from existing training
      updatedTraining.tanggalDibuat = existingTraining.tanggalDibuat;
      updatedTraining.rating = existingTraining.rating;
      updatedTraining.totalPeserta = existingTraining.totalPeserta;
      updatedTraining.tanggalDiperbarui = new Date();

      await TrainingStorageService.saveTraining(updatedTraining);

      Alert.alert("Berhasil", "Pelatihan berhasil diperbarui!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating training:", error);
      Alert.alert("Error", "Gagal memperbarui pelatihan");
    } finally {
      setLoading(false);
    }
  };

  if (trainingLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat data pelatihan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <TrainingForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onBack={handleBack}
      loading={loading}
      isEdit={true}
    />
  );
}

export default function ProtectedEditTrainingScreen() {
  return (
    <ProtectedRoute>
      <EditTrainingScreen />
    </ProtectedRoute>
  );
}
