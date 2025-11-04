import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KATEGORI_PRODUK,
  KategoriProduk,
  ProductFormData,
  ProductValidationErrors,
  SATUAN_OPTIONS,
} from "../types";
import { BackButton, Button, Input, MultiImageUpload } from "./ui";

// Simple Select Component
interface SimpleSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Pilih opsi...",
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-2">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`border rounded-lg px-4 py-3 bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-lg max-h-96">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text
                    className={`text-gray-900 ${
                      value === item ? "font-semibold text-blue-600" : ""
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    nama: initialData.nama || "",
    deskripsi: initialData.deskripsi || "",
    harga: initialData.harga || "",
    kategori: initialData.kategori || "Lainnya",
    foto: initialData.foto || [],
    stok: initialData.stok || "",
    satuan: initialData.satuan || "pcs",
    tags: initialData.tags || "",
  });

  const [errors, setErrors] = useState<ProductValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || "",
        deskripsi: initialData.deskripsi || "",
        harga: initialData.harga || "",
        kategori: initialData.kategori || "Lainnya",
        foto: initialData.foto || [],
        stok: initialData.stok || "",
        satuan: initialData.satuan || "pcs",
        tags: initialData.tags || "",
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: ProductValidationErrors = {};

    // Nama produk
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama produk harus diisi";
    } else if (formData.nama.trim().length < 3) {
      newErrors.nama = "Nama produk minimal 3 karakter";
    }

    // Deskripsi
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi produk harus diisi";
    } else if (formData.deskripsi.trim().length < 10) {
      newErrors.deskripsi = "Deskripsi minimal 10 karakter";
    }

    // Harga
    if (!formData.harga.trim()) {
      newErrors.harga = "Harga harus diisi";
    } else {
      const harga = parseFloat(formData.harga);
      if (isNaN(harga) || harga <= 0) {
        newErrors.harga =
          "Harga harus berupa angka yang valid dan lebih dari 0";
      }
    }

    // Stok
    if (!formData.stok.trim()) {
      newErrors.stok = "Stok harus diisi";
    } else {
      const stok = parseInt(formData.stok);
      if (isNaN(stok) || stok < 0) {
        newErrors.stok =
          "Stok harus berupa angka yang valid dan tidak boleh negatif";
      }
    }

    // Satuan
    if (!formData.satuan.trim()) {
      newErrors.satuan = "Satuan harus dipilih";
    }

    // Foto (minimal 1)
    if (!formData.foto || formData.foto.length === 0) {
      newErrors.foto = "Minimal 1 foto produk harus ditambahkan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Mohon periksa data yang diinput");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting product form:", error);
      Alert.alert("Error", "Gagal menyimpan data produk");
    }
  };

  const handleImageAdd = (uri: string) => {
    setFormData((prev) => ({
      ...prev,
      foto: [...prev.foto, uri],
    }));
    // Clear foto error when image is added
    if (errors.foto) {
      setErrors((prev) => ({ ...prev, foto: undefined }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      foto: prev.foto.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center">
          {onBack && <BackButton onPress={onBack} className="mr-4" />}
          <Text className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-4">
          {/* Basic Information */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Dasar
            </Text>

            <Input
              label="Nama Produk"
              placeholder="Masukkan nama produk"
              value={formData.nama}
              onChangeText={(value) => handleInputChange("nama", value)}
              error={errors.nama}
              required
            />

            <SimpleSelect
              label="Kategori"
              placeholder="Pilih kategori produk"
              value={formData.kategori}
              onValueChange={(value) =>
                handleInputChange("kategori", value as KategoriProduk)
              }
              options={KATEGORI_PRODUK}
              error={errors.kategori}
              required
            />

            <Input
              label="Deskripsi Produk"
              placeholder="Deskripsikan produk Anda secara detail"
              value={formData.deskripsi}
              onChangeText={(value) => handleInputChange("deskripsi", value)}
              error={errors.deskripsi}
              multiline
              numberOfLines={4}
              required
            />

            <Input
              label="Tags (pisahkan dengan koma)"
              placeholder="contoh: murah, berkualitas, terlaris"
              value={formData.tags}
              onChangeText={(value) => handleInputChange("tags", value)}
            />
          </View>

          {/* Pricing and Stock */}
          <View className="bg-white rounded-lg p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Harga & Stok
            </Text>

            <Input
              label="Harga (Rp)"
              placeholder="0"
              value={formData.harga}
              onChangeText={(value) => handleInputChange("harga", value)}
              error={errors.harga}
              keyboardType="numeric"
              required
            />

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Input
                  label="Stok"
                  placeholder="0"
                  value={formData.stok}
                  onChangeText={(value) => handleInputChange("stok", value)}
                  error={errors.stok}
                  keyboardType="numeric"
                  required
                />
              </View>

              <View className="flex-1">
                <SimpleSelect
                  label="Satuan"
                  placeholder="Pilih satuan"
                  value={formData.satuan}
                  onValueChange={(value) => handleInputChange("satuan", value)}
                  options={SATUAN_OPTIONS}
                  error={errors.satuan}
                  required
                />
              </View>
            </View>
          </View>

          {/* Product Images */}
          <View className="bg-white rounded-lg p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Foto Produk
              </Text>
              <Text className="text-sm text-gray-500">
                {formData.foto.length}/5 foto
              </Text>
            </View>

            <MultiImageUpload
              images={formData.foto}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
              maxImages={5}
              error={errors.foto}
            />

            <Text className="text-xs text-gray-500 mt-2">
              • Minimal 1 foto, maksimal 5 foto{"\n"}• Format: JPG, PNG{"\n"}•
              Ukuran maksimal: 5MB per foto
            </Text>
          </View>

          {/* Preview Info */}
          {formData.nama && formData.harga && (
            <View className="bg-blue-50 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="eye-outline" size={20} color="#3B82F6" />
                <Text className="text-blue-700 font-medium ml-2">Preview</Text>
              </View>
              <Text className="text-gray-700">
                <Text className="font-semibold">{formData.nama}</Text>
                {formData.harga && (
                  <Text className="text-green-600">
                    {" "}
                    - Rp{" "}
                    {parseFloat(formData.harga || "0").toLocaleString("id-ID")}
                  </Text>
                )}
                {formData.stok && formData.satuan && (
                  <Text className="text-gray-600">
                    {" "}
                    (Stok: {formData.stok} {formData.satuan})
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="bg-white border-t border-gray-200 p-4">
        <Button
          title={isEdit ? "Update Produk" : "Simpan Produk"}
          onPress={handleSubmit}
          loading={loading}
          className="bg-blue-600"
        />
      </View>
    </SafeAreaView>
  );
};
