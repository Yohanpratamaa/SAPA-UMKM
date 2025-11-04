import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MultiImageUploadProps {
  images: string[];
  onImageAdd: (uri: string) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
  error?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  onImageAdd,
  onImageRemove,
  maxImages = 5,
  error,
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
    if (images.length >= maxImages) {
      Alert.alert("Limit Tercapai", `Maksimal ${maxImages} foto`);
      return;
    }

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
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onImageAdd(result.assets[0].uri);
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
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        onImageAdd(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking from camera:", error);
      Alert.alert("Error", "Gagal mengambil foto dari kamera");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert("Hapus Foto", "Yakin ingin menghapus foto ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => onImageRemove(index),
      },
    ]);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {/* Existing Images */}
        {images.map((uri, index) => (
          <View key={index} className="mr-3 relative">
            <Image
              source={{ uri }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Photo Button */}
        {images.length < maxImages && (
          <TouchableOpacity
            onPress={showImagePicker}
            disabled={loading}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50"
          >
            {loading ? (
              <Text className="text-xs text-gray-500">Loading...</Text>
            ) : (
              <>
                <Ionicons name="add" size={24} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 mt-1">Tambah</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {error && <Text className="text-red-500 text-xs mt-2">{error}</Text>}
    </View>
  );
};
