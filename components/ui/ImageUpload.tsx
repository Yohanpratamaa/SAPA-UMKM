import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface ImageUploadProps {
  label?: string;
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  placeholder?: string;
  aspectRatio?: [number, number];
  quality?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  imageUri,
  onImageSelected,
  placeholder = "Pilih foto/logo",
  aspectRatio = [1, 1],
  quality = 0.7,
}) => {
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Aplikasi memerlukan izin untuk mengakses galeri foto.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert("Pilih Foto", "Pilih sumber foto", [
      { text: "Galeri", onPress: pickFromGallery },
      { text: "Kamera", onPress: pickFromCamera },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      Alert.alert("Error", "Gagal memilih foto dari galeri");
    } finally {
      setLoading(false);
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Aplikasi memerlukan izin untuk mengakses kamera.",
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking from camera:", error);
      Alert.alert("Error", "Gagal mengambil foto dari kamera");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">{label}</Text>
      )}

      <TouchableOpacity
        onPress={showImagePicker}
        disabled={loading}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-gray-50"
        style={{ height: 150 }}
      >
        {imageUri ? (
          <View className="w-full h-full relative">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
              <Ionicons name="pencil" size={16} color="white" />
            </View>
          </View>
        ) : (
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              {loading ? "Memilih foto..." : placeholder}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Tap untuk memilih foto
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
