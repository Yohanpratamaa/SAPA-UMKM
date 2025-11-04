import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { UMKMProfile } from "../types";

interface ProfileCardProps {
  profile: UMKMProfile;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  index?: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onPress,
  onEdit,
  onDelete,
  index = 0,
}) => {
  const getStatusColor = (status: UMKMProfile["status"]) => {
    switch (status) {
      case "aktif":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          dot: "#10B981",
        };
      case "non-aktif":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          dot: "#EF4444",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          dot: "#F59E0B",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "#6B7280",
        };
    }
  };

  const getJenisUsahaIcon = (jenisUsaha: string) => {
    switch (jenisUsaha.toLowerCase()) {
      case "kuliner":
        return "restaurant-outline";
      case "fashion":
        return "shirt-outline";
      case "kerajinan":
        return "hammer-outline";
      case "teknologi":
        return "desktop-outline";
      case "pertanian":
        return "leaf-outline";
      case "jasa":
        return "build-outline";
      case "perdagangan":
        return "storefront-outline";
      default:
        return "business-outline";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const statusConfig = getStatusColor(profile.status);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(600)}
      className="mb-4"
    >
      <TouchableOpacity
        onPress={() => {
          console.log("ProfileCard - Card pressed for ID:", profile.id);
          onPress();
        }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {/* Header with gradient background */}
        <View
          className="rounded-t-2xl p-4 bg-blue-600"
          style={{
            backgroundColor: "#3B82F6",
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className="text-white text-lg font-bold mb-1"
                numberOfLines={1}
              >
                {profile.namaUsaha}
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name={getJenisUsahaIcon(profile.jenisUsaha) as any}
                  size={14}
                  color="rgba(255,255,255,0.8)"
                />
                <Text className="text-blue-100 text-sm ml-1">
                  {profile.jenisUsaha}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View
              className={`${statusConfig.bg} ${statusConfig.border} border px-3 py-1 rounded-full flex-row items-center`}
            >
              <View
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: statusConfig.dot }}
              />
              <Text
                className={`${statusConfig.text} text-xs font-medium capitalize`}
              >
                {profile.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="p-4">
          <View className="flex-row">
            {/* Logo/Foto */}
            <View className="mr-4">
              {profile.fotoLogo ? (
                <Image
                  source={{ uri: profile.fotoLogo }}
                  className="w-20 h-20 rounded-xl"
                  style={{
                    borderWidth: 2,
                    borderColor: "#F3F4F6",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="w-20 h-20 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderWidth: 2,
                    borderColor: "#F3F4F6",
                  }}
                >
                  <Ionicons name="business-outline" size={28} color="#6B7280" />
                </View>
              )}
            </View>

            {/* Informasi Utama */}
            <View className="flex-1">
              {/* NIB */}
              <View className="bg-blue-50 rounded-lg p-2 mb-3">
                <Text className="text-blue-600 text-xs font-medium mb-1">
                  NIB
                </Text>
                <Text className="text-blue-800 text-sm font-semibold">
                  {profile.nib}
                </Text>
              </View>

              {/* Lokasi */}
              <View className="flex-row items-center mb-2">
                <View className="bg-green-100 p-1 rounded-full mr-2">
                  <Ionicons name="location" size={12} color="#10B981" />
                </View>
                <Text
                  className="text-gray-600 text-sm flex-1"
                  numberOfLines={1}
                >
                  {profile.kota}, {profile.provinsi}
                </Text>
              </View>

              {/* Kontak */}
              <View className="flex-row items-center mb-2">
                <View className="bg-blue-100 p-1 rounded-full mr-2">
                  <Ionicons name="call" size={12} color="#3B82F6" />
                </View>
                <Text
                  className="text-gray-600 text-sm flex-1"
                  numberOfLines={1}
                >
                  {profile.nomorKontak}
                </Text>
              </View>

              {/* Email (jika ada) */}
              {profile.email && (
                <View className="flex-row items-center mb-2">
                  <View className="bg-purple-100 p-1 rounded-full mr-2">
                    <Ionicons name="mail" size={12} color="#7C3AED" />
                  </View>
                  <Text
                    className="text-gray-600 text-sm flex-1"
                    numberOfLines={1}
                  >
                    {profile.email}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="ml-2 justify-between">
              {onEdit && (
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      "ProfileCard - Edit button pressed for ID:",
                      profile.id
                    );
                    onEdit();
                  }}
                  className="bg-blue-50 p-2 rounded-full mb-2"
                  style={{
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="pencil" size={16} color="#3B82F6" />
                </TouchableOpacity>
              )}

              {onDelete && (
                <TouchableOpacity
                  onPress={() => {
                    console.log(
                      "ProfileCard - Delete button pressed for ID:",
                      profile.id
                    );
                    onDelete();
                  }}
                  className="bg-red-50 p-2 rounded-full"
                  style={{
                    shadowColor: "#EF4444",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Deskripsi (jika ada) */}
          {profile.deskripsiUsaha && (
            <View className="mt-4 bg-gray-50 rounded-lg p-3">
              <Text className="text-gray-700 text-sm" numberOfLines={2}>
                {profile.deskripsiUsaha}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <Text className="text-gray-500 text-xs">
              Terdaftar: {formatDate(profile.tanggalDaftar)}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
