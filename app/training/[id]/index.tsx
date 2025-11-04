import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { BackButton } from "../../../components/ui";
import { TrainingStorageService } from "../../../services";
import { Training } from "../../../types";

const { width } = Dimensions.get("window");

function TrainingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTraining = useCallback(async () => {
    // Handle both string and array cases from router params
    const trainingId = Array.isArray(id) ? id[0] : id;
    console.log("Training Detail - Raw ID from params:", id);
    console.log("Training Detail - Processed ID:", trainingId);

    if (!trainingId || trainingId === undefined || trainingId === null) {
      console.log("Training Detail - No ID found");
      Alert.alert("Error", "ID pelatihan tidak ditemukan");
      router.back();
      return;
    }

    try {
      setLoading(true);
      console.log("Training Detail - Loading training with ID:", trainingId);

      // Load training
      const trainingData = await TrainingStorageService.getTrainingById(
        trainingId
      );
      console.log("Training Detail - Training loaded:", trainingData);

      if (!trainingData) {
        console.log("Training Detail - Training not found");
        Alert.alert("Error", "Pelatihan tidak ditemukan");
        router.back();
        return;
      }

      setTraining(trainingData);
    } catch (error) {
      console.error("Error loading training:", error);
      Alert.alert("Error", "Gagal memuat data pelatihan");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTraining();
  }, [loadTraining]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    const trainingId = Array.isArray(id) ? id[0] : id;
    console.log("Training Detail - Edit button pressed for ID:", trainingId);
    try {
      router.push({
        pathname: "/training/[id]/edit" as any,
        params: { id: trainingId },
      });
      console.log("Training Detail - Navigation called for edit");
    } catch (error) {
      console.error("Training Detail - Navigation error for edit:", error);
    }
  };

  const handleDelete = () => {
    if (!training) return;

    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus pelatihan "${training.judul}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await TrainingStorageService.deleteTraining(training.id);
              Alert.alert("Berhasil", "Pelatihan berhasil dihapus", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error("Error deleting training:", error);
              Alert.alert("Error", "Gagal menghapus pelatihan");
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Pemula":
        return "bg-green-100 text-green-800";
      case "Menengah":
        return "bg-blue-100 text-blue-800";
      case "Lanjutan":
        return "bg-orange-100 text-orange-800";
      case "Ahli":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFC107" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFC107" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#FFC107"
        />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat detail pelatihan...</Text>
      </SafeAreaView>
    );
  }

  if (!training) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Pelatihan tidak ditemukan</Text>
        <BackButton onPress={handleBack} className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 pt-2 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <BackButton onPress={handleBack} className="mr-4" />
            <Text className="text-lg font-semibold text-gray-900">
              Detail Pelatihan
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
        {/* Training Thumbnail */}
        {training.thumbnail && (
          <View className="bg-white">
            <Image
              source={{ uri: training.thumbnail }}
              style={{ width, height: width * 0.6 }}
              resizeMode="cover"
            />

            {/* Price Badge */}
            <View
              className={`absolute top-4 right-4 px-3 py-2 rounded-full ${
                training.harga === 0 ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              <Text className="text-white text-sm font-bold">
                {TrainingStorageService.formatPrice(training.harga)}
              </Text>
            </View>

            {/* Duration Badge */}
            <View className="absolute bottom-4 right-4 bg-black bg-opacity-60 px-3 py-2 rounded-full">
              <Text className="text-white text-sm font-medium">
                {TrainingStorageService.formatDuration(training.durasi)}
              </Text>
            </View>

            {/* Certificate Badge */}
            {training.sertifikatTersedia && (
              <View className="absolute bottom-4 left-4 bg-yellow-500 px-3 py-2 rounded-full flex-row items-center">
                <Ionicons name="ribbon-outline" size={14} color="white" />
                <Text className="text-white text-sm font-medium ml-1">
                  Sertifikat
                </Text>
              </View>
            )}
          </View>
        )}

        <View className="p-4">
          {/* Training Info */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            {/* Badges */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center space-x-2">
                <View
                  className={`px-3 py-1 rounded-full ${getLevelColor(
                    training.level
                  )}`}
                >
                  <Text className="text-sm font-medium">{training.level}</Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getTypeColor(
                    training.tipeTraining
                  )}`}
                >
                  <Text className="text-sm font-medium">
                    {training.tipeTraining}
                  </Text>
                </View>
              </View>

              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800 text-sm font-medium">
                  {training.kategori}
                </Text>
              </View>
            </View>

            {/* Training Title */}
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {training.judul}
            </Text>

            {/* Rating and Participants */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-2">
                  {renderStars(training.rating)}
                </View>
                <Text className="text-gray-600 text-sm">
                  ({training.rating.toFixed(1)})
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-1">
                  {training.totalPeserta} peserta
                </Text>
              </View>
            </View>

            {/* Instructor */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <Text className="text-gray-600 ml-2 text-lg">
                Instruktur:{" "}
                <Text className="font-medium text-gray-900">
                  {training.instruktur}
                </Text>
              </Text>
            </View>

            {/* Description */}
            <Text className="text-gray-700 text-base leading-6 mb-4">
              {training.deskripsi}
            </Text>

            {/* Duration and Schedule */}
            <View className="border-t border-gray-200 pt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Durasi:</Text>
                <Text className="text-gray-900 font-medium">
                  {TrainingStorageService.formatDuration(training.durasi)}
                </Text>
              </View>

              {training.tanggalMulai && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Tanggal Mulai:</Text>
                  <Text className="text-gray-900 font-medium">
                    {formatDate(training.tanggalMulai)}
                  </Text>
                </View>
              )}

              {training.tanggalSelesai && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Tanggal Selesai:</Text>
                  <Text className="text-gray-900 font-medium">
                    {formatDate(training.tanggalSelesai)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Prerequisites */}
          {training.prerequisites && training.prerequisites.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Prasyarat
              </Text>
              {training.prerequisites.map((prerequisite, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-blue-600 mr-2">•</Text>
                  <Text className="text-gray-700 flex-1">{prerequisite}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Modules */}
          {training.modules && training.modules.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Modul Pembelajaran ({training.modules.length} modul)
              </Text>
              {training.modules.map((module, index) => (
                <View
                  key={module.id}
                  className="border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium mb-1">
                        {index + 1}. {module.judul}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-2">
                        {module.deskripsi}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text className="text-gray-500 text-xs ml-1">
                          {TrainingStorageService.formatDuration(module.durasi)}
                        </Text>
                        <Text className="text-gray-500 text-xs mx-2">•</Text>
                        <Text className="text-gray-500 text-xs">
                          {module.tipeKonten}
                        </Text>
                        {module.isGratis && (
                          <>
                            <Text className="text-gray-500 text-xs mx-2">
                              •
                            </Text>
                            <Text className="text-green-600 text-xs font-medium">
                              Gratis
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {training.tags && training.tags.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {training.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-blue-800 text-sm">#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Training Metadata */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Informasi Pelatihan
            </Text>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tanggal Dibuat:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(training.tanggalDibuat)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Terakhir Diperbarui:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(training.tanggalDiperbarui)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Status:</Text>
                <Text
                  className={`font-medium ${
                    training.isAktif ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {training.isAktif ? "Aktif" : "Non-Aktif"}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Sertifikat:</Text>
                <Text
                  className={`font-medium ${
                    training.sertifikatTersedia
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {training.sertifikatTersedia ? "Tersedia" : "Tidak Tersedia"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Enroll Button */}
      {training.isAktif && (
        <View className="bg-white border-t border-gray-200 p-4">
          <TouchableOpacity className="bg-blue-600 py-4 rounded-lg flex-row items-center justify-center">
            <Ionicons name="school-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-lg">
              {training.harga === 0 ? "Mulai Belajar" : "Daftar Sekarang"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function ProtectedTrainingDetailScreen() {
  return (
    <ProtectedRoute>
      <TrainingDetailScreen />
    </ProtectedRoute>
  );
}
