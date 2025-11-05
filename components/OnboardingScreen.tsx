import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientColors: string[];
  iconColor: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: "1",
    title: "Manajemen Profil UMKM",
    subtitle: "Kelola Data Usaha Anda",
    description:
      "Simpan dan kelola informasi lengkap usaha Anda termasuk NIB, kontak, alamat, dan status usaha dalam satu platform yang terintegrasi dan aman.",
    icon: "business-outline",
    gradientColors: ["#3B82F6", "#2563EB", "#1D4ED8"],
    iconColor: "#FFFFFF",
  },
  {
    id: "2",
    title: "Pelatihan dan Edukasi UMKM",
    subtitle: "Tingkatkan Skill Bisnis",
    description:
      "Akses berbagai program pelatihan, workshop, dan materi edukasi untuk mengembangkan kemampuan bisnis dan digital marketing Anda.",
    icon: "school-outline",
    gradientColors: ["#10B981", "#059669", "#047857"],
    iconColor: "#FFFFFF",
  },
  {
    id: "3",
    title: "Katalog Produk UMKM",
    subtitle: "Showcase Produk Digital",
    description:
      "Tampilkan produk dan layanan UMKM Anda dalam katalog digital yang menarik, lengkapi dengan foto, deskripsi, dan harga yang kompetitif.",
    icon: "grid-outline",
    gradientColors: ["#8B5CF6", "#7C3AED", "#6D28D9"],
    iconColor: "#FFFFFF",
  },
  {
    id: "4",
    title: "Konsultasi FAQ UMKM",
    subtitle: "Bantuan dan Dukungan",
    description:
      "Dapatkan jawaban atas pertanyaan umum seputar UMKM, akses panduan praktis, dan konsultasi dengan para ahli untuk solusi bisnis Anda.",
    icon: "help-circle-outline",
    gradientColors: ["#F59E0B", "#D97706", "#B45309"],
    iconColor: "#FFFFFF",
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const skipToEnd = () => {
    onFinish();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View className="flex-1 items-center justify-center px-6" style={{ width }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={item.gradientColors[0]}
      />

      {/* Enhanced Icon Container with better design */}
      <View className="mb-16 items-center">
        <View
          className="rounded-full p-12 mb-6"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
          }}
        >
          <View
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              shadowColor: "#FFFFFF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
          />
          <Ionicons name={item.icon} size={100} color={item.iconColor} />
        </View>
      </View>

      {/* Enhanced Content */}
      <View className="items-center flex-1 justify-center">
        <Text
          className="text-white text-3xl font-black text-center mb-4"
          style={{
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}
        >
          {item.title}
        </Text>

        <View className="bg-white bg-opacity-20 rounded-full px-6 py-3 mb-6">
          <Text className="text-white text-lg font-semibold text-center">
            {item.subtitle}
          </Text>
        </View>

        <Text className="text-white text-base text-center leading-7 opacity-90 px-4">
          {item.description}
        </Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View className="flex-row justify-center mb-8">
      {onboardingData.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 30, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            className="h-3 rounded-full bg-white mx-1"
            style={{
              width: dotWidth,
              opacity,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          />
        );
      })}
    </View>
  );

  const currentSlide = onboardingData[currentIndex];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={currentSlide.gradientColors as [string, string, ...string[]]}
        style={StyleSheet.absoluteFillObject}
      />

      <StatusBar
        barStyle="light-content"
        backgroundColor={currentSlide.gradientColors[0]}
      />

      {/* Enhanced Background Pattern */}
      <View className="absolute inset-0">
        <View
          className="absolute rounded-full"
          style={{
            width: width * 1.4,
            height: width * 1.4,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            top: -width * 0.7,
            right: -width * 0.5,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: width * 1.1,
            height: width * 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            bottom: -width * 0.4,
            left: -width * 0.3,
          }}
        />

        {/* Additional decorative elements */}
        <View
          className="absolute rounded-full"
          style={{
            width: width * 0.3,
            height: width * 0.3,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            top: height * 0.2,
            left: -width * 0.05,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            top: height * 0.15,
            right: width * 0.1,
          }}
        />
        <View
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            bottom: height * 0.3,
            right: width * 0.05,
          }}
        />
      </View>

      {/* Enhanced Skip Button */}
      <View className="absolute top-12 right-6 z-10">
        <TouchableOpacity
          onPress={skipToEnd}
          className="bg-white bg-opacity-20 px-5 py-3 rounded-full"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text className="text-white font-semibold">Lewati</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Enhanced Bottom Navigation */}
      <View className="absolute bottom-8 left-0 right-0 px-6">
        {renderPagination()}

        <View className="flex-row justify-between items-center">
          {/* Previous Button */}
          <TouchableOpacity
            onPress={goToPreviousSlide}
            className={`flex-row items-center px-5 py-4 rounded-full ${
              currentIndex === 0 ? "bg-transparent" : "bg-white bg-opacity-20"
            }`}
            disabled={currentIndex === 0}
            style={
              currentIndex > 0
                ? {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                  }
                : {}
            }
          >
            {currentIndex > 0 && (
              <>
                <Ionicons name="chevron-back" size={22} color="white" />
                <Text className="text-white font-semibold ml-2">Kembali</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Next/Finish Button */}
          <TouchableOpacity
            onPress={goToNextSlide}
            className="bg-white px-8 py-4 rounded-full flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <Text
              className="font-bold text-lg mr-2"
              style={{ color: currentSlide.gradientColors[0] }}
            >
              {currentIndex === onboardingData.length - 1 ? "Mulai" : "Lanjut"}
            </Text>
            <Ionicons
              name={
                currentIndex === onboardingData.length - 1
                  ? "checkmark"
                  : "chevron-forward"
              }
              size={22}
              color={currentSlide.gradientColors[0]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
