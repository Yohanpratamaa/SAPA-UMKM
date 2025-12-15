/**
 * API Configuration for SAPA-UMKM
 * Connects React Native frontend to Flask backend
 */

import { Platform } from "react-native";

// Determine the correct base URL based on platform
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Development mode
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
