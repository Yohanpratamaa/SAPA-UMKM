import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { TrainingForm } from "../../components/TrainingForm";
import { TrainingStorageService } from "../../services";
import { TrainingFormData } from "../../types";

function CreateTrainingScreen() {
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: TrainingFormData) => {
    setLoading(true);
    try {
      const training = TrainingStorageService.formDataToTraining(formData);
      await TrainingStorageService.saveTraining(training);

      Alert.alert("Berhasil", "Pelatihan berhasil ditambahkan!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error creating training:", error);
      Alert.alert("Error", "Gagal menambahkan pelatihan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainingForm
      onSubmit={handleSubmit}
      onBack={handleBack}
      loading={loading}
      isEdit={false}
    />
  );
}

export default function ProtectedCreateTrainingScreen() {
  return (
    <ProtectedRoute>
      <CreateTrainingScreen />
    </ProtectedRoute>
  );
}
