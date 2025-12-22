import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";

interface StorageData {
  key: string;
  value: string | null;
  preview: string;
}

export default function AuthDebugScreen() {
  const { user, isAuthenticated, token } = useAuth();
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [apiTest, setApiTest] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStorageData = async () => {
    const keys = [
      "SAPA_UMKM_TOKEN",
      "SAPA_UMKM_REFRESH_TOKEN",
      "SAPA_UMKM_USER",
      "SAPA_UMKM_REMEMBER_ME",
    ];

    const data: StorageData[] = [];

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      let preview = value || "null";

      if (value) {
        if (key.includes("TOKEN")) {
          preview =
            value.substring(0, 30) + "..." + value.substring(value.length - 10);
        } else if (key.includes("USER")) {
          try {
            const parsed = JSON.parse(value);
            preview = `User: ${parsed.username} (${parsed.email})`;
          } catch {
            preview = value.substring(0, 50) + "...";
          }
        }
      }

      data.push({ key, value, preview });
    }

    setStorageData(data);
  };

  const testApiEndpoint = async () => {
    console.log("🧪 Testing /api/auth/me endpoint...");

    try {
      const response = await apiClient.getCurrentUser();
      console.log("✅ API Response:", response);
      setApiTest({
        success: response.success,
        message: response.message || "OK",
        data: response.data
          ? {
              username: response.data.username,
              email: response.data.email,
            }
          : null,
      });
    } catch (error: any) {
      console.error("❌ API Error:", error);
      setApiTest({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };

  const clearAllTokens = async () => {
    await AsyncStorage.multiRemove([
      "SAPA_UMKM_TOKEN",
      "SAPA_UMKM_REFRESH_TOKEN",
      "SAPA_UMKM_USER",
    ]);
    await loadStorageData();
    console.log("🗑️ All tokens cleared!");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStorageData();
    await testApiEndpoint();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStorageData();
    testApiEndpoint();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>🔐 Auth Debug</Text>

        {/* Context State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AuthContext State</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Authenticated:</Text>
            <Text
              style={[
                styles.value,
                isAuthenticated ? styles.success : styles.error,
              ]}
            >
              {isAuthenticated ? "✅ Yes" : "❌ No"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>User:</Text>
            <Text style={styles.value}>
              {user ? `${user.username} (${user.email})` : "null"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Token in Context:</Text>
            <Text style={styles.value}>
              {token ? `${token.substring(0, 20)}...` : "null"}
            </Text>
          </View>
        </View>

        {/* Storage Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AsyncStorage Data</Text>
          {storageData.map((item) => (
            <View key={item.key} style={styles.storageItem}>
              <Text style={styles.storageKey}>{item.key}</Text>
              <Text style={styles.storageValue}>
                {item.value ? "✅" : "❌"} {item.preview}
              </Text>
            </View>
          ))}
        </View>

        {/* API Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Test (/auth/me)</Text>
          {apiTest ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Success:</Text>
                <Text
                  style={[
                    styles.value,
                    apiTest.success ? styles.success : styles.error,
                  ]}
                >
                  {apiTest.success ? "✅ Yes" : "❌ No"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Message:</Text>
                <Text style={styles.value}>{apiTest.message}</Text>
              </View>
              {apiTest.data && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>User Data:</Text>
                  <Text style={styles.value}>
                    {apiTest.data.username} ({apiTest.data.email})
                  </Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.value}>Loading...</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={testApiEndpoint}
          >
            <Text style={styles.buttonText}>🔄 Test API</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={loadStorageData}
          >
            <Text style={styles.buttonText}>📱 Reload Storage</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={clearAllTokens}
          >
            <Text style={styles.buttonText}>🗑️ Clear All Tokens</Text>
          </TouchableOpacity>
        </View>

        {/* Diagnostic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Diagnostic</Text>
          <Text style={styles.diagnosticText}>
            {isAuthenticated && token
              ? "✅ Authentication is working correctly"
              : "❌ Authentication issue detected:"}
          </Text>
          {!isAuthenticated && (
            <Text style={styles.diagnosticText}>
              - User is not authenticated
            </Text>
          )}
          {!token && (
            <Text style={styles.diagnosticText}>
              - Token is missing from context
            </Text>
          )}
          {!storageData.find((d) => d.key === "SAPA_UMKM_TOKEN")?.value && (
            <Text style={styles.diagnosticText}>
              - Token is missing from storage
            </Text>
          )}
          {apiTest && !apiTest.success && (
            <Text style={styles.diagnosticText}>
              - API request failed (token may be invalid)
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    width: 120,
  },
  value: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
  },
  success: {
    color: "#10B981",
    fontWeight: "600",
  },
  error: {
    color: "#EF4444",
    fontWeight: "600",
  },
  storageItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  storageKey: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  storageValue: {
    fontSize: 12,
    color: "#111827",
    fontFamily: "monospace",
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#10B981",
  },
  dangerButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  diagnosticText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 4,
  },
});
