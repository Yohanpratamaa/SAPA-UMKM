/**
 * API Configuration for SAPA-UMKM
 * Connects React Native frontend to Flask backend
 */

// Base URL untuk API backend
// Gunakan IP address komputer Anda jika testing di device fisik
// Gunakan localhost/10.0.2.2 untuk Android Emulator
// Gunakan localhost untuk iOS Simulator

export const API_CONFIG = {
  // Development - sesuaikan dengan IP komputer Anda
  BASE_URL: __DEV__
    ? "http://localhost:5000/api" // Untuk iOS Simulator
    : "https://api.sapaumkm.com/api", // Production URL

  // Untuk Android Emulator, gunakan:
  // BASE_URL: 'http://10.0.2.2:5000/api'

  // Untuk device fisik, gunakan IP komputer:
  // BASE_URL: 'http://192.168.1.xxx:5000/api'

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
