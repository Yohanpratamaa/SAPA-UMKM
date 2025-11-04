import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChatMessage,
  MentorBubble,
  UserBubble,
} from "../../components/ChatBubble";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import {
  CategoryFilter,
  QuestionButton,
} from "../../components/QuestionButton";
import {
  categories,
  faqData,
  FAQItem,
  getFAQByCategory,
} from "../../data/faqData";

/**
 * Komponen utama untuk fitur Konsultasi Digital UMKM
 * Menyediakan chat interaktif dengan FAQ otomatis
 */
function ConsultationScreen() {
  // State untuk mengelola percakapan
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(true);

  // Ref untuk scroll otomatis ke pesan terbaru
  const chatScrollRef = useRef<FlatList>(null);
  const questionsScrollRef = useRef<ScrollView>(null);

  // Effect untuk scroll otomatis saat ada pesan baru
  useEffect(() => {
    if (messages.length > 0 && chatScrollRef.current) {
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages]);

  /**
   * Handler saat user memilih pertanyaan
   * Menambahkan pertanyaan user dan jawaban mentor ke chat
   */
  const handleQuestionPress = (faqItem: FAQItem) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: faqItem.question,
      isUser: true,
      timestamp: new Date(),
    };

    const mentorMessage: ChatMessage = {
      id: `mentor-${Date.now()}`,
      text: faqItem.answer,
      isUser: false,
      timestamp: new Date(Date.now() + 1000), // Delay 1 detik untuk kesan realistic
    };

    // Tambahkan pesan user terlebih dahulu
    setMessages((prev) => [...prev, userMessage]);

    // Tambahkan pesan mentor setelah delay
    setTimeout(() => {
      setMessages((prev) => [...prev, mentorMessage]);
    }, 1500);

    // Auto-collapse pertanyaan setelah dipilih
    setIsQuestionsExpanded(false);
    setShowQuestions(false);
    setTimeout(() => setShowQuestions(true), 3000);
  };

  /**
   * Toggle expand/collapse daftar pertanyaan
   */
  const toggleQuestionsExpanded = () => {
    setIsQuestionsExpanded(!isQuestionsExpanded);
  };

  /**
   * Fungsi untuk clear chat history
   */
  const clearChat = () => {
    Alert.alert(
      "Hapus Riwayat Chat",
      "Apakah Anda yakin ingin menghapus semua percakapan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => setMessages([]),
        },
      ]
    );
  };

  /**
   * Filter FAQ berdasarkan kategori dan pencarian
   */
  const getFilteredFAQ = () => {
    let filtered = selectedCategory
      ? getFAQByCategory(selectedCategory)
      : faqData;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  /**
   * Render item pesan chat
   */
  const renderChatMessage = ({ item }: { item: ChatMessage }) => {
    if (item.isUser) {
      return <UserBubble text={item.text} timestamp={item.timestamp} />;
    } else {
      return <MentorBubble text={item.text} timestamp={item.timestamp} />;
    }
  };

  /**
   * Render komponen welcome message saat belum ada chat
   */
  const renderWelcomeMessage = () => (
    <Animated.View
      entering={FadeInUp.delay(200)}
      className="items-center justify-center p-8"
    >
      <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="chatbubble-ellipses" size={32} color="#3B82F6" />
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
        Konsultasi Digital UMKM
      </Text>
      <Text className="text-gray-600 text-center leading-6 mb-4">
        Selamat datang! Saya adalah konsultan virtual yang siap membantu Anda
        dengan berbagai pertanyaan seputar UMKM.
      </Text>
      <Text className="text-blue-600 text-center font-medium">
        Pilih salah satu pertanyaan di bawah untuk memulai percakapan
      </Text>
    </Animated.View>
  );

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-4 pt-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
              </View>
              <View>
                <Text className="text-lg font-bold text-gray-900">
                  Konsultasi Digital
                </Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600">Online 24/7</Text>
                </View>
              </View>
            </View>

            {/* Tombol clear chat */}
            {messages.length > 0 && (
              <TouchableOpacity
                onPress={clearChat}
                className="p-2 rounded-full bg-gray-100"
              >
                <Ionicons name="trash-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Area Chat */}
          <View className="flex-1">
            {messages.length === 0 ? (
              renderWelcomeMessage()
            ) : (
              <FlatList
                ref={chatScrollRef}
                data={messages}
                renderItem={renderChatMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingTop: 16,
                  paddingBottom: 20,
                  flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Area Pertanyaan dengan Toggle */}
          {showQuestions && (
            <Animated.View
              entering={FadeInDown.delay(100)}
              className="bg-white border-t border-gray-200"
            >
              {/* Header dengan tombol toggle */}
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                  <Ionicons name="help-circle" size={20} color="#3B82F6" />
                  <Text className="text-gray-900 font-semibold ml-2">
                    Daftar Pertanyaan
                  </Text>
                  <Text className="text-gray-500 text-sm ml-2">
                    ({getFilteredFAQ().length})
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={toggleQuestionsExpanded}
                  className="p-2 rounded-full bg-gray-100"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isQuestionsExpanded ? "chevron-down" : "chevron-up"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Content yang bisa di-expand/collapse */}
              {isQuestionsExpanded && (
                <Animated.View entering={FadeInDown.delay(50)}>
                  {/* Search Bar */}
                  <View className="px-4 pt-3 pb-2">
                    <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                      <Ionicons
                        name="search-outline"
                        size={20}
                        color="#6B7280"
                      />
                      <TextInput
                        className="flex-1 ml-3 text-gray-900"
                        placeholder="Cari pertanyaan..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#6B7280"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Category Filter */}
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Daftar Pertanyaan dengan max height */}
                  <View style={{ maxHeight: 320 }}>
                    <ScrollView
                      ref={questionsScrollRef}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      showsVerticalScrollIndicator={false}
                    >
                      {getFilteredFAQ().length > 0 ? (
                        getFilteredFAQ().map((question, index) => (
                          <QuestionButton
                            key={question.id}
                            question={question}
                            onPress={handleQuestionPress}
                            index={index}
                          />
                        ))
                      ) : (
                        <View className="items-center py-8">
                          <Ionicons
                            name="search-outline"
                            size={48}
                            color="#9CA3AF"
                          />
                          <Text className="text-gray-500 text-center mt-4">
                            Tidak ada pertanyaan yang ditemukan
                          </Text>
                          <Text className="text-gray-400 text-center text-sm mt-1">
                            Coba ubah kata kunci atau kategori pencarian
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </Animated.View>
              )}

              {/* Quick Stats saat collapsed */}
              {!isQuestionsExpanded && (
                <Animated.View
                  entering={FadeInDown.delay(50)}
                  className="px-4 py-3"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-600 text-sm">
                      {categories.length} kategori tersedia
                    </Text>
                    <Text className="text-blue-600 text-sm font-medium">
                      Tap untuk melihat pertanyaan
                    </Text>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          )}
        </KeyboardAvoidingView>

        {/* Status Bar untuk jumlah FAQ */}
        <SafeAreaView edges={["bottom"]} className="bg-blue-50">
          <View className="px-4 py-2">
            <Text className="text-blue-700 text-sm text-center">
              {getFilteredFAQ().length} pertanyaan tersedia{" "}
              {selectedCategory && `untuk kategori ${selectedCategory}`}
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

export default ConsultationScreen;
