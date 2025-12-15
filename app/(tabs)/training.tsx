import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { TrainingStorageService } from "../../services";

function TabTrainingScreen() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const data = await TrainingStorageService.getAllTrainings();
      // Map API data to UI format
      const mappedData = data.map((t) => ({
        id: t.id,
        title: t.judul,
        description: t.deskripsi,
        duration: `${t.durasi} menit`,
        type: t.tipeTraining,
        difficulty: t.level,
        thumbnail: t.thumbnail || "https://via.placeholder.com/400x200",
        modules: t.modules || [],
      }));
      setTrainings(mappedData);
    } catch (error) {
      console.error("Error loading trainings:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrainings();
    }, [])
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Pemula":
        return "bg-green-100 text-green-800";
      case "Menengah":
        return "bg-blue-100 text-blue-800";
      case "Lanjutan":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTrainingCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedModule(item);
        setShowModuleDetail(true);
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Duration Badge */}
        <View className="absolute top-3 right-3 bg-black bg-opacity-60 px-3 py-2 rounded-full">
          <Text className="text-white text-sm font-medium">
            {item.duration}
          </Text>
        </View>

        {/* Type Badge */}
        <View className="absolute top-3 left-3 bg-blue-600 px-3 py-2 rounded-full">
          <Text className="text-white text-sm font-bold">{item.type}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Header with difficulty badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View
            className={`px-3 py-1 rounded-full ${getDifficultyColor(
              item.difficulty
            )}`}
          >
            <Text className="text-sm font-medium">{item.difficulty}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="play-circle-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {item.modules.length} modul
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Module Preview */}
        <View className="border-t border-gray-100 pt-3">
          <Text className="text-gray-700 text-sm font-medium mb-2">
            Modul Pembelajaran:
          </Text>
          {item.modules.slice(0, 2).map((module: any, index: number) => (
            <View key={module.id} className="flex-row items-center mb-1">
              <Ionicons
                name={
                  module.type === "Video"
                    ? "play-circle-outline"
                    : "document-text-outline"
                }
                size={14}
                color="#6B7280"
              />
              <Text
                className="text-gray-600 text-xs ml-2 flex-1"
                numberOfLines={1}
              >
                {index + 1}. {module.title}
              </Text>
            </View>
          ))}
          {item.modules.length > 2 && (
            <Text className="text-blue-600 text-xs font-medium">
              +{item.modules.length - 2} modul lainnya
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModuleDetailModal = () => (
    <Modal
      visible={showModuleDetail}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Detail Pelatihan
            </Text>
            <TouchableOpacity
              onPress={() => setShowModuleDetail(false)}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {selectedModule && (
          <ScrollView className="flex-1">
            {/* Header Image */}
            <Image
              source={{ uri: selectedModule.thumbnail }}
              className="w-full h-48"
              resizeMode="cover"
            />

            <View className="p-4">
              {/* Title & Info */}
              <View className="mb-4">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedModule.title}
                </Text>

                <View className="flex-row items-center mb-3">
                  <View
                    className={`px-3 py-1 rounded-full mr-3 ${getDifficultyColor(
                      selectedModule.difficulty
                    )}`}
                  >
                    <Text className="text-sm font-medium">
                      {selectedModule.difficulty}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {selectedModule.duration}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-700 text-base leading-6">
                  {selectedModule.description}
                </Text>
              </View>

              {/* Modules List */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  Daftar Modul ({selectedModule.modules.length} modul)
                </Text>

                {selectedModule.modules.map((module: any, index: number) => (
                  <TouchableOpacity
                    key={module.id}
                    className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
                    onPress={() => {
                      // Navigate to module content
                      router.push({
                        pathname: "/training/[id]" as any,
                        params: {
                          id: selectedModule.id,
                          moduleId: module.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row items-start">
                      <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                        <Text className="text-blue-600 font-bold text-sm">
                          {index + 1}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold mb-1">
                          {module.title}
                        </Text>

                        <Text className="text-gray-600 text-sm mb-2">
                          {module.content}
                        </Text>

                        <View className="flex-row items-center">
                          <Ionicons
                            name={
                              module.type === "Video"
                                ? "play-circle-outline"
                                : "document-text-outline"
                            }
                            size={14}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs ml-1">
                            {module.type}
                          </Text>
                          <Text className="text-gray-500 text-xs mx-2">•</Text>
                          <Text className="text-gray-500 text-xs">
                            {module.duration}
                          </Text>
                        </View>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-2 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Pelatihan Bisnis UMKM
        </Text>
        <Text className="text-gray-600">
          Pelajari cara membangun dan mengembangkan bisnis yang sukses
        </Text>
      </View>

      {/* Statistics */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">
              {trainings.length}
            </Text>
            <Text className="text-sm text-gray-600">Pelatihan</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {trainings.reduce(
                (total, module) => total + module.modules.length,
                0
              )}
            </Text>
            <Text className="text-sm text-gray-600">Total Modul</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-600">100%</Text>
            <Text className="text-sm text-gray-600">Gratis</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-600">6</Text>
            <Text className="text-sm text-gray-600">Kategori</Text>
          </View>
        </View>
      </View>

      {/* Training List */}
      <FlatList
        data={trainings}
        renderItem={renderTrainingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Module Detail Modal */}
      {renderModuleDetailModal()}
    </SafeAreaView>
  );
}

export default function ProtectedTabTrainingScreen() {
  return (
    <ProtectedRoute>
      <TabTrainingScreen />
    </ProtectedRoute>
  );
}
