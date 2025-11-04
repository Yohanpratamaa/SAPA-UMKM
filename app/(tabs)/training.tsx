import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProtectedRoute } from "../../components/ProtectedRoute";

// Data training modules untuk membangun bisnis
const businessTrainingModules = [
  {
    id: "1",
    title: "Memahami Dasar-Dasar Bisnis",
    description:
      "Pelajari konsep fundamental dalam membangun bisnis dari nol hingga sukses",
    duration: "45 menit",
    type: "Video + Artikel",
    difficulty: "Pemula",
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
    modules: [
      {
        id: "1-1",
        title: "Apa itu Bisnis?",
        type: "Video",
        duration: "12 menit",
        content:
          "Pengenalan konsep bisnis, jenis-jenis bisnis, dan peluang bisnis di era digital",
      },
      {
        id: "1-2",
        title: "Mindset Entrepreneur",
        type: "Artikel",
        duration: "15 menit",
        content:
          "Membangun pola pikir wirausaha yang sukses dan mengatasi ketakutan memulai bisnis",
      },
      {
        id: "1-3",
        title: "Analisis Peluang Bisnis",
        type: "Video",
        duration: "18 menit",
        content:
          "Cara mengidentifikasi dan mengevaluasi peluang bisnis yang menguntungkan",
      },
    ],
  },
  {
    id: "2",
    title: "Riset Pasar dan Target Customer",
    description:
      "Memahami pasar dan menentukan target customer yang tepat untuk bisnis Anda",
    duration: "60 menit",
    type: "Video + Artikel",
    difficulty: "Pemula",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    modules: [
      {
        id: "2-1",
        title: "Teknik Riset Pasar",
        type: "Video",
        duration: "20 menit",
        content: "Metode dan tools untuk melakukan riset pasar yang efektif",
      },
      {
        id: "2-2",
        title: "Menentukan Target Market",
        type: "Video",
        duration: "18 menit",
        content:
          "Cara mengidentifikasi dan mendefinisikan target customer yang ideal",
      },
      {
        id: "2-3",
        title: "Analisis Kompetitor",
        type: "Artikel",
        duration: "22 menit",
        content:
          "Strategi menganalisis kompetitor dan mencari competitive advantage",
      },
    ],
  },
  {
    id: "3",
    title: "Perencanaan Bisnis & Business Model",
    description:
      "Menyusun rencana bisnis yang solid dan memilih model bisnis yang tepat",
    duration: "75 menit",
    type: "Video + Artikel",
    difficulty: "Menengah",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
    modules: [
      {
        id: "3-1",
        title: "Business Model Canvas",
        type: "Video",
        duration: "25 menit",
        content:
          "Memahami dan menggunakan Business Model Canvas untuk merancang bisnis",
      },
      {
        id: "3-2",
        title: "Menyusun Business Plan",
        type: "Video",
        duration: "30 menit",
        content:
          "Langkah-langkah membuat rencana bisnis yang komprehensif dan menarik investor",
      },
      {
        id: "3-3",
        title: "Strategi Penetapan Harga",
        type: "Artikel",
        duration: "20 menit",
        content:
          "Berbagai metode penetapan harga yang menguntungkan dan kompetitif",
      },
    ],
  },
  {
    id: "4",
    title: "Digital Marketing untuk UMKM",
    description:
      "Strategi pemasaran digital yang efektif untuk mengembangkan bisnis UMKM",
    duration: "90 menit",
    type: "Video + Artikel",
    difficulty: "Menengah",
    thumbnail:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400",
    modules: [
      {
        id: "4-1",
        title: "Social Media Marketing",
        type: "Video",
        duration: "25 menit",
        content: "Strategi pemasaran di Instagram, Facebook, TikTok untuk UMKM",
      },
      {
        id: "4-2",
        title: "Content Marketing Strategy",
        type: "Video",
        duration: "30 menit",
        content: "Membuat konten yang menarik dan meningkatkan engagement",
      },
      {
        id: "4-3",
        title: "SEO untuk Bisnis Lokal",
        type: "Artikel",
        duration: "20 menit",
        content: "Optimasi website dan Google My Business untuk bisnis lokal",
      },
      {
        id: "4-4",
        title: "Email Marketing & WhatsApp Business",
        type: "Video",
        duration: "15 menit",
        content:
          "Memanfaatkan email dan WhatsApp untuk komunikasi dengan customer",
      },
    ],
  },
  {
    id: "5",
    title: "Manajemen Keuangan Bisnis",
    description:
      "Mengelola keuangan bisnis dengan baik untuk pertumbuhan yang berkelanjutan",
    duration: "80 menit",
    type: "Video + Artikel",
    difficulty: "Menengah",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    modules: [
      {
        id: "5-1",
        title: "Pencatatan Keuangan Sederhana",
        type: "Video",
        duration: "22 menit",
        content: "Sistem pencatatan keuangan yang mudah untuk UMKM",
      },
      {
        id: "5-2",
        title: "Cash Flow Management",
        type: "Video",
        duration: "25 menit",
        content: "Mengelola arus kas untuk menjaga likuiditas bisnis",
      },
      {
        id: "5-3",
        title: "Analisis Laporan Keuangan",
        type: "Artikel",
        duration: "18 menit",
        content:
          "Membaca dan menganalisis laporan keuangan untuk pengambilan keputusan",
      },
      {
        id: "5-4",
        title: "Strategi Investasi & Pinjaman",
        type: "Video",
        duration: "15 menit",
        content:
          "Memahami sumber pendanaan dan strategi investasi untuk pertumbuhan",
      },
    ],
  },
  {
    id: "6",
    title: "Scaling & Mengembangkan Bisnis",
    description:
      "Strategi untuk mengembangkan dan memperbesar skala bisnis Anda",
    duration: "70 menit",
    type: "Video + Artikel",
    difficulty: "Lanjutan",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    modules: [
      {
        id: "6-1",
        title: "Membangun Tim yang Solid",
        type: "Video",
        duration: "20 menit",
        content: "Strategi rekrutmen dan membangun budaya kerja yang positif",
      },
      {
        id: "6-2",
        title: "Sistem & Proses Bisnis",
        type: "Video",
        duration: "25 menit",
        content: "Membuat sistem operasional yang efisien dan dapat di-scale",
      },
      {
        id: "6-3",
        title: "Ekspansi Pasar",
        type: "Artikel",
        duration: "15 menit",
        content: "Strategi memperluas jangkauan pasar dan diversifikasi produk",
      },
      {
        id: "6-4",
        title: "Teknologi untuk Bisnis",
        type: "Video",
        duration: "10 menit",
        content: "Memanfaatkan teknologi untuk otomatisasi dan efisiensi",
      },
    ],
  },
];

