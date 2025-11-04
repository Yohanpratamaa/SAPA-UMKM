import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";

// Interface untuk pesan chat
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Props untuk komponen ChatBubble
interface ChatBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

/**
 * Komponen ChatBubble untuk menampilkan pesan dalam bentuk bubble chat
 * Mendukung pesan dari user dan mentor dengan styling yang berbeda
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isLast = false,
}) => {
  const isUser = message.isUser;

  return (
    <Animated.View
      entering={isUser ? FadeInRight.delay(100) : FadeInLeft.delay(300)}
      className={`flex-row mb-3 ${isUser ? "justify-end" : "justify-start"} ${
        isLast ? "mb-6" : ""
      }`}
    >
      {/* Avatar untuk mentor (tampil di kiri) */}
      {!isUser && (
        <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-2 mt-1">
          <Ionicons name="person" size={16} color="white" />
        </View>
      )}

      {/* Container bubble pesan */}
      <View
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-blue-500 rounded-br-md" // Bubble user: biru dengan sudut kanan bawah runcing
            : "bg-white rounded-bl-md border border-gray-200" // Bubble mentor: putih dengan sudut kiri bawah runcing
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {/* Teks pesan */}
        <Text
          className={`text-base leading-5 ${
            isUser ? "text-white" : "text-gray-800"
          }`}
        >
          {message.text}
        </Text>

        {/* Timestamp */}
        <Text
          className={`text-xs mt-1 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Avatar untuk user (tampil di kanan) */}
      {isUser && (
        <View className="w-8 h-8 rounded-full bg-gray-400 items-center justify-center ml-2 mt-1">
          <Ionicons name="person" size={16} color="white" />
        </View>
      )}
    </Animated.View>
  );
};

/**
 * Komponen khusus untuk bubble pesan mentor dengan styling konsultan
 */
export const MentorBubble: React.FC<{ text: string; timestamp: Date }> = ({
  text,
  timestamp,
}) => {
  return (
    <Animated.View entering={FadeInLeft.delay(300)} className="mb-4 px-4">
      <View className="flex-row justify-start">
        {/* Avatar mentor dengan icon khusus */}
        <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1 flex-shrink-0">
          <Ionicons name="school" size={18} color="white" />
        </View>

        {/* Container bubble mentor */}
        <View
          className="flex-1 px-4 py-3 bg-white rounded-2xl rounded-bl-md border border-gray-200 mr-8"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          {/* Header dengan label mentor */}
          <View className="flex-row items-center mb-3">
            <Text className="text-blue-600 font-semibold text-sm">
              Konsultan UMKM
            </Text>
            <View className="w-2 h-2 bg-green-500 rounded-full ml-2" />
          </View>

          {/* Teks jawaban mentor dengan formatting */}
          <Text className="text-gray-800 text-base leading-7 mb-3">{text}</Text>

          {/* Timestamp */}
          <Text className="text-gray-500 text-xs">
            {timestamp.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

/**
 * Komponen khusus untuk bubble pesan user dengan styling personal
 */
export const UserBubble: React.FC<{ text: string; timestamp: Date }> = ({
  text,
  timestamp,
}) => {
  return (
    <Animated.View entering={FadeInRight.delay(100)} className="mb-4 px-4">
      <View className="flex-row justify-end">
        {/* Container bubble user */}
        <View
          className="flex-1 px-4 py-3 bg-blue-500 rounded-2xl rounded-br-md ml-8"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            alignSelf: "flex-end",
          }}
        >
          {/* Teks pertanyaan user */}
          <Text className="text-white text-base leading-6 mb-2">{text}</Text>

          {/* Timestamp */}
          <Text className="text-blue-100 text-xs">
            {timestamp.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Avatar user */}
        <View className="w-10 h-10 rounded-full bg-gray-400 items-center justify-center ml-3 mt-1 flex-shrink-0">
          <Ionicons name="person" size={18} color="white" />
        </View>
      </View>
    </Animated.View>
  );
};
