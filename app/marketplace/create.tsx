import { router } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { ProductForm } from "../../components/ProductForm";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { ProductStorageService } from "../../services";
import { ProductFormData } from "../../types";

function CreateProductScreen() {
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (formData: ProductFormData) => {
    setLoading(true);
    try {
      // Untuk demo, kita gunakan UMKM ID dummy
      // Dalam implementasi nyata, ini harus diambil dari user yang sedang login
      const currentUMKMId = "dummy-umkm-id"; // TODO: Get from auth context

      const product = ProductStorageService.formDataToProduct(
        formData,
        currentUMKMId
      );
      await ProductStorageService.saveProduct(product);

      Alert.alert("Berhasil", "Produk berhasil ditambahkan!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error creating product:", error);
      Alert.alert("Error", "Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onBack={handleBack}
      loading={loading}
      isEdit={false}
    />
  );
}

export default function ProtectedCreateProductScreen() {
  return (
    <ProtectedRoute>
      <CreateProductScreen />
    </ProtectedRoute>
  );
}
