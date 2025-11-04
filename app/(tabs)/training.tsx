import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { TrainingCard } from "../../components/TrainingCard";
import { TrainingStorageService } from "../../services";
import {
  KATEGORI_TRAINING,
  LEVEL_TRAINING,
  TIPE_TRAINING,
  Training,
  TrainingFilter,
} from "../../types";

function TabTrainingScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<TrainingFilter>({});

  const loadData = async () => {
    try {
      setLoading(true);

      // Load trainings
      const allTrainings = await TrainingStorageService.getAllTrainings();
      const activeTrainings = allTrainings.filter((t) => t.isAktif);
      setTrainings(activeTrainings);

      console.log("Tab Training - Loaded", activeTrainings.length, "trainings");
    } catch (error) {
      console.error("Error loading training data:", error);
      Alert.alert("Error", "Gagal memuat data pelatihan");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    // Apply search and filter
    let filtered = trainings;

    // Text search
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (training) =>
          training.judul.toLowerCase().includes(lowercaseQuery) ||
          training.deskripsi.toLowerCase().includes(lowercaseQuery) ||
          training.instruktur.toLowerCase().includes(lowercaseQuery) ||
          training.tags?.some((tag) =>
            tag.toLowerCase().includes(lowercaseQuery)
          ) ||
          training.kategori.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply filters
    if (filter.kategori) {
      filtered = filtered.filter((t) => t.kategori === filter.kategori);
    }

    if (filter.tipeTraining) {
      filtered = filtered.filter((t) => t.tipeTraining === filter.tipeTraining);
    }

    if (filter.level) {
      filtered = filtered.filter((t) => t.level === filter.level);
    }

    if (filter.hargaMin !== undefined) {
      filtered = filtered.filter((t) => t.harga >= filter.hargaMin!);
    }

    if (filter.hargaMax !== undefined) {
      filtered = filtered.filter((t) => t.harga <= filter.hargaMax!);
    }

    if (filter.gratisOnly) {
      filtered = filtered.filter((t) => t.harga === 0);
    }

    if (filter.sertifikatTersedia) {
      filtered = filtered.filter((t) => t.sertifikatTersedia);
    }

    if (filter.ratingMin !== undefined) {
      filtered = filtered.filter((t) => t.rating >= filter.ratingMin!);
    }

    setFilteredTrainings(filtered);
  }, [searchQuery, trainings, filter]);

  const handleDeleteTraining = async (training: Training) => {
    console.log(
      "Tab Training - Delete requested for training:",
      training.id,
      training.judul
    );
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
              console.log("Tab Training - Deleting training:", training.id);
              await TrainingStorageService.deleteTraining(training.id);
              console.log("Tab Training - Training deleted successfully");
              await loadData();
              Alert.alert("Berhasil", "Pelatihan berhasil dihapus");
            } catch (error) {
              console.error("Error deleting training:", error);
              Alert.alert("Error", "Gagal menghapus pelatihan");
            }
          },
        },
      ]
    );
  };

  const renderTraining = ({ item }: { item: Training }) => (
    <TrainingCard
      training={item}
      onPress={() => {
        console.log(
          "Tab Training - Navigating to training detail with ID:",
          item.id
        );
        try {
          router.push({
            pathname: "/training/[id]" as any,
            params: { id: item.id },
          });
          console.log("Tab Training - Navigation called for detail");
        } catch (error) {
          console.error("Tab Training - Navigation error for detail:", error);
        }
      }}
      onEdit={() => {
        console.log(
          "Tab Training - Navigating to training edit with ID:",
          item.id
        );
        try {
          router.push({
            pathname: "/training/[id]/edit" as any,
            params: { id: item.id },
          });
          console.log("Tab Training - Navigation called for edit");
        } catch (error) {
          console.error("Tab Training - Navigation error for edit:", error);
        }
      }}
      onDelete={() => handleDeleteTraining(item)}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name="school-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4 mb-2">
        {searchQuery || Object.keys(filter).length > 0
          ? "Tidak ada pelatihan yang ditemukan"
          : "Belum ada pelatihan"}
      </Text>
      <Text className="text-gray-400 text-center px-8 mb-6">
        {searchQuery || Object.keys(filter).length > 0
          ? "Coba ubah kata kunci atau filter pencarian"
          : "Mulai tambahkan pelatihan pertama Anda"}
      </Text>
      {!searchQuery && Object.keys(filter).length === 0 && (
        <TouchableOpacity
          onPress={() => router.push("/training/create")}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Tambah Pelatihan</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const clearFilter = () => {
    setFilter({});
    setShowFilter(false);
  };

  const applyFilter = (newFilter: TrainingFilter) => {
    setFilter(newFilter);
    setShowFilter(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Memuat pelatihan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-2 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Pelatihan & Edukasi Digital
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/training/create")}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center space-x-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Cari pelatihan, instruktur, kategori..."
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

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            className={`p-3 rounded-lg ${
              Object.keys(filter).length > 0 ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name="funnel-outline"
              size={20}
              color={Object.keys(filter).length > 0 ? "white" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      {trainings.length > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {filteredTrainings.length}
              </Text>
              <Text className="text-sm text-gray-600">Pelatihan</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {trainings.filter((t) => t.harga === 0).length}
              </Text>
              <Text className="text-sm text-gray-600">Gratis</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {new Set(trainings.map((t) => t.kategori)).size}
              </Text>
              <Text className="text-sm text-gray-600">Kategori</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {trainings.filter((t) => t.sertifikatTersedia).length}
              </Text>
              <Text className="text-sm text-gray-600">Bersertifikat</Text>
            </View>
          </View>
        </View>
      )}

      {/* Active Filters */}
      {Object.keys(filter).length > 0 && (
        <View className="bg-blue-50 px-4 py-2 border-b border-blue-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-blue-700 text-sm">
              Filter aktif: {Object.keys(filter).length}
            </Text>
            <TouchableOpacity onPress={clearFilter}>
              <Text className="text-blue-600 text-sm font-medium">
                Hapus Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Training List */}
      <FlatList
        data={filteredTrainings}
        renderItem={renderTraining}
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

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={applyFilter}
        currentFilter={filter}
      />
    </SafeAreaView>
  );
}

// Filter Modal Component
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TrainingFilter) => void;
  currentFilter: TrainingFilter;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const [tempFilter, setTempFilter] = useState<TrainingFilter>(currentFilter);

  useEffect(() => {
    setTempFilter(currentFilter);
  }, [currentFilter]);

  const handleApply = () => {
    onApply(tempFilter);
  };

  const handleClear = () => {
    setTempFilter({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black bg-opacity-50 justify-end">
        <View className="bg-white rounded-t-lg max-h-3/4">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Filter Pelatihan</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="p-4 max-h-96">
            {/* Kategori */}
            <Text className="text-gray-700 font-medium mb-2">Kategori</Text>
            <View className="flex-row flex-wrap mb-4">
              {KATEGORI_TRAINING.map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  onPress={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      kategori:
                        prev.kategori === kategori ? undefined : kategori,
                    }))
                  }
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                    tempFilter.kategori === kategori
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      tempFilter.kategori === kategori
                        ? "text-white text-sm"
                        : "text-gray-700 text-sm"
                    }
                  >
                    {kategori}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tipe Training */}
            <Text className="text-gray-700 font-medium mb-2">Tipe</Text>
            <View className="flex-row flex-wrap mb-4">
              {TIPE_TRAINING.map((tipe) => (
                <TouchableOpacity
                  key={tipe}
                  onPress={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      tipeTraining:
                        prev.tipeTraining === tipe ? undefined : tipe,
                    }))
                  }
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                    tempFilter.tipeTraining === tipe
                      ? "bg-green-600 border-green-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      tempFilter.tipeTraining === tipe
                        ? "text-white text-sm"
                        : "text-gray-700 text-sm"
                    }
                  >
                    {tipe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Level */}
            <Text className="text-gray-700 font-medium mb-2">Level</Text>
            <View className="flex-row flex-wrap mb-4">
              {LEVEL_TRAINING.map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      level: prev.level === level ? undefined : level,
                    }))
                  }
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                    tempFilter.level === level
                      ? "bg-purple-600 border-purple-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      tempFilter.level === level
                        ? "text-white text-sm"
                        : "text-gray-700 text-sm"
                    }
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Options */}
            <TouchableOpacity
              onPress={() =>
                setTempFilter((prev) => ({
                  ...prev,
                  gratisOnly: !prev.gratisOnly,
                }))
              }
              className="flex-row items-center mb-3"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  tempFilter.gratisOnly
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {tempFilter.gratisOnly && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-700">Hanya yang gratis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setTempFilter((prev) => ({
                  ...prev,
                  sertifikatTersedia: !prev.sertifikatTersedia,
                }))
              }
              className="flex-row items-center mb-4"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  tempFilter.sertifikatTersedia
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {tempFilter.sertifikatTersedia && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-700">Ada sertifikat digital</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 mr-2 py-3 border border-gray-300 rounded-lg items-center"
            >
              <Text className="text-gray-700 font-medium">Hapus Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 ml-2 py-3 bg-blue-600 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ProtectedTabTrainingScreen() {
  return (
    <ProtectedRoute>
      <TabTrainingScreen />
    </ProtectedRoute>
  );
}
