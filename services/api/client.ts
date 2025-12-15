/**
 * API Client - HTTP Client for SAPA-UMKM Backend
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG } from "./config";

// Storage keys
const TOKEN_KEY = "SAPA_UMKM_TOKEN";
const REFRESH_TOKEN_KEY = "SAPA_UMKM_REFRESH_TOKEN";
const USER_KEY = "SAPA_UMKM_USER";

// Types
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    pages: number;
  };
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Set base URL (useful for dynamic configuration)
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  /**
   * Get stored access token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Store tokens
   */
  async setTokens(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error("Failed to store tokens:", error);
    }
  }

  /**
   * Clear stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error("Failed to clear tokens:", error);
    }
  }

  /**
   * Store user data
   */
  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to store user:", error);
    }
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {}, requireAuth = true } = options;

    // Build URL
    const url = `${this.baseUrl}${endpoint}`;

    // Build headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add auth token if required
    if (requireAuth) {
      const token = await this.getToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    // Build request config
    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), this.timeout);
      });

      // Make request with timeout
      const response = (await Promise.race([
        fetch(url, config),
        timeoutPromise,
      ])) as Response;

      // Parse response
      const data = await response.json();

      // Handle unauthorized (token expired)
      if (response.status === 401 && requireAuth) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request
          return this.request(endpoint, options);
        } else {
          // Clear tokens and throw error
          await this.clearTokens();
          throw new Error("Session expired. Please login again.");
        }
      }

      return data;
    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      // Return error response
      return {
        success: false,
        message:
          error.message || "Network error. Please check your connection.",
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data?.accessToken) {
        await this.setTokens(data.data.accessToken);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  // ==================== Auth Methods ====================

  async login(identifier: string, password: string): Promise<ApiResponse> {
    // Determine if identifier is email or username
    const isEmail = identifier.includes("@");
    const body = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    const response = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body,
      requireAuth: false,
    });

    if (response.success && response.data) {
      await this.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
      await this.setUser(response.data.user);
    }

    return response;
  }

  async register(data: {
    email: string;
    username: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<ApiResponse> {
    const response = await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: data,
      requireAuth: false,
    });

    if (response.success && response.data) {
      await this.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
      await this.setUser(response.data.user);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: "POST",
    });
    await this.clearTokens();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.ME);
  }

  async updateProfile(data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.ME, {
      method: "PUT",
      body: data,
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  }

  // ==================== Profile Methods ====================

  async getProfiles(params?: {
    page?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.PROFILES}?${query}`
      : API_CONFIG.ENDPOINTS.PROFILES;

    return this.request(endpoint);
  }

  async getProfile(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PROFILE_BY_ID(id));
  }

  async createProfile(data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PROFILES, {
      method: "POST",
      body: data,
    });
  }

  async updateUmkmProfile(id: number, data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PROFILE_BY_ID(id), {
      method: "PUT",
      body: data,
    });
  }

  async deleteProfile(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PROFILE_BY_ID(id), {
      method: "DELETE",
    });
  }

  // ==================== Product Methods ====================

  async getProducts(params?: {
    page?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.kategori) queryParams.append("kategori", params.kategori);
    if (params?.status) queryParams.append("status", params.status);

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.PRODUCTS}?${query}`
      : API_CONFIG.ENDPOINTS.PRODUCTS;

    return this.request(endpoint);
  }

  async getAllProducts(params?: {
    page?: number;
    search?: string;
    kategori?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.kategori) queryParams.append("kategori", params.kategori);
    if (params?.minPrice)
      queryParams.append("min_price", params.minPrice.toString());
    if (params?.maxPrice)
      queryParams.append("max_price", params.maxPrice.toString());

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.PRODUCTS_ALL}?${query}`
      : API_CONFIG.ENDPOINTS.PRODUCTS_ALL;

    return this.request(endpoint, { requireAuth: false });
  }

  async getProduct(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
      requireAuth: false,
    });
  }

  async createProduct(data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PRODUCTS, {
      method: "POST",
      body: data,
    });
  }

  async updateProduct(id: number, data: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
      method: "PUT",
      body: data,
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
      method: "DELETE",
    });
  }

  async getProductCategories(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.PRODUCT_CATEGORIES, {
      requireAuth: false,
    });
  }

  // ==================== Training Methods ====================

  async getTrainings(params?: {
    page?: number;
    search?: string;
    kategori?: string;
    level?: string;
    status?: string;
    format?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.kategori) queryParams.append("kategori", params.kategori);
    if (params?.level) queryParams.append("level", params.level);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.format) queryParams.append("format", params.format);

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.TRAININGS}?${query}`
      : API_CONFIG.ENDPOINTS.TRAININGS;

    return this.request(endpoint, { requireAuth: false });
  }

  async getTraining(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TRAINING_BY_ID(id), {
      requireAuth: false,
    });
  }

  async enrollTraining(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TRAINING_ENROLL(id), {
      method: "POST",
    });
  }

  async getMyEnrollments(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.MY_ENROLLMENTS);
  }

  async getTrainingCategories(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TRAINING_CATEGORIES, {
      requireAuth: false,
    });
  }

  // ==================== FAQ Methods ====================

  async getFaqs(params?: {
    page?: number;
    search?: string;
    categoryId?: number;
    featured?: boolean;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.categoryId)
      queryParams.append("category_id", params.categoryId.toString());
    if (params?.featured) queryParams.append("featured", "true");

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_CONFIG.ENDPOINTS.FAQS}?${query}`
      : API_CONFIG.ENDPOINTS.FAQS;

    return this.request(endpoint, { requireAuth: false });
  }

  async getFaq(id: number): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.FAQ_BY_ID(id), {
      requireAuth: false,
    });
  }

  async getFaqCategories(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.FAQ_CATEGORIES, {
      requireAuth: false,
    });
  }

  async submitFaqFeedback(
    id: number,
    isHelpful: boolean
  ): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.FAQ_FEEDBACK(id), {
      method: "POST",
      body: { isHelpful },
      requireAuth: false,
    });
  }

  async getConsultations(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.CONSULTATIONS);
  }

  async createConsultation(data: {
    subject: string;
    pertanyaan: string;
  }): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.CONSULTATIONS, {
      method: "POST",
      body: data,
    });
  }

  // ==================== Health Check ====================

  async healthCheck(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH, { requireAuth: false });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
