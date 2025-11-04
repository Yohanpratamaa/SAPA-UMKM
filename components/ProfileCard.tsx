import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { UMKMProfile } from "../types";

interface ProfileCardProps {
  profile: UMKMProfile;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onPress,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: UMKMProfile["status"]) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "non-aktif":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("ProfileCard - Card pressed for ID:", profile.id);
        onPress();
      }}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
    >
      <View className="flex-row">
        {/* Logo/Foto */}
        <View className="mr-4">
          {profile.fotoLogo ? (
            <Image
              source={{ uri: profile.fotoLogo }}
              className="w-16 h-16 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 bg-gray-200 rounded-lg items-center justify-center">
              <Ionicons name="business-outline" size={24} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Informasi Utama */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {profile.namaUsaha}
              </Text>
              <Text className="text-sm text-gray-600 mb-1">
                {profile.jenisUsaha}
              </Text>
            </View>

            {/* Status Badge */}
            <View
              className={`px-2 py-1 rounded-full ${getStatusColor(
                profile.status
              )}`}
            >
              <Text className="text-xs font-medium capitalize">
                {profile.status}
              </Text>
            </View>
          </View>

          {/* Lokasi */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {profile.kota}, {profile.provinsi}
            </Text>
          </View>

          {/* Kontak */}
          <View className="flex-row items-center mb-2">
            <Ionicons name="call-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {profile.nomorKontak}
            </Text>
          </View>

          {/* Tanggal Daftar */}
          <Text className="text-xs text-gray-500">
            Terdaftar: {formatDate(profile.tanggalDaftar)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="ml-2">
          {onEdit && (
            <TouchableOpacity
              onPress={() => {
                console.log(
                  "ProfileCard - Edit button pressed for ID:",
                  profile.id
                );
                onEdit();
              }}
              className="p-2 mb-1"
            >
              <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
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
              className="p-2"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Deskripsi (jika ada) */}
      {profile.deskripsiUsaha && (
        <Text className="text-sm text-gray-600 mt-3" numberOfLines={2}>
          {profile.deskripsiUsaha}
        </Text>
      )}
    </TouchableOpacity>
  );
};
