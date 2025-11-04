import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SampleDataGenerator } from "../utils/SampleDataGenerator";

interface DataSummary {
  profileCount: number;
  productCount: number;
  profilesByJenis: { [key: string]: number };
  productsByKategori: { [key: string]: number };
}

export const SampleDataManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<DataSummary | null>(null);

  const loadSummary = async () => {
    try {
      const dataSummary = await SampleDataGenerator.getDataSummary();
      setSummary(dataSummary);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  React.useEffect(() => {
    loadSummary();
  }, []);

  const handleGenerateProfiles = async () => {
    Alert.alert(
      "Generate Sample Profiles",
      "Ini akan membuat data profil UMKM contoh. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            setLoading(true);
            try {
              await SampleDataGenerator.generateSampleProfiles();
              await loadSummary();
              Alert.alert("Berhasil", "Sample profil UMKM berhasil dibuat!");
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Error", "Gagal membuat sample profil");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleGenerateProducts = async () => {
    Alert.alert(
      "Generate Sample Products",
      "Ini akan membuat data produk contoh. Pastikan sudah ada profil UMKM. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            setLoading(true);
            try {
              await SampleDataGenerator.generateSampleProducts();
              await loadSummary();
              Alert.alert("Berhasil", "Sample produk berhasil dibuat!");
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Error", "Gagal membuat sample produk");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleGenerateAll = async () => {
    Alert.alert(
      "Generate All Sample Data",
      "Ini akan membuat semua data contoh (profil UMKM & produk). Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Generate All",
          onPress: async () => {
            setLoading(true);
            try {
              await SampleDataGenerator.generateAllSampleData();
              await loadSummary();
              Alert.alert("Berhasil", "Semua sample data berhasil dibuat!");
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Error", "Gagal membuat sample data");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Hapus Semua Data",
      "⚠️ PERINGATAN: Ini akan menghapus SEMUA data profil dan produk! Tindakan ini tidak dapat dibatalkan. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await SampleDataGenerator.clearAllData();
              await loadSummary();
              Alert.alert("Berhasil", "Semua data berhasil dihapus!");
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Error", "Gagal menghapus data");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const ActionButton: React.FC<{
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    color: string;
    disabled?: boolean;
  }> = ({ title, subtitle, icon, onPress, color, disabled = false }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`bg-white rounded-xl p-4 mb-4 shadow-lg border border-gray-200 ${
        disabled || loading ? "opacity-50" : ""
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-4`}
          style={{ backgroundColor: color + "20" }}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Sample Data Manager
          </Text>
          <Text className="text-gray-600">
            Kelola data contoh untuk aplikasi SAPA UMKM
          </Text>
        </View>

        {/* Loading Overlay */}
        {loading && (
          <View className="absolute inset-0 bg-black/20 items-center justify-center z-50">
            <View className="bg-white rounded-xl p-6 items-center shadow-lg">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="mt-3 text-gray-700 font-medium">
                Memproses data...
              </Text>
            </View>
          </View>
        )}

        {/* Current Data Summary */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-lg border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            📊 Ringkasan Data Saat Ini
          </Text>

          {summary ? (
            <>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Total Profil UMKM:</Text>
                <Text className="font-bold text-blue-600">
                  {summary.profileCount}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-600">Total Produk:</Text>
                <Text className="font-bold text-green-600">
                  {summary.productCount}
                </Text>
              </View>

              {/* Profile breakdown */}
              {Object.keys(summary.profilesByJenis).length > 0 && (
                <View className="mb-4">
                  <Text className="font-medium text-gray-700 mb-2">
                    Profil per Jenis Usaha:
                  </Text>
                  {Object.entries(summary.profilesByJenis).map(
                    ([jenis, count]) => (
                      <View
                        key={jenis}
                        className="flex-row justify-between items-center mb-1"
                      >
                        <Text className="text-sm text-gray-600">
                          • {jenis}:
                        </Text>
                        <Text className="text-sm font-medium text-gray-800">
                          {count}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}

              {/* Product breakdown */}
              {Object.keys(summary.productsByKategori).length > 0 && (
                <View>
                  <Text className="font-medium text-gray-700 mb-2">
                    Produk per Kategori:
                  </Text>
                  {Object.entries(summary.productsByKategori).map(
                    ([kategori, count]) => (
                      <View
                        key={kategori}
                        className="flex-row justify-between items-center mb-1"
                      >
                        <Text className="text-sm text-gray-600">
                          • {kategori}:
                        </Text>
                        <Text className="text-sm font-medium text-gray-800">
                          {count}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </>
          ) : (
            <Text className="text-gray-500 text-center">Memuat data...</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            🔧 Aksi Data
          </Text>

          <ActionButton
            title="Generate Profil UMKM"
            subtitle="Buat 10 profil UMKM contoh dengan berbagai jenis usaha"
            icon="business-outline"
            onPress={handleGenerateProfiles}
            color="#3B82F6"
          />

          <ActionButton
            title="Generate Produk"
            subtitle="Buat 20+ produk contoh untuk setiap profil UMKM"
            icon="storefront-outline"
            onPress={handleGenerateProducts}
            color="#10B981"
          />

          <ActionButton
            title="Generate Semua Data"
            subtitle="Buat profil UMKM dan produk sekaligus"
            icon="rocket-outline"
            onPress={handleGenerateAll}
            color="#8B5CF6"
          />

          <View className="border-t border-gray-200 pt-4 mt-2">
            <ActionButton
              title="Hapus Semua Data"
              subtitle="⚠️ Hapus semua profil dan produk (tidak dapat dibatalkan)"
              icon="trash-outline"
              onPress={handleClearAll}
              color="#EF4444"
            />
          </View>
        </View>

        {/* Info */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-800 font-medium mb-1">
                Informasi Penting
              </Text>
              <Text className="text-blue-700 text-sm leading-5">
                • Data sample ini untuk keperluan testing dan demo aplikasi
                {"\n"}• Pastikan backup data penting sebelum menggunakan fitur
                hapus{"\n"}• Generate produk hanya bisa dilakukan jika sudah ada
                profil UMKM{"\n"}• Semua data disimpan di local storage device
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
