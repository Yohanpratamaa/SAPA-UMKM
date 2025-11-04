import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { FAQItem } from "../data/faqData";

// Props untuk komponen QuestionButton
interface QuestionButtonProps {
  question: FAQItem;
  onPress: (question: FAQItem) => void;
  index: number;
}

/**
 * Komponen QuestionButton untuk menampilkan pertanyaan sebagai tombol yang dapat diklik
 * Dengan animasi dan styling yang menarik
 */
export const QuestionButton: React.FC<QuestionButtonProps> = ({
  question,
  onPress,
  index,
}) => {
  // Warna berdasarkan kategori
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Perizinan":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: "text-green-600",
        };
      case "Keuangan":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: "text-blue-600",
        };
      case "Pemasaran":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: "text-purple-600",
        };
      case "Digitalisasi":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          icon: "text-orange-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: "text-gray-600",
        };
    }
  };

  // Icon berdasarkan kategori
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Perizinan":
        return "document-text-outline";
      case "Keuangan":
        return "card-outline";
      case "Pemasaran":
        return "megaphone-outline";
      case "Digitalisasi":
        return "phone-portrait-outline";
      default:
        return "help-circle-outline";
    }
  };

  const colors = getCategoryColor(question.category);
  const iconName = getCategoryIcon(question.category);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50)} // Animasi masuk bertahap dipercepat
      className="mb-2 mx-3"
    >
      <TouchableOpacity
        onPress={() => onPress(question)}
        activeOpacity={0.75}
        className="bg-white border border-gray-200 rounded-xl p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Header dengan kategori dan icon */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View
              className={`w-7 h-7 rounded-full ${colors.bg} items-center justify-center mr-2`}
            >
              <Ionicons name={iconName as any} size={14} color="#6B7280" />
            </View>
            <Text
              className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}
            >
              {question.category}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>

        {/* Pertanyaan utama dengan styling yang lebih baik */}
        <Text className="text-gray-900 font-semibold text-base leading-6 mb-3">
          {question.question}
        </Text>

        {/* Footer dengan indikator */}
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-gray-500 text-sm">
              Tap untuk melihat jawaban lengkap
            </Text>
          </View>
          <View className={`px-2 py-1 rounded-full ${colors.bg}`}>
            <Text className={`text-xs font-medium ${colors.text}`}>FAQ</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Komponen CategoryFilter untuk memfilter pertanyaan berdasarkan kategori
 */
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View className="px-4 mb-3">
      <Text className="text-gray-700 font-semibold mb-2 text-sm">
        Kategori:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {/* Tombol "Semua" */}
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedCategory === null ? "bg-blue-500" : "bg-gray-100"
          }`}
          style={{
            shadowColor: selectedCategory === null ? "#3B82F6" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: selectedCategory === null ? 0.3 : 0.1,
            shadowRadius: 2,
            elevation: selectedCategory === null ? 3 : 1,
          }}
        >
          <Text
            className={`text-sm font-medium ${
              selectedCategory === null ? "text-white" : "text-gray-600"
            }`}
          >
            Semua
          </Text>
        </TouchableOpacity>

        {/* Tombol kategori */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelectCategory(category)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedCategory === category ? "bg-blue-500" : "bg-gray-100"
            }`}
            style={{
              shadowColor: selectedCategory === category ? "#3B82F6" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: selectedCategory === category ? 0.3 : 0.1,
              shadowRadius: 2,
              elevation: selectedCategory === category ? 3 : 1,
            }}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === category ? "text-white" : "text-gray-600"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
