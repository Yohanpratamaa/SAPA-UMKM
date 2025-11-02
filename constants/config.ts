export const APP_CONFIG = {
  name: "SAPA UMKM",
  version: "1.0.0",
  description: "Sistem Aplikasi Pendampingan Adaptasi UMKM",

  // Storage keys
  STORAGE_KEYS: {
    PROFILES: "SAPA_UMKM_PROFILES",
    USER_PREFERENCES: "SAPA_UMKM_USER_PREFERENCES",
    APP_STATE: "SAPA_UMKM_APP_STATE",
  },

  // Validation rules
  VALIDATION: {
    NIB_LENGTH: 13,
    POSTAL_CODE_LENGTH: 5,
    MIN_PHONE_LENGTH: 10,
    MAX_PHONE_LENGTH: 15,
  },

  // File upload limits
  UPLOAD_LIMITS: {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    IMAGE_QUALITY: 0.7,
    SUPPORTED_FORMATS: ["jpg", "jpeg", "png"],
  },

  // App colors
  COLORS: {
    PRIMARY: "#3B82F6",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    GRAY: "#6B7280",
  },
} as const;
