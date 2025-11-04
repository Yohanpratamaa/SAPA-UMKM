import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductForm } from "../../../components/ProductForm";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { ProductStorageService } from "../../../services";
import { ProductFormData } from "../../../types";

function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ProductFormData>>({});
  const [productLoading, setProductLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    // Handle both string and array cases from router params
    const productId = Array.isArray(id) ? id[0] : id;
    console.log("Edit Product - Raw ID from params:", id);
    console.log("Edit Product - Processed ID:", productId);

    if (!productId || productId === undefined || productId === null) {
      console.log("Edit Product - No ID found");
      Alert.alert("Error", "ID produk tidak ditemukan");
      router.back();
      return;
    }

    try {
      setProductLoading(true);
      console.log("Edit Product - Loading product with ID:", productId);

      const product = await ProductStorageService.getProductById(productId);
      console.log("Edit Product - Product loaded:", product);

      if (!product) {
        console.log("Edit Product - Product not found");
        Alert.alert("Error", "Produk tidak ditemukan");
        router.back();
        return;
      }

      // Convert Product to ProductFormData
      const formData = ProductStorageService.productToFormData(product);
      setInitialData(formData);
      console.log("Edit Product - Initial data set");
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Gagal memuat data produk");
      router.back();
    } finally {
      setProductLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: ProductFormData) => {
    // Handle both string and array cases from router params
    const productId = Array.isArray(id) ? id[0] : id;
    if (!productId) return;

    setLoading(true);
    try {
      // Get existing product to preserve metadata
      const existingProduct = await ProductStorageService.getProductById(
        productId
      );

      if (!existingProduct) {
        Alert.alert("Error", "Produk tidak ditemukan");
        return;
      }

      // Convert form data to product and preserve existing metadata
      const updatedProduct = ProductStorageService.formDataToProduct(
        formData,
        existingProduct.umkmId,
        existingProduct
      );

      await ProductStorageService.saveProduct(updatedProduct);

      Alert.alert("Berhasil", "Produk berhasil diperbarui!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating product:", error);
      Alert.alert("Error", "Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat data produk...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onBack={handleBack}
      loading={loading}
      isEdit={true}
    />
  );
}

export default function ProtectedEditProductScreen() {
  return (
    <ProtectedRoute>
      <EditProductScreen />
    </ProtectedRoute>
  );
}
