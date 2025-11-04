import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "../../components/ProductCard";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { ProductStorageService, ProfileStorageService } from "../../services";
import {
  KATEGORI_PRODUK,
  Product,
  ProductFilter,
  UMKMProfile,
} from "../../types";

function MarketplaceScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<{ [key: string]: UMKMProfile }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<ProductFilter>({});

  const loadData = async () => {
    try {
      setLoading(true);

      // Load products
      const allProducts = await ProductStorageService.getAllProducts();
      const activeProducts = allProducts.filter((p) => p.isAktif);
      setProducts(activeProducts);

      // Load UMKM profiles
      const allProfiles = await ProfileStorageService.getAllProfiles();
      const profilesMap: { [key: string]: UMKMProfile } = {};
      allProfiles.forEach((profile) => {
        profilesMap[profile.id] = profile;
      });
      setProfiles(profilesMap);

      console.log("Marketplace - Loaded", activeProducts.length, "products");
    } catch (error) {
      console.error("Error loading marketplace data:", error);
      Alert.alert("Error", "Gagal memuat data marketplace");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    // Apply search and filter
    let filtered = products;

    // Text search
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.nama.toLowerCase().includes(lowercaseQuery) ||
          product.deskripsi.toLowerCase().includes(lowercaseQuery) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(lowercaseQuery)
          ) ||
          product.kategori.toLowerCase().includes(lowercaseQuery) ||
          profiles[product.umkmId]?.namaUsaha
            .toLowerCase()
            .includes(lowercaseQuery)
      );
    }

    // Apply filters
    if (filter.kategori) {
      filtered = filtered.filter((p) => p.kategori === filter.kategori);
    }

    if (filter.hargaMin !== undefined) {
      filtered = filtered.filter((p) => p.harga >= filter.hargaMin!);
    }

    if (filter.hargaMax !== undefined) {
      filtered = filtered.filter((p) => p.harga <= filter.hargaMax!);
    }

    if (filter.stokTersedia) {
      filtered = filtered.filter((p) => p.stok > 0);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, filter, profiles]);

  const handleDeleteProduct = async (product: Product) => {
    console.log(
      "Marketplace - Delete requested for product:",
      product.id,
      product.nama
    );
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
              console.log("Marketplace - Deleting product:", product.id);
              await ProductStorageService.deleteProduct(product.id);
              console.log("Marketplace - Product deleted successfully");
              await loadData();
              Alert.alert("Berhasil", "Produk berhasil dihapus");
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Gagal menghapus produk");
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      umkmName={profiles[item.umkmId]?.namaUsaha}
      showUMKMName={true}
      onPress={() => {
        console.log(
          "Marketplace - Navigating to product detail with ID:",
          item.id
        );
        try {
          router.push({
            pathname: "/marketplace/[id]" as any,
            params: { id: item.id },
          });
          console.log("Marketplace - Navigation called for detail");
        } catch (error) {
          console.error("Marketplace - Navigation error for detail:", error);
        }
      }}
      onEdit={() => {
        console.log(
          "Marketplace - Navigating to product edit with ID:",
          item.id
        );
        try {
          router.push({
            pathname: "/marketplace/[id]/edit" as any,
            params: { id: item.id },
          });
          console.log("Marketplace - Navigation called for edit");
        } catch (error) {
          console.error("Marketplace - Navigation error for edit:", error);
        }
      }}
      onDelete={() => handleDeleteProduct(item)}
    />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-16">
      <Ionicons name="storefront-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4 mb-2">
        {searchQuery || Object.keys(filter).length > 0
          ? "Tidak ada produk yang ditemukan"
          : "Belum ada produk"}
      </Text>
      <Text className="text-gray-400 text-center px-8 mb-6">
        {searchQuery || Object.keys(filter).length > 0
          ? "Coba ubah kata kunci atau filter pencarian"
          : "Mulai tambahkan produk pertama Anda"}
      </Text>
      {!searchQuery && Object.keys(filter).length === 0 && (
        <TouchableOpacity
          onPress={() => router.push("/marketplace/create")}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Tambah Produk</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const clearFilter = () => {
    setFilter({});
    setShowFilter(false);
  };

  const applyFilter = (newFilter: ProductFilter) => {
    setFilter(newFilter);
    setShowFilter(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Memuat marketplace...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Marketplace Digital
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/marketplace/create")}
            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center space-x-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Cari produk, UMKM, kategori..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            className={`p-3 rounded-lg ${
              Object.keys(filter).length > 0 ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name="funnel-outline"
              size={20}
              color={Object.keys(filter).length > 0 ? "white" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      {products.length > 0 && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {filteredProducts.length}
              </Text>
              <Text className="text-sm text-gray-600">Produk</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {new Set(products.map((p) => p.umkmId)).size}
              </Text>
              <Text className="text-sm text-gray-600">UMKM</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {new Set(products.map((p) => p.kategori)).size}
              </Text>
              <Text className="text-sm text-gray-600">Kategori</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {products.filter((p) => p.stok > 0).length}
              </Text>
              <Text className="text-sm text-gray-600">Tersedia</Text>
            </View>
          </View>
        </View>
      )}

      {/* Active Filters */}
      {Object.keys(filter).length > 0 && (
        <View className="bg-blue-50 px-4 py-2 border-b border-blue-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-blue-700 text-sm">
              Filter aktif: {Object.keys(filter).length}
            </Text>
            <TouchableOpacity onPress={clearFilter}>
              <Text className="text-blue-600 text-sm font-medium">
                Hapus Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={applyFilter}
        currentFilter={filter}
      />
    </SafeAreaView>
  );
}

// Filter Modal Component
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: ProductFilter) => void;
  currentFilter: ProductFilter;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
}) => {
  const [tempFilter, setTempFilter] = useState<ProductFilter>(currentFilter);

  useEffect(() => {
    setTempFilter(currentFilter);
  }, [currentFilter]);

  const handleApply = () => {
    onApply(tempFilter);
  };

  const handleClear = () => {
    setTempFilter({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black bg-opacity-50 justify-end">
        <View className="bg-white rounded-t-lg max-h-3/4">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Filter Produk</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <View className="p-4">
            {/* Kategori */}
            <Text className="text-gray-700 font-medium mb-2">Kategori</Text>
            <View className="flex-row flex-wrap mb-4">
              {KATEGORI_PRODUK.map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  onPress={() =>
                    setTempFilter((prev) => ({
                      ...prev,
                      kategori:
                        prev.kategori === kategori ? undefined : kategori,
                    }))
                  }
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
                    tempFilter.kategori === kategori
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={
                      tempFilter.kategori === kategori
                        ? "text-white text-sm"
                        : "text-gray-700 text-sm"
                    }
                  >
                    {kategori}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Hanya Stok Tersedia */}
            <TouchableOpacity
              onPress={() =>
                setTempFilter((prev) => ({
                  ...prev,
                  stokTersedia: !prev.stokTersedia,
                }))
              }
              className="flex-row items-center mb-4"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  tempFilter.stokTersedia
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {tempFilter.stokTersedia && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-700">Hanya yang stok tersedia</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex-row p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleClear}
              className="flex-1 mr-2 py-3 border border-gray-300 rounded-lg items-center"
            >
              <Text className="text-gray-700 font-medium">Hapus Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 ml-2 py-3 bg-blue-600 rounded-lg items-center"
            >
              <Text className="text-white font-medium">Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function ProtectedMarketplaceScreen() {
  return (
    <ProtectedRoute>
      <MarketplaceScreen />
    </ProtectedRoute>
  );
}
