/**
 * Alternative Image Upload Service using expo-file-system
 * Use this if FormData approach doesn't work
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { API_CONFIG } from "./api/config";

// Import the upload type enum
const FileSystemUploadType = {
  BINARY_CONTENT: 0,
  MULTIPART: 1,
};

export class ImageUploadService {
  /**
   * Upload image using expo-file-system (alternative method)
   */
  static async uploadImageWithFileSystem(
    imageUri: string
  ): Promise<string | null> {
    try {
      console.log("📤 [FileSystem] Uploading image:", imageUri);

      // Get auth token
      const token = await AsyncStorage.getItem("SAPA_UMKM_TOKEN");
      if (!token) {
        console.error("❌ No auth token available");
        return null;
      }

      // Upload using FileSystem
      const uploadResult = await FileSystem.uploadAsync(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/upload-image`,
        imageUri,
        {
          httpMethod: "POST",
          uploadType: FileSystemUploadType.MULTIPART,
          fieldName: "file",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📬 [FileSystem] Upload response:", uploadResult);

      if (uploadResult.status === 200) {
        const response = JSON.parse(uploadResult.body);
        if (response.success && response.data?.url) {
          console.log("✅ [FileSystem] Image uploaded:", response.data.url);
          return response.data.url;
        }
      }

      console.error("❌ [FileSystem] Upload failed:", uploadResult.body);
      return null;
    } catch (error) {
      console.error("❌ [FileSystem] Error uploading:", error);
      return null;
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadMultipleImages(imageUris: string[]): Promise<string[]> {
    const uploadPromises = imageUris.map((uri) =>
      this.uploadImageWithFileSystem(uri)
    );
    const results = await Promise.all(uploadPromises);
    return results.filter((url): url is string => url !== null);
  }
}
