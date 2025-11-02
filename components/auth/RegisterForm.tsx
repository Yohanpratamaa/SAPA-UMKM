import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RegisterFormData, RegisterValidationErrors, User } from "../../types";
import { Button, Input, Select } from "../ui";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onSignIn?: () => void;
}

const roleOptions: User["role"][] = ["umkm", "pendamping"];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  onSignIn,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "umkm",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: RegisterValidationErrors = {};

    // Validasi email
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi username
    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    // Validasi nama lengkap
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    }

    // Validasi nomor telepon
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon harus diisi";
    } else if (
      !/^[\+]?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Format nomor telepon tidak valid";
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    // Validasi konfirmasi password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    // Validasi persetujuan
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert("Peringatan", "Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const updateField = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }));
    // Clear error ketika user mulai mengetik
    if (errors[field as keyof RegisterValidationErrors]) {
      setErrors((prev: RegisterValidationErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getRoleDisplayName = (role: User["role"]): string => {
    switch (role) {
      case "umkm":
        return "Pelaku UMKM";
      case "pendamping":
        return "Pendamping UMKM";
      default:
        return role;
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="w-full">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-blue-100 p-4 rounded-full mb-4">
            <Ionicons name="person-add" size={40} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Akun
          </Text>
          <Text className="text-gray-600 text-center">
            Buat akun SAPA UMKM untuk memulai
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Informasi Akun */}
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Informasi Akun
          </Text>

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value: string) => updateField("email", value)}
            placeholder="contoh@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />

          <Input
            label="Username"
            value={formData.username}
            onChangeText={(value: string) => updateField("username", value)}
            placeholder="username_anda"
            autoCapitalize="none"
            error={errors.username}
            required
          />

          <View className="relative">
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value: string) => updateField("password", value)}
              placeholder="Minimal 6 karakter"
              secureTextEntry={!showPassword}
              error={errors.password}
              required
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10"
              style={{ marginTop: 2 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <View className="relative">
            <Input
              label="Konfirmasi Password"
              value={formData.confirmPassword}
              onChangeText={(value: string) =>
                updateField("confirmPassword", value)
              }
              placeholder="Ulangi password"
              secureTextEntry={!showConfirmPassword}
              error={errors.confirmPassword}
              required
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-10"
              style={{ marginTop: 2 }}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Informasi Personal */}
          <Text className="text-lg font-semibold text-gray-800 mb-2 mt-6">
            Informasi Personal
          </Text>

          <Input
            label="Nama Lengkap"
            value={formData.fullName}
            onChangeText={(value: string) => updateField("fullName", value)}
            placeholder="Nama lengkap Anda"
            error={errors.fullName}
            required
          />

          <Input
            label="Nomor Telepon"
            value={formData.phoneNumber}
            onChangeText={(value: string) => updateField("phoneNumber", value)}
            placeholder="+62 812 3456 7890"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            required
          />

          <Select
            label="Role"
            value={getRoleDisplayName(formData.role)}
            onValueChange={(value: string) => {
              const role = roleOptions.find(
                (r) => getRoleDisplayName(r) === value
              );
              if (role) updateField("role", role);
            }}
            options={roleOptions.map(getRoleDisplayName)}
            placeholder="Pilih role Anda"
            error={errors.role}
            required
          />

          {/* Terms & Conditions */}
          <View className="mt-6">
            <TouchableOpacity
              onPress={() =>
                updateField("agreeToTerms", !formData.agreeToTerms)
              }
              className="flex-row items-start"
            >
              <View
                className={`w-5 h-5 border-2 rounded mr-3 mt-1 items-center justify-center ${
                  formData.agreeToTerms
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}
              >
                {formData.agreeToTerms && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-sm leading-5">
                  Saya menyetujui{" "}
                  <Text className="text-blue-600 underline">
                    Syarat dan Ketentuan
                  </Text>{" "}
                  serta{" "}
                  <Text className="text-blue-600 underline">
                    Kebijakan Privasi
                  </Text>{" "}
                  SAPA UMKM
                </Text>
              </View>
            </TouchableOpacity>
            {errors.agreeToTerms && (
              <Text className="text-red-500 text-xs mt-1 ml-8">
                {errors.agreeToTerms}
              </Text>
            )}
          </View>

          {/* Error Message */}
          {errors.general && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-sm text-center">
                {errors.general}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <Button
            title="Daftar Akun"
            onPress={handleSubmit}
            loading={loading}
            className="mt-6"
          />

          {/* Sign In Link */}
          {onSignIn && (
            <View className="flex-row items-center justify-center mt-6 mb-8">
              <Text className="text-gray-600">Sudah punya akun? </Text>
              <TouchableOpacity onPress={onSignIn}>
                <Text className="text-blue-600 font-semibold">
                  Masuk sekarang
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
