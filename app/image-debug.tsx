/**
 * Image Debug Screen - Troubleshooting untuk masalah gambar produk
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_CONFIG, ProductStorageService } from "../services";
import { ImageDebugger } from "../utils";

export default function ImageDebugScreen() {
  const [testUrl, setTestUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Test single URL
  const handleTestUrl = async () => {
    if (!testUrl.trim()) {
      alert("Masukkan URL gambar terlebih dahulu");
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await ImageDebugger.testImageUrl(testUrl);
    setTestResult(result);
    setTesting(false);
  };

  // Test backend connection
  const handleTestBackend = async () => {
    setTesting(true);
    await ImageDebugger.checkBackendConnection(API_CONFIG.BASE_URL);
    setTesting(false);
  };

  // Run full system check
  const handleSystemCheck = async () => {
    setTesting(true);
    await ImageDebugger.runSystemCheck(API_CONFIG.BASE_URL);
    setTesting(false);
  };

  // Load and diagnose products
  const handleDiagnoseProducts = async () => {
    setLoadingProducts(true);
    const productList = await ProductStorageService.getMyProducts();
    setProducts(productList);
    setLoadingProducts(false);

    // Diagnose first product if available
    if (productList.length > 0) {
      await ImageDebugger.diagnoseProduct(productList[0]);
    }
  };

  // Test sample upload URL
  const handleTestSampleUpload = () => {
    const sampleUrl = `${API_CONFIG.BASE_URL}/uploads/products/test.jpg`;
    setTestUrl(sampleUrl);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">
              🖼️ Image Debugger
            </Text>
            <Text className="text-sm text-gray-600">
              Troubleshooting gambar produk
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          {/* Quick Actions */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              🚀 Quick Tests
            </Text>

            <TouchableOpacity
              onPress={handleTestBackend}
              disabled={testing}
              className="mb-2 flex-row items-center justify-center border-2 border-blue-600 rounded-lg px-4 py-3"
            >
              <Ionicons name="server-outline" size={18} color="#3B82F6" />
              <Text className="ml-2 text-blue-600 font-semibold">
                Test Backend Connection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSystemCheck}
              disabled={testing}
              className="mb-2 flex-row items-center justify-center border-2 border-blue-600 rounded-lg px-4 py-3"
            >
              <Ionicons name="construct-outline" size={18} color="#3B82F6" />
              <Text className="ml-2 text-blue-600 font-semibold">
                Run Full System Check
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDiagnoseProducts}
              disabled={loadingProducts}
              className="mb-2 flex-row items-center justify-center border-2 border-blue-600 rounded-lg px-4 py-3"
            >
              {loadingProducts ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <Ionicons name="medical-outline" size={18} color="#3B82F6" />
              )}
              <Text className="ml-2 text-blue-600 font-semibold">
                Diagnose My Products
              </Text>
            </TouchableOpacity>
          </View>

          {/* URL Tester */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              🔗 Test Image URL
            </Text>

            <TextInput
              value={testUrl}
              onChangeText={setTestUrl}
              placeholder="Paste image URL here..."
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              multiline
            />

            <View className="flex-row space-x-2 mb-3">
              <TouchableOpacity
                onPress={handleTestSampleUpload}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2"
              >
                <Text className="text-sm text-center text-gray-700">
                  Use Sample URL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTestUrl("")}
                className="bg-gray-100 rounded-lg px-3 py-2"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleTestUrl}
              disabled={testing || !testUrl.trim()}
              className="flex-row items-center justify-center bg-blue-600 rounded-lg px-4 py-3"
            >
              {testing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="search" size={18} color="#FFF" />
                  <Text className="ml-2 text-white font-semibold">
                    Test URL
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Test Result */}
            {testResult && (
              <View
                className={`mt-4 p-3 rounded-lg ${
                  testResult.success ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name={
                      testResult.success ? "checkmark-circle" : "close-circle"
                    }
                    size={24}
                    color={testResult.success ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`ml-2 font-bold ${
                      testResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {testResult.success ? "SUCCESS" : "FAILED"}
                  </Text>
                </View>

                <Text className="text-sm text-gray-700 mb-1">
                  <Text className="font-semibold">URL:</Text> {testResult.url}
                </Text>

                {testResult.status && (
                  <Text className="text-sm text-gray-700 mb-1">
                    <Text className="font-semibold">Status:</Text>{" "}
                    {testResult.status}
                  </Text>
                )}

                {testResult.error && (
                  <Text className="text-sm text-red-700 mb-1">
                    <Text className="font-semibold">Error:</Text>{" "}
                    {testResult.error}
                  </Text>
                )}

                {testResult.success && testResult.details && (
                  <>
                    <Text className="text-sm text-gray-700 mb-1">
                      <Text className="font-semibold">Content-Type:</Text>{" "}
                      {testResult.details.contentType}
                    </Text>
                    <Text className="text-sm text-gray-700">
                      <Text className="font-semibold">Is Image:</Text>{" "}
                      {testResult.details.isImage ? "✅ Yes" : "❌ No"}
                    </Text>

                    {/* Try to display image */}
                    {testResult.details.isImage && (
                      <View className="mt-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                          Preview:
                        </Text>
                        <Image
                          source={{ uri: testResult.url }}
                          style={{ width: "100%", height: 200 }}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          </View>

          {/* Products List */}
          {products.length > 0 && (
            <View className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                📦 My Products ({products.length})
              </Text>

              {products.map((product) => (
                <View
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-3 mb-2"
                >
                  <View className="flex-row items-center">
                    {product.foto && product.foto.length > 0 ? (
                      <Image
                        source={{ uri: product.foto[0] }}
                        style={{ width: 60, height: 60 }}
                        className="rounded-lg mr-3"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-15 h-15 bg-gray-200 rounded-lg mr-3 items-center justify-center">
                        <Ionicons
                          name="image-outline"
                          size={24}
                          color="#9CA3AF"
                        />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">
                        {product.nama}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {product.foto?.length || 0} foto
                      </Text>
                      {product.foto && product.foto.length > 0 && (
                        <TouchableOpacity
                          onPress={async () => {
                            await ImageDebugger.diagnoseProduct(product);
                          }}
                        >
                          <Text className="text-xs text-blue-600 mt-1">
                            🔍 Diagnose
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-sm font-semibold text-blue-900 mb-2">
              💡 Tips Troubleshooting:
            </Text>
            <Text className="text-sm text-blue-800 mb-1">
              1. Pastikan backend running di {API_CONFIG.BASE_URL}
            </Text>
            <Text className="text-sm text-blue-800 mb-1">
              2. Cek folder uploads/products/ ada file gambarnya
            </Text>
            <Text className="text-sm text-blue-800 mb-1">
              3. URL gambar harus format: http://IP:5000/uploads/products/...
            </Text>
            <Text className="text-sm text-blue-800 mb-1">
              4. Cek Console Log untuk detail error
            </Text>
            <Text className="text-sm text-blue-800">
              5. Test dengan &quot;Run Full System Check&quot;
            </Text>
          </View>

          {/* Current Config */}
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              ⚙️ Current Configuration:
            </Text>
            <Text className="text-xs text-gray-700 mb-1">
              Backend: {API_CONFIG.BASE_URL}
            </Text>
            <Text className="text-xs text-gray-700 mb-1">
              Products Endpoint: {API_CONFIG.ENDPOINTS.PRODUCTS}
            </Text>
            <Text className="text-xs text-gray-700">
              Expected Upload URL: {API_CONFIG.BASE_URL}
              /uploads/products/[filename]
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
