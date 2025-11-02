import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 hover:bg-blue-700";
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700";
      case "outline":
        return "bg-transparent border-2 border-blue-600";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-3 py-2";
      case "medium":
        return "px-6 py-3";
      case "large":
        return "px-8 py-4";
      default:
        return "px-6 py-3";
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return "text-blue-600";
    return "text-white";
  };

  return (
    <TouchableOpacity
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-lg
        ${disabled || loading ? "opacity-50" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <Text className={`${getTextColor()} font-semibold text-center`}>
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};
