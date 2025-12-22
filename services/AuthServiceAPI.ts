/**
 * AuthService - Authentication Service connected to Flask Backend API
 * This service handles all authentication operations via API
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthResponse,
  LoginFormData,
  LoginValidationErrors,
  RegisterFormData,
  RegisterValidationErrors,
  User,
} from "../types";
import { apiClient } from "./api";

const STORAGE_KEYS = {
  USER: "SAPA_UMKM_USER",
  TOKEN: "SAPA_UMKM_TOKEN",
  REFRESH_TOKEN: "SAPA_UMKM_REFRESH_TOKEN",
  REMEMBER_ME: "SAPA_UMKM_REMEMBER_ME",
};

export class AuthService {
  // ==================== Validation Methods ====================

  static validateLoginData(formData: LoginFormData): LoginValidationErrors {
    const errors: LoginValidationErrors = {};

    if (!formData.emailOrUsername || formData.emailOrUsername.trim() === "") {
      errors.emailOrUsername = "Email atau username harus diisi";
    }

    if (!formData.password || formData.password.trim() === "") {
      errors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    return errors;
  }

  static async validateRegisterData(
    formData: RegisterFormData
  ): Promise<RegisterValidationErrors> {
    const errors: RegisterValidationErrors = {};

    // Validate email
    if (!formData.email || formData.email.trim() === "") {
      errors.email = "Email harus diisi";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Format email tidak valid";
      }
    }

    // Validate username
    if (!formData.username || formData.username.trim() === "") {
      errors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      errors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Username hanya boleh huruf, angka, dan underscore";
    }

    // Validate full name
    if (!formData.fullName || formData.fullName.trim() === "") {
      errors.fullName = "Nama lengkap harus diisi";
    } else if (formData.fullName.length < 2) {
      errors.fullName = "Nama lengkap minimal 2 karakter";
    }

    // Validate phone number
    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      errors.phoneNumber = "Nomor telepon harus diisi";
    } else {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ""))) {
        errors.phoneNumber = "Format nomor telepon tidak valid";
      }
    }

    // Validate password
    if (!formData.password || formData.password.trim() === "") {
      errors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    return errors;
  }

  // ==================== Auth Methods (API) ====================

  /**
   * Login user via API
   */
  static async login(formData: LoginFormData): Promise<AuthResponse> {
    try {
      console.log("AuthService: login called with:", formData);

      // Validate input
      const validationErrors = this.validateLoginData(formData);
      console.log("AuthService: validation errors:", validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: "Data tidak valid",
          errors: validationErrors as Record<string, string>,
        };
      }

      // Call API
      console.log("AuthService: Calling API login...");
      const response = await apiClient.login(
        formData.emailOrUsername,
        formData.password
      );

      console.log("AuthService: API response:", response);

      if (response.success && response.data) {
        console.log("✅ AuthService.login: API response successful");

        // Convert API response to local User type
        const apiUser = response.data.user;
        const user: User = {
          id: String(apiUser.id),
          email: apiUser.email,
          username: apiUser.username,
          fullName: apiUser.fullName,
          phoneNumber: apiUser.phoneNumber || "",
          role: apiUser.role || "umkm",
          profileImage: apiUser.avatar,
          isEmailVerified: apiUser.isVerified || false,
          createdAt: new Date(apiUser.createdAt),
          lastLoginAt: apiUser.lastLogin
            ? new Date(apiUser.lastLogin)
            : undefined,
        };

        console.log("💾 AuthService.login: Storing user and tokens...");
        console.log("💾 Token details:", {
          accessTokenLength: response.data.accessToken?.length,
          hasRefreshToken: !!response.data.refreshToken,
        });

        // Store locally
        await this.saveCurrentUser(user);
        await this.saveToken(response.data.accessToken);

        if (response.data.refreshToken) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.data.refreshToken
          );
        }

        // Save remember me preference
        if (formData.rememberMe) {
          await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
        }

        // Verify token was saved
        const savedToken = await this.getToken();
        console.log("🔍 AuthService.login: Token verification:", {
          tokenSaved: !!savedToken,
          tokensMatch: savedToken === response.data.accessToken,
        });

        console.log("✅ AuthService.login: All data saved successfully!");

        return {
          success: true,
          user,
          token: response.data.accessToken,
          message: "Login berhasil",
        };
      }

      return {
        success: false,
        message: response.message || "Email/Username atau password salah",
      };
    } catch (error: any) {
      console.error("AuthService: login error:", error);
      return {
        success: false,
        message: error.message || "Terjadi kesalahan saat login",
      };
    }
  }

  /**
   * Register user via API
   */
  static async register(formData: RegisterFormData): Promise<AuthResponse> {
    try {
      console.log("AuthService: register called with:", formData);

      // Validate input
      const validationErrors = await this.validateRegisterData(formData);
      console.log("AuthService: validation errors:", validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: "Data tidak valid",
          errors: validationErrors as Record<string, string>,
        };
      }

      // Call API
      console.log("AuthService: Calling API register...");
      const response = await apiClient.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role || "umkm",
      });

      console.log("AuthService: API response:", response);

      if (response.success && response.data) {
        // Convert API response to local User type
        const apiUser = response.data.user;
        const user: User = {
          id: String(apiUser.id),
          email: apiUser.email,
          username: apiUser.username,
          fullName: apiUser.fullName,
          phoneNumber: apiUser.phoneNumber || "",
          role: apiUser.role || "umkm",
          profileImage: apiUser.avatar,
          isEmailVerified: apiUser.isVerified || false,
          createdAt: new Date(apiUser.createdAt),
          lastLoginAt: undefined,
        };

        // Store locally
        await this.saveCurrentUser(user);
        await this.saveToken(response.data.accessToken);
        if (response.data.refreshToken) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.data.refreshToken
          );
        }

        return {
          success: true,
          user,
          token: response.data.accessToken,
          message: "Registrasi berhasil",
        };
      }

      return {
        success: false,
        message: response.message || "Gagal mendaftar",
      };
    } catch (error: any) {
      console.error("AuthService: register error:", error);
      return {
        success: false,
        message: error.message || "Terjadi kesalahan saat registrasi",
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      console.log("🚪 AuthService.logout: Starting logout process");

      // Call API logout (optional, mainly for server-side token invalidation)
      try {
        await apiClient.logout();
      } catch (e) {
        // Ignore API errors during logout
        console.log("AuthService: API logout error (ignored):", e);
      }

      // Clear local storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
      ]);

      // Also clear apiClient tokens
      await apiClient.clearTokens();

      console.log("🚪 AuthService.logout: Storage cleared successfully");
    } catch (error) {
      console.error("🚪 AuthService.logout: Error:", error);
      throw error;
    }
  }

  // ==================== Storage Methods ====================

  /**
   * Get current user from local storage
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userJson) {
        const user = JSON.parse(userJson);
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          lastLoginAt: user.lastLoginAt
            ? new Date(user.lastLoginAt)
            : undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("AuthService: Error getting current user:", error);
      return null;
    }
  }

  /**
   * Save current user to local storage
   */
  static async saveCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      // Also save to apiClient
      await apiClient.setUser(user);
    } catch (error) {
      console.error("AuthService: Error saving current user:", error);
      throw error;
    }
  }

  /**
   * Get token from local storage
   */
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("AuthService: Error getting token:", error);
      return null;
    }
  }

  /**
   * Save token to local storage
   */
  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("AuthService: Error saving token:", error);
      throw error;
    }
  }

  /**
   * Validate token (check if still valid)
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      // Try to get current user from API
      const response = await apiClient.getCurrentUser();
      return response.success;
    } catch (error) {
      console.error("AuthService: Token validation error:", error);
      return false;
    }
  }

  /**
   * Refresh user data from API
   */
  static async refreshUserFromAPI(): Promise<User | null> {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        const apiUser = response.data;
        const user: User = {
          id: String(apiUser.id),
          email: apiUser.email,
          username: apiUser.username,
          fullName: apiUser.fullName,
          phoneNumber: apiUser.phoneNumber || "",
          role: apiUser.role || "umkm",
          profileImage: apiUser.avatar,
          isEmailVerified: apiUser.isVerified || false,
          createdAt: new Date(apiUser.createdAt),
          lastLoginAt: apiUser.lastLogin
            ? new Date(apiUser.lastLogin)
            : undefined,
        };
        await this.saveCurrentUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error("AuthService: Error refreshing user:", error);
      return null;
    }
  }

  /**
   * Update user profile via API
   */
  static async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await apiClient.updateProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        avatar: data.profileImage,
      });

      if (response.success && response.data) {
        const updatedUser = await this.refreshUserFromAPI();
        return {
          success: true,
          user: updatedUser || undefined,
          message: "Profil berhasil diperbarui",
        };
      }

      return {
        success: false,
        message: response.message || "Gagal memperbarui profil",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Terjadi kesalahan",
      };
    }
  }

  /**
   * Change password via API
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.changePassword(
        currentPassword,
        newPassword
      );

      return {
        success: response.success,
        message:
          response.message ||
          (response.success
            ? "Password berhasil diubah"
            : "Gagal mengubah password"),
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Terjadi kesalahan",
      };
    }
  }

  // ==================== Legacy Methods (for backward compatibility) ====================

  /**
   * @deprecated Use login() instead. This is kept for backward compatibility.
   */
  static async createDemoUsers(): Promise<void> {
    // No longer needed - demo users are created in backend via flask seed-db
    console.log(
      "AuthService: createDemoUsers is deprecated, using API backend now"
    );
  }
}
