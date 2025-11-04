import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ProductStorageService } from "../services";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showUMKMName?: boolean;
  umkmName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
  showUMKMName = false,
  umkmName,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStockStatusColor = (stok: number) => {
    if (stok === 0) return "bg-red-100 text-red-800";
    if (stok <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStockStatusText = (stok: number) => {
    if (stok === 0) return "Habis";
    if (stok <= 5) return "Terbatas";
    return "Tersedia";
  };

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("ProductCard - Card pressed for ID:", product.id);
        onPress();
      }}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Product Image */}
        <View className="mr-4">
          {product.foto && product.foto.length > 0 ? (
            <Image
              source={{ uri: product.foto[0] }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
              <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
              <Text
                className="text-lg font-semibold text-gray-900 mb-1"
                numberOfLines={2}
              >
                {product.nama}
              </Text>

              {showUMKMName && umkmName && (
                <Text className="text-sm text-blue-600 mb-1">{umkmName}</Text>
              )}

              <Text className="text-xl font-bold text-green-600 mb-1">
                {ProductStorageService.formatPrice(product.harga)}
              </Text>
            </View>

            {/* Status and Actions */}
            <View className="items-end">
              {/* Stock Status */}
              <View
                className={`px-2 py-1 rounded-full mb-2 ${getStockStatusColor(
                  product.stok
                )}`}
              >
                <Text className="text-xs font-medium">
                  {getStockStatusText(product.stok)}
                </Text>
              </View>

              {/* Action Buttons */}
              {showActions && (
                <View className="flex-row">
                  {onEdit && (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(
                          "ProductCard - Edit button pressed for ID:",
                          product.id
                        );
                        onEdit();
                      }}
                      className="p-2 mr-1"
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={18}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                  )}

                  {onDelete && (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(
                          "ProductCard - Delete button pressed for ID:",
                          product.id
                        );
                        onDelete();
                      }}
                      className="p-2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Category and Stock Info */}
          <View className="flex-row items-center mb-2">
            <View className="flex-row items-center mr-4">
              <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {product.kategori}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="cube-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">
                {product.stok} {product.satuan}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {product.deskripsi}
          </Text>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-2">
              {product.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  className="bg-blue-50 px-2 py-1 rounded-full mr-1 mb-1"
                >
                  <Text className="text-xs text-blue-700">#{tag}</Text>
                </View>
              ))}
              {product.tags.length > 3 && (
                <View className="bg-gray-50 px-2 py-1 rounded-full">
                  <Text className="text-xs text-gray-600">
                    +{product.tags.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Date Added */}
          <Text className="text-xs text-gray-500">
            Ditambahkan: {formatDate(product.tanggalDibuat)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
