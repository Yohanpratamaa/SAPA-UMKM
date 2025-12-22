import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_CONFIG } from "../services/api/config";
import { ConnectionDebugger } from "../utils/ConnectionDebugger";

interface TestResult {
  test: string;
  status: "success" | "failed" | "warning";
  message: string;
  details?: any;
}

export default function ConnectionTestScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      const tester = new ConnectionDebugger();
      const testResults = await tester.runAllTests();
      setResults(testResults);
      setLastTestTime(new Date());
    } catch (error: any) {
      Alert.alert("Error", `Failed to run tests: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const quickTest = async () => {
    setIsRunning(true);

    try {
      const success = await ConnectionDebugger.quickTest();

      if (success) {
        Alert.alert("✅ Success", "Backend is reachable and healthy!");
      } else {
        Alert.alert("⚠️ Warning", "Backend responded but may have issues.");
      }
    } catch (error: any) {
      Alert.alert("❌ Failed", `Cannot reach backend: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Connection Diagnostics</Text>
        <Text style={styles.subtitle}>Test backend connectivity</Text>
      </View>

      <View style={styles.configSection}>
        <Text style={styles.configTitle}>Current Configuration</Text>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Platform:</Text>
          <Text style={styles.configValue}>{Platform.OS}</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Base URL:</Text>
          <Text style={styles.configValue}>{API_CONFIG.BASE_URL}</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Timeout:</Text>
          <Text style={styles.configValue}>{API_CONFIG.TIMEOUT}ms</Text>
        </View>
        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Dev Mode:</Text>
          <Text style={styles.configValue}>{__DEV__ ? "Yes" : "No"}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>🔍 Run Full Diagnostics</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={quickTest}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>⚡ Quick Test</Text>
        </TouchableOpacity>
      </View>

      {lastTestTime && (
        <Text style={styles.lastTest}>
          Last test: {formatTime(lastTestTime)}
        </Text>
      )}

      <ScrollView style={styles.resultsContainer}>
        {results.length === 0 && !isRunning ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tests run yet</Text>
            <Text style={styles.emptySubtext}>
              Tap "Run Full Diagnostics" to start
            </Text>
          </View>
        ) : (
          results.map((result, index) => (
            <View
              key={index}
              style={[
                styles.resultCard,
                { borderLeftColor: getStatusColor(result.status) },
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultIcon}>
                  {getStatusIcon(result.status)}
                </Text>
                <Text style={styles.resultTitle}>{result.test}</Text>
              </View>

              <Text style={styles.resultMessage}>{result.message}</Text>

              {result.details && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsTitle}>Details:</Text>
                  <Text style={styles.detailsText}>
                    {JSON.stringify(result.details, null, 2)}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {results.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>
              ✅ {results.filter((r) => r.status === "success").length} Passed
            </Text>
            <Text style={styles.summaryItem}>
              ⚠️ {results.filter((r) => r.status === "warning").length} Warnings
            </Text>
            <Text style={styles.summaryItem}>
              ❌ {results.filter((r) => r.status === "failed").length} Failed
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  configSection: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  configTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  configItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  configLabel: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  configValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  lastTest: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  resultMessage: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 11,
    color: "#4B5563",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    fontSize: 14,
    color: "#4B5563",
  },
});
