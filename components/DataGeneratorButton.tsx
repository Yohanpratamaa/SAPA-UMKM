import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { DataSeeder } from "../utils/DataSeeder";

interface DataGeneratorButtonProps {
  onDataGenerated: () => void;
}

export const DataGeneratorButton: React.FC<DataGeneratorButtonProps> = ({
  onDataGenerated,
}) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateData = async () => {
    Alert.alert(
      "Generate Sample Data",
      "🚀 Buat data contoh untuk testing aplikasi:\n\n• 5 Profil UMKM beragam\n• 10 Produk marketplace\n• Data realistis Indonesia\n\nLanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            setLoading(true);
            try {
              console.log("🔥 Starting data generation...");
              await DataSeeder.seedAllData();
              onDataGenerated();
              console.log("✅ Data generation completed successfully");
            } catch (error) {
              console.error("❌ Error generating sample data:", error);
              Alert.alert(
                "Error",
                `Gagal membuat data sample: ${
                  error instanceof Error ? error.message : String(error)
                }`
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleGenerateData}
      disabled={loading}
      style={{
        backgroundColor: loading ? "#9CA3AF" : "#10B981",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name={loading ? "hourglass" : "flash"}
          size={24}
          color="white"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {loading ? "Generating Data..." : "🚀 Generate Sample Data"}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            {loading
              ? "Membuat data contoh..."
              : "Buat data demo: 5 profil UMKM + 10 produk"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );
};
