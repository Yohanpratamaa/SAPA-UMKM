import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { TrainingStorageService } from "../services";
import { Training } from "../types";

interface TrainingCardProps {
  training: Training;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showProgress?: boolean;
  progress?: number;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
  showProgress = false,
  progress = 0,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Pemula":
        return "bg-green-100 text-green-800";
      case "Menengah":
        return "bg-blue-100 text-blue-800";
      case "Lanjutan":
        return "bg-orange-100 text-orange-800";
      case "Ahli":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#FFC107" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFC107" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={14}
          color="#FFC107"
        />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View className="relative">
        {training.thumbnail ? (
          <Image
            source={{ uri: training.thumbnail }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-gray-200 items-center justify-center">
            <Ionicons name="school-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2">No Image</Text>
          </View>
        )}

        {/* Duration Badge */}
        <View className="absolute top-3 right-3 bg-black bg-opacity-60 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {TrainingStorageService.formatDuration(training.durasi)}
          </Text>
        </View>

        {/* Price Badge */}
        <View
          className={`absolute top-3 left-3 px-2 py-1 rounded-full ${
            training.harga === 0 ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          <Text className="text-white text-xs font-bold">
            {TrainingStorageService.formatPrice(training.harga)}
          </Text>
        </View>

        {/* Certificate Badge */}
        {training.sertifikatTersedia && (
          <View className="absolute bottom-3 right-3 bg-yellow-500 px-2 py-1 rounded-full flex-row items-center">
            <Ionicons name="ribbon-outline" size={12} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              Sertifikat
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Header with badges */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center space-x-2">
            <View
              className={`px-2 py-1 rounded-full ${getLevelColor(
                training.level
              )}`}
            >
              <Text className="text-xs font-medium">{training.level}</Text>
            </View>
            <View
              className={`px-2 py-1 rounded-full ${getTypeColor(
                training.tipeTraining
              )}`}
            >
              <Text className="text-xs font-medium">
                {training.tipeTraining}
              </Text>
            </View>
          </View>

          {/* Actions */}
          {showActions && (onEdit || onDelete) && (
            <View className="flex-row items-center space-x-1">
              {onEdit && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="bg-blue-100 p-2 rounded-full"
                >
                  <Ionicons name="pencil-outline" size={14} color="#3B82F6" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="bg-red-100 p-2 rounded-full"
                >
                  <Ionicons name="trash-outline" size={14} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={2}
        >
          {training.judul}
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
          {training.deskripsi}
        </Text>

        {/* Instructor and Category */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1" numberOfLines={1}>
              {training.instruktur}
            </Text>
          </View>
          <Text className="text-blue-600 text-xs font-medium">
            {training.kategori}
          </Text>
        </View>

        {/* Rating and Participants */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-2">
              {renderStars(training.rating)}
            </View>
            <Text className="text-gray-600 text-sm">
              ({training.rating.toFixed(1)})
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {training.totalPeserta} peserta
            </Text>
          </View>
        </View>

        {/* Progress Bar (if showProgress) */}
        {showProgress && (
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-gray-600 text-sm">Progress</Text>
              <Text className="text-blue-600 text-sm font-medium">
                {Math.round(progress)}%
              </Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        )}

        {/* Tags */}
        {training.tags && training.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {training.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1"
              >
                <Text className="text-gray-600 text-xs">{tag}</Text>
              </View>
            ))}
            {training.tags.length > 3 && (
              <View className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-gray-600 text-xs">
                  +{training.tags.length - 3}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Modules Count */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
          <Ionicons name="play-circle-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm ml-2">
            {training.modules.length} modul pembelajaran
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
