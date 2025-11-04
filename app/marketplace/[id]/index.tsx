import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { BackButton } from "../../../components/ui";
import {
  ProductStorageService,
  ProfileStorageService,
} from "../../../services";
import { Product, UMKMProfile } from "../../../types";

const { width } = Dimensions.get("window");

function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [umkmProfile, setUmkmProfile] = useState<UMKMProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadProduct = useCallback(async () => {
    // Handle both string and array cases from router params
    const productId = Array.isArray(id) ? id[0] : id;
    console.log("Product Detail - Raw ID from params:", id);
    console.log("Product Detail - Processed ID:", productId);

    if (!productId || productId === undefined || productId === null) {
      console.log("Product Detail - No ID found");
      Alert.alert("Error", "ID produk tidak ditemukan");
      router.back();
      return;
    }

    try {
      setLoading(true);
      console.log("Product Detail - Loading product with ID:", productId);

      // Load product
      const productData = await ProductStorageService.getProductById(productId);
      console.log("Product Detail - Product loaded:", productData);

      if (!productData) {
        console.log("Product Detail - Product not found");
        Alert.alert("Error", "Produk tidak ditemukan");
        router.back();
        return;
      }

      setProduct(productData);

      // Load UMKM profile
      const umkmData = await ProfileStorageService.getProfileById(
        productData.umkmId
      );
      console.log("Product Detail - UMKM profile loaded:", umkmData);
      setUmkmProfile(umkmData);
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Gagal memuat data produk");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    const productId = Array.isArray(id) ? id[0] : id;
    console.log("Product Detail - Edit button pressed for ID:", productId);
    try {
      router.push({
        pathname: "/marketplace/[id]/edit",
        params: { id: productId },
      });
      console.log("Product Detail - Navigation called for edit");
    } catch (error) {
      console.error("Product Detail - Navigation error for edit:", error);
    }
  };

  const handleDelete = () => {
    if (!product) return;

    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus produk "${product.nama}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await ProductStorageService.deleteProduct(product.id);
              Alert.alert("Berhasil", "Produk berhasil dihapus", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Gagal menghapus produk");
            }
          },
        },
      ]
    );
  };

  const handleContact = () => {
    if (!umkmProfile) return;

    Alert.alert(
      "Hubungi UMKM",
      `Pilih cara untuk menghubungi ${umkmProfile.namaUsaha}:`,
      [
        {
          text: "WhatsApp",
          onPress: () => {
            const message = `Halo, saya tertarik dengan produk "${product?.nama}" dari ${umkmProfile.namaUsaha}`;
            const whatsappUrl = `whatsapp://send?phone=${
              umkmProfile.nomorKontak
            }&text=${encodeURIComponent(message)}`;
            Linking.openURL(whatsappUrl).catch(() => {
              Alert.alert("Error", "WhatsApp tidak ditemukan di perangkat ini");
            });
          },
        },
        {
          text: "Telepon",
          onPress: () => {
            Linking.openURL(`tel:${umkmProfile.nomorKontak}`);
          },
        },
        ...(umkmProfile.email
          ? [
              {
                text: "Email",
                onPress: () => {
                  const subject = `Inquiry tentang ${product?.nama}`;
                  const body = `Halo ${umkmProfile.namaUsaha},\n\nSaya tertarik dengan produk "${product?.nama}" dan ingin mendapatkan informasi lebih lanjut.\n\nTerima kasih.`;
                  Linking.openURL(
                    `mailto:${umkmProfile.email}?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(body)}`
                  );
                },
              },
            ]
          : []),
        { text: "Batal", style: "cancel" },
      ]
    );
  };

  const handleUMKMProfile = () => {
    if (umkmProfile) {
      router.push(`/profile/${umkmProfile.id}`);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStockStatusColor = (stok: number) => {
    if (stok === 0) return "bg-red-100 text-red-800";
    if (stok <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockStatusText = (stok: number) => {
    if (stok === 0) return "Stok Habis";
    if (stok <= 5) return "Stok Terbatas";
    return "Stok Tersedia";
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Memuat detail produk...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Produk tidak ditemukan</Text>
        <BackButton onPress={handleBack} className="mt-4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 pt-2 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <BackButton onPress={handleBack} className="mr-4" />
            <Text className="text-lg font-semibold text-gray-900">
              Detail Produk
            </Text>
          </View>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-blue-600 px-3 py-2 rounded-lg"
            >
              <Ionicons name="pencil-outline" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-600 px-3 py-2 rounded-lg"
            >
              <Ionicons name="trash-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Product Images */}
        {product.foto && product.foto.length > 0 && (
          <View className="bg-white">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setCurrentImageIndex(index);
              }}
            >
              {product.foto.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={{ width, height: width }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image Indicator */}
            {product.foto.length > 1 && (
              <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                {product.foto.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <View className="p-4">
          {/* Product Info */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            {/* Category and Stock Status */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800 text-sm font-medium">
                  {product.kategori}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${getStockStatusColor(
                  product.stok
                )}`}
              >
                <Text className="text-sm font-medium">
                  {getStockStatusText(product.stok)}
                </Text>
              </View>
            </View>

            {/* Product Name */}
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {product.nama}
            </Text>

            {/* Price */}
            <Text className="text-3xl font-bold text-green-600 mb-4">
              {ProductStorageService.formatPrice(product.harga)}
            </Text>

            {/* Stock and Unit */}
            <View className="flex-row items-center mb-4">
              <Ionicons name="cube-outline" size={20} color="#6B7280" />
              <Text className="text-gray-600 ml-2 text-lg">
                {product.stok} {product.satuan} tersedia
              </Text>
            </View>

            {/* Description */}
            <Text className="text-gray-700 text-base leading-6">
              {product.deskripsi}
            </Text>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <View className="mt-4">
                <Text className="text-gray-900 font-medium mb-2">Tags:</Text>
                <View className="flex-row flex-wrap">
                  {product.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-gray-700 text-sm">#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* UMKM Info */}
          {umkmProfile && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Penjual
              </Text>

              <TouchableOpacity
                onPress={handleUMKMProfile}
                className="flex-row items-center mb-3"
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="business" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {umkmProfile.namaUsaha}
                  </Text>
                  <Text className="text-gray-600">
                    {umkmProfile.jenisUsaha}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>

              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2">
                  {umkmProfile.kota}, {umkmProfile.provinsi}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2">
                  {umkmProfile.nomorKontak}
                </Text>
              </View>
            </View>
          )}

          {/* Product Metadata */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Informasi Produk
            </Text>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tanggal Ditambahkan:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(product.tanggalDibuat)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Terakhir Diperbarui:</Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(product.tanggalDiperbarui)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Status:</Text>
                <Text
                  className={`font-medium ${
                    product.isAktif ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.isAktif ? "Aktif" : "Non-Aktif"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Contact Button */}
      {umkmProfile && product.stok > 0 && (
        <View className="bg-white border-t border-gray-200 p-4">
          <TouchableOpacity
            onPress={handleContact}
            className="bg-green-600 py-4 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="chatbubble-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2 text-lg">
              Hubungi Penjual
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function ProtectedProductDetailScreen() {
  return (
    <ProtectedRoute>
      <ProductDetailScreen />
    </ProtectedRoute>
  );
}
