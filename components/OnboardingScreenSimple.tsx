import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: readonly [string, string, ...string[]];
}

interface OnboardingScreenProps {
  onFinish: () => void;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Selamat Datang",
    description:
      "SAPA UMKM adalah platform digital untuk mendampingi dan mengembangkan usaha UMKM Indonesia menuju era digital yang lebih modern dan efisien.",
    icon: "business-outline",
    colors: ["#3B82F6", "#2563EB", "#1D4ED8"] as const,
  },
  {
    id: "2",
    title: "Pendampingan Profesional",
    description:
      "Dapatkan bimbingan langsung dari ahli UMKM berpengalaman untuk mengoptimalkan strategi bisnis dan pemasaran digital Anda.",
    icon: "people-outline",
    colors: ["#10B981", "#059669", "#047857"] as const,
  },
  {
    id: "3",
    title: "Analisis & Laporan",
    description:
      "Monitor perkembangan bisnis dengan dashboard analitik lengkap dan laporan otomatis yang membantu pengambilan keputusan strategis.",
    icon: "analytics-outline",
    colors: ["#8B5CF6", "#7C3AED", "#6D28D9"] as const,
  },
  {
    id: "4",
    title: "Komunitas UMKM",
    description:
      "Bergabung dengan ribuan pelaku UMKM lainnya, berbagi pengalaman, dan membangun jaringan bisnis yang kuat untuk masa depan usaha Anda.",
    icon: "globe-outline",
    colors: ["#F59E0B", "#D97706", "#B45309"] as const,
  },
];

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.colors}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Header with skip button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
        </View>

        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name={item.icon} size={80} color={item.colors[0]} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? "#FFFFFF"
                        : "rgba(255, 255, 255, 0.4)",
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Next button */}
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={[styles.nextText, { color: item.colors[0] }]}>
              {currentIndex === onboardingData.length - 1 ? "Mulai" : "Lanjut"}
            </Text>
            <Ionicons
              name={
                currentIndex === onboardingData.length - 1
                  ? "checkmark"
                  : "arrow-forward"
              }
              size={20}
              color={item.colors[0]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  skipText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 60,
  },
  iconBackground: {
    backgroundColor: "white",
    borderRadius: 80,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginHorizontal: 20,
  },
  navigation: {
    alignItems: "center",
    paddingBottom: 60,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});
