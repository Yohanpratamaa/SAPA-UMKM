import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { DataSeeder } from "../utils/DataSeeder";

interface QuickDataActionProps {
  profileCount: number;
  productCount: number;
  onDataGenerated: () => void;
}

export const QuickDataAction: React.FC<QuickDataActionProps> = ({
  profileCount,
  productCount,
  onDataGenerated,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleGenerateData = async () => {
    Alert.alert(
      "Generate Sample Data",
      "Buat data contoh untuk testing aplikasi:\n\n• 10 Profil UMKM beragam\n• 20+ Produk marketplace\n• Data realistis Indonesia\n\nLanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Generate",
          onPress: async () => {
            setLoading(true);
            try {
              await DataSeeder.seedAllData();
              onDataGenerated();
              Alert.alert(
                "Berhasil! 🎉",
                "Data sample berhasil dibuat!\n\nSilakan cek tab Profile dan Marketplace untuk melihat data yang telah dibuat."
              );
            } catch (error) {
              console.error("Error generating sample data:", error);
              Alert.alert("Error", "Gagal membuat data sample");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleNavigateToProfiles = () => {
    router.push("/(tabs)/profile/" as any);
  };

  const handleNavigateToMarketplace = () => {
    router.push("/(tabs)/marketplace/" as any);
  };

  // If no data exists, show generate button
  if (profileCount === 0 && productCount === 0) {
    return (
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={handleGenerateData}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#9CA3AF" : "#10B981",
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
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
                {loading ? "Generating..." : "🚀 Generate Data Sample"}
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
                  : "Buat data demo untuk testing aplikasi"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </View>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#FFFBEB",
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
            borderWidth: 1,
            borderColor: "#FDE68A",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="information-circle" size={16} color="#D97706" />
            <Text
              style={{
                color: "#92400E",
                fontSize: 12,
                marginLeft: 8,
                flex: 1,
              }}
            >
              <Text style={{ fontWeight: "600" }}>Tip:</Text> Data sample
              membantu testing fitur Profile dan Marketplace
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // If data exists, show quick navigation
  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          backgroundColor: "#F0FDF4",
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: "#BBF7D0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text
              style={{
                color: "#166534",
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Data Ready! 🎉
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/sample-data" as any)}
            style={{
              backgroundColor: "#059669",
              paddingVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              Kelola
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="business" size={16} color="#3B82F6" />
            <Text
              style={{
                color: "#374151",
                fontSize: 14,
                marginLeft: 4,
                fontWeight: "500",
              }}
            >
              {profileCount} Profil UMKM
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="storefront" size={16} color="#7C3AED" />
            <Text
              style={{
                color: "#374151",
                fontSize: 14,
                marginLeft: 4,
                fontWeight: "500",
              }}
            >
              {productCount} Produk
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={handleNavigateToProfiles}
            style={{
              backgroundColor: "#3B82F6",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginRight: 8,
            }}
          >
            <Ionicons name="business" size={16} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
                marginLeft: 8,
              }}
            >
              Lihat Profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigateToMarketplace}
            style={{
              backgroundColor: "#8B5CF6",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Ionicons name="storefront" size={16} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
                marginLeft: 8,
              }}
            >
              Lihat Produk
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
