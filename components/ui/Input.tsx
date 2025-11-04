import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        placeholderTextColor="#9CA3AF"
        style={{
          minHeight: 48, // Ensure minimum touch area
          fontSize: 16, // Prevent zoom on iOS
        }}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
