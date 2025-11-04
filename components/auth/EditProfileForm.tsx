import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types";
import { Button, ImageUpload, Input, Select } from "../ui";

interface EditProfileFormProps {
  onClose: () => void;
  onProfileUpdated: () => void;
}

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  role: User["role"];
  profileImage?: string;
}

interface ProfileValidationErrors {
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  general?: string;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onClose,
  onProfileUpdated,
}) => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "umkm",
    profileImage: user?.profileImage || "",
  });
  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = ["umkm", "admin", "pendamping"];

  const validateForm = (): ProfileValidationErrors => {
    const newErrors: ProfileValidationErrors = {};

    // Validasi nama lengkap
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Nama lengkap minimal 2 karakter";
    }

    // Validasi nomor telepon
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon harus diisi";
    } else if (
      !/^[\+]?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Format nomor telepon tidak valid";
    }

    // Validasi role
    if (!formData.role) {
      newErrors.role = "Role harus dipilih";
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error untuk field yang sedang diubah
    if (
      field !== "profileImage" &&
      errors[field as keyof ProfileValidationErrors]
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleImageChange = (imageUri: string) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: imageUri,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validasi form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (!user) {
        Alert.alert("Error", "User tidak ditemukan");
        return;
      }

      // Update profil user melalui AuthService
      const { AuthService } = await import("../../services/AuthService");

      const updatedUser: User = {
        ...user,
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        role: formData.role,
        profileImage: formData.profileImage,
      };

      // Simpan user yang diupdate
      await AuthService.saveUser(updatedUser);
      await AuthService.saveCurrentUser(updatedUser);

      // Refresh user data di context
      await refreshUser();

      Alert.alert("Berhasil", "Profil berhasil diperbarui", [
        {
          text: "OK",
          onPress: () => {
            onProfileUpdated();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({
        general: "Terjadi kesalahan saat memperbarui profil",
      });
      Alert.alert("Error", "Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Edit Profil</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Profile Image Section */}
        <View className="items-center py-6">
          <Text className="text-base font-medium text-gray-800 mb-4">
            Foto Profil
          </Text>
          <ImageUpload
            label="Foto Profil"
            imageUri={formData.profileImage}
            onImageSelected={handleImageChange}
            placeholder="Pilih foto profil"
          />
          <Text className="text-sm text-gray-600 mt-2 text-center">
            Ukuran maksimal 5MB{"\n"}Format: JPG, PNG
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          {/* Email (Read-only) */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <View className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              Email tidak dapat diubah
            </Text>
          </View>

          {/* Username (Read-only) */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Username
            </Text>
            <View className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
              <Text className="text-gray-600">{user?.username}</Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              Username tidak dapat diubah
            </Text>
          </View>

          {/* Nama Lengkap */}
          <Input
            label="Nama Lengkap"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
            placeholder="Masukkan nama lengkap"
            error={errors.fullName}
            required
          />

          {/* Nomor Telepon */}
          <Input
            label="Nomor Telepon"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            placeholder="Contoh: +628123456789"
            error={errors.phoneNumber}
            required
            keyboardType="phone-pad"
          />

          {/* Role */}
          <Select
            label="Role"
            value={formData.role}
            onValueChange={(value) => handleInputChange("role", value)}
            options={roleOptions}
            error={errors.role}
            required
          />

          {/* Info Akun */}
          <View className="bg-blue-50 rounded-lg p-4 mt-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-800 font-medium ml-2">
                Informasi Akun
              </Text>
            </View>
            <View className="space-y-1">
              <Text className="text-blue-700 text-sm">
                • ID Akun: {user?.id}
              </Text>
              <Text className="text-blue-700 text-sm">
                • Bergabung:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID")
                  : "-"}
              </Text>
              <Text className="text-blue-700 text-sm">
                • Login Terakhir:{" "}
                {user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleDateString("id-ID")
                  : "-"}
              </Text>
              <Text className="text-blue-700 text-sm">
                • Status Email:{" "}
                {user?.isEmailVerified
                  ? "Terverifikasi"
                  : "Belum Terverifikasi"}
              </Text>
            </View>
          </View>

          {/* Error Message */}
          {errors.general && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text className="text-red-700 text-sm ml-2">
                  {errors.general}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View className="py-6">
          <Button
            title={isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            onPress={handleSubmit}
            disabled={isLoading}
            variant="primary"
          />
        </View>

        {/* Cancel Button */}
        <View className="pb-6">
          <Button title="Batal" onPress={onClose} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
