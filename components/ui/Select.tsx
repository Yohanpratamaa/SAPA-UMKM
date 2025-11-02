import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { JenisUsahaOptions } from "../../types";

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: JenisUsahaOptions[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Pilih opsi...",
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`border rounded-lg px-4 py-3 bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="border border-gray-300 rounded-lg mt-1 bg-white max-h-48">
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-900">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
