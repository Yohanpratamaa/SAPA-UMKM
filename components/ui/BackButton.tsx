import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
  title?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  title = "← Kembali",
  className = "",
}) => {
  const handlePress = () => {
    try {
      if (onPress) {
        onPress();
      } else {
        // Default behavior
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      router.push("/");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`p-3 bg-gray-100 rounded-lg ${className}`}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="text-gray-700 text-sm font-medium">{title}</Text>
    </TouchableOpacity>
  );
};