function TabTrainingScreen() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Pemula":
        return "bg-green-100 text-green-800";
      case "Menengah":
        return "bg-blue-100 text-blue-800";
      case "Lanjutan":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderTrainingCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedModule(item);
        setShowModuleDetail(true);
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Thumbnail */}
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Duration Badge */}
        <View className="absolute top-3 right-3 bg-black bg-opacity-60 px-3 py-2 rounded-full">
          <Text className="text-white text-sm font-medium">
            {item.duration}
          </Text>
        </View>

        {/* Type Badge */}
        <View className="absolute top-3 left-3 bg-blue-600 px-3 py-2 rounded-full">
          <Text className="text-white text-sm font-bold">{item.type}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Header with difficulty badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View
            className={`px-3 py-1 rounded-full ${getDifficultyColor(
              item.difficulty
            )}`}
          >
            <Text className="text-sm font-medium">{item.difficulty}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="play-circle-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
              {item.modules.length} modul
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-lg font-bold text-gray-900 mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
          {item.description}
        </Text>

        {/* Module Preview */}
        <View className="border-t border-gray-100 pt-3">
          <Text className="text-gray-700 text-sm font-medium mb-2">
            Modul Pembelajaran:
          </Text>
          {item.modules.slice(0, 2).map((module: any, index: number) => (
            <View key={module.id} className="flex-row items-center mb-1">
              <Ionicons
                name={
                  module.type === "Video"
                    ? "play-circle-outline"
                    : "document-text-outline"
                }
                size={14}
                color="#6B7280"
              />
              <Text
                className="text-gray-600 text-xs ml-2 flex-1"
                numberOfLines={1}
              >
                {index + 1}. {module.title}
              </Text>
            </View>
          ))}
          {item.modules.length > 2 && (
            <Text className="text-blue-600 text-xs font-medium">
              +{item.modules.length - 2} modul lainnya
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModuleDetailModal = () => (
    <Modal
      visible={showModuleDetail}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Detail Pelatihan
            </Text>
            <TouchableOpacity
              onPress={() => setShowModuleDetail(false)}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {selectedModule && (
          <ScrollView className="flex-1">
            {/* Header Image */}
            <Image
              source={{ uri: selectedModule.thumbnail }}
              className="w-full h-48"
              resizeMode="cover"
            />

            <View className="p-4">
              {/* Title & Info */}
              <View className="mb-4">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedModule.title}
                </Text>

                <View className="flex-row items-center mb-3">
                  <View
                    className={`px-3 py-1 rounded-full mr-3 ${getDifficultyColor(
                      selectedModule.difficulty
                    )}`}
                  >
                    <Text className="text-sm font-medium">
                      {selectedModule.difficulty}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {selectedModule.duration}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-700 text-base leading-6">
                  {selectedModule.description}
                </Text>
              </View>

              {/* Modules List */}
              <View className="mb-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">
                  Daftar Modul ({selectedModule.modules.length} modul)
                </Text>

                {selectedModule.modules.map((module: any, index: number) => (
                  <TouchableOpacity
                    key={module.id}
                    className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
                    onPress={() => {
                      // Navigate to module content
                      router.push({
                        pathname: "/training/[id]" as any,
                        params: {
                          id: selectedModule.id,
                          moduleId: module.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row items-start">
                      <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                        <Text className="text-blue-600 font-bold text-sm">
                          {index + 1}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text className="text-gray-900 font-semibold mb-1">
                          {module.title}
                        </Text>

                        <Text className="text-gray-600 text-sm mb-2">
                          {module.content}
                        </Text>

                        <View className="flex-row items-center">
                          <Ionicons
                            name={
                              module.type === "Video"
                                ? "play-circle-outline"
                                : "document-text-outline"
                            }
                            size={14}
                            color="#6B7280"
                          />
                          <Text className="text-gray-500 text-xs ml-1">
                            {module.type}
                          </Text>
                          <Text className="text-gray-500 text-xs mx-2">•</Text>
                          <Text className="text-gray-500 text-xs">
                            {module.duration}
                          </Text>
                        </View>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-2 pb-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Pelatihan Bisnis UMKM
        </Text>
        <Text className="text-gray-600">
          Pelajari cara membangun dan mengembangkan bisnis yang sukses
        </Text>
      </View>

      {/* Statistics */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600">
              {businessTrainingModules.length}
            </Text>
            <Text className="text-sm text-gray-600">Pelatihan</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-green-600">
              {businessTrainingModules.reduce(
                (total, module) => total + module.modules.length,
                0
              )}
            </Text>
            <Text className="text-sm text-gray-600">Total Modul</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-600">100%</Text>
            <Text className="text-sm text-gray-600">Gratis</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-600">6</Text>
            <Text className="text-sm text-gray-600">Kategori</Text>
          </View>
        </View>
      </View>

      {/* Training List */}
      <FlatList
        data={businessTrainingModules}
        renderItem={renderTrainingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Module Detail Modal */}
      {renderModuleDetailModal()}
    </SafeAreaView>
  );
}

export default function ProtectedTabTrainingScreen() {
  return (
    <ProtectedRoute>
      <TabTrainingScreen />
    </ProtectedRoute>
  );
}
