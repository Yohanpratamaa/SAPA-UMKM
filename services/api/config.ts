/**
 * API Configuration for SAPA-UMKM
 * Connects React Native frontend to Flask backend
 */

import { Platform } from "react-native";

// ==================================================================
// 🔧 KONFIGURASI IP ADDRESS (PENTING UNTUK EXPO GO DI ANDROID)
// ==================================================================
// Ganti IP di bawah ini dengan IPv4 komputer Anda (cek pakai 'ipconfig')
// Contoh: "192.168.1.5" atau "192.168.100.12"
// JANGAN gunakan "localhost" atau "127.0.0.1" untuk device fisik
const YOUR_COMPUTER_IP = "192.168.0.14"; // <--- GANTI INI
// ==================================================================

// Determine the correct base URL based on platform
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Jika IP sudah diset manual (tidak mengandung "X" placeholder), gunakan itu
    if (YOUR_COMPUTER_IP && !YOUR_COMPUTER_IP.includes("X")) {
      return `http://${YOUR_COMPUTER_IP}:5000/api`;
    }

    // Development mode defaults
    if (Platform.OS === "android") {
      // Android Emulator uses 10.0.2.2 to access host machine
      return "http://10.0.2.2:5000/api";
    } else if (Platform.OS === "web") {
      // Web browser - direct localhost
      return "http://localhost:5000/api";
    } else {
      // iOS Simulator - localhost works
      return "http://localhost:5000/api";
    }
  }
  // Production
  return "https://api.sapaumkm.com/api";
};

export const API_CONFIG = {
  // Dynamic base URL based on platform
  BASE_URL: getBaseUrl(),

  // Manual override for device testing (use your computer's IP)
  // BASE_URL: 'http://192.168.x.x:5000/api',

  TIMEOUT: 30000, // 30 seconds

  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    CHANGE_PASSWORD: "/auth/change-password",

    // Profile
    PROFILES: "/profiles",
    PROFILE_BY_ID: (id: number) => `/profiles/${id}`,

    // Products
    PRODUCTS: "/products",
    PRODUCTS_ALL: "/products/all",
    PRODUCT_BY_ID: (id: number) => `/products/${id}`,
    PRODUCT_CATEGORIES: "/products/categories",

    // Training
    TRAININGS: "/trainings",
    TRAINING_BY_ID: (id: number) => `/trainings/${id}`,
    TRAINING_ENROLL: (id: number) => `/trainings/${id}/enroll`,
    MY_ENROLLMENTS: "/trainings/my-enrollments",
    TRAINING_CATEGORIES: "/trainings/categories",

    // FAQ
    FAQS: "/faq",
    FAQ_BY_ID: (id: number) => `/faq/${id}`,
    FAQ_CATEGORIES: "/faq/categories",
    FAQ_FEEDBACK: (id: number) => `/faq/${id}/feedback`,
    CONSULTATIONS: "/faq/consultations",
    CONSULTATION_ANSWER: (id: number) => `/faq/consultations/${id}/answer`,

    // Health Check
    HEALTH: "/health",
  },
};

export default API_CONFIG;
