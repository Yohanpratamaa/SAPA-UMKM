import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { LoginFormData, LoginValidationErrors } from "../../types";
import { Button, Input } from "../ui";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading?: boolean;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  onForgotPassword,
  onSignUp,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginValidationErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email atau username harus diisi";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
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

  const updateField = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev: LoginFormData) => ({ ...prev, [field]: value }));
    // Clear error ketika user mulai mengetik
    if (errors[field as keyof LoginValidationErrors]) {
      setErrors((prev: LoginValidationErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <View className="w-full">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="bg-blue-100 p-4 rounded-full mb-4">
          <Ionicons name="business" size={40} color="#3B82F6" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Selamat Datang
        </Text>
        <Text className="text-gray-600 text-center">
          Masuk ke akun SAPA UMKM Anda
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-4">
        <Input
          label="Email atau Username"
          value={formData.emailOrUsername}
          onChangeText={(value: string) =>
            updateField("emailOrUsername", value)
          }
          placeholder="Masukkan email atau username"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.emailOrUsername}
          required
        />

        <View className="relative">
          <Input
            label="Password"
            value={formData.password}
            onChangeText={(value: string) => updateField("password", value)}
            placeholder="Masukkan password"
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

        {/* Remember Me & Forgot Password */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => updateField("rememberMe", !formData.rememberMe)}
            className="flex-row items-center"
          >
            <View
              className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${
                formData.rememberMe
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {formData.rememberMe && (
                <Ionicons name="checkmark" size={12} color="white" />
              )}
            </View>
            <Text className="text-gray-700 text-sm">Ingat saya</Text>
          </TouchableOpacity>

          {onForgotPassword && (
            <TouchableOpacity onPress={onForgotPassword}>
              <Text className="text-blue-600 text-sm font-medium">
                Lupa password?
              </Text>
            </TouchableOpacity>
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

        {/* Login Button */}
        <Button
          title="Masuk"
          onPress={handleSubmit}
          loading={loading}
          className="mt-6"
        />

        {/* Sign Up Link */}
        {onSignUp && (
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-gray-600">Belum punya akun? </Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text className="text-blue-600 font-semibold">
                Daftar sekarang
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
