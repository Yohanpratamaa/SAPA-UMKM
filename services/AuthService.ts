import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthResponse,
  LoginFormData,
  LoginValidationErrors,
  RegisterFormData,
  RegisterValidationErrors,
  User,
} from "../types";

const STORAGE_KEYS = {
  USER: "SAPA_UMKM_USER",
  TOKEN: "SAPA_UMKM_TOKEN",
  USERS_DB: "SAPA_UMKM_USERS_DB",
  REMEMBER_ME: "SAPA_UMKM_REMEMBER_ME",
};

export class AuthService {
  // Hash password sederhana (untuk demo - gunakan bcrypt di production)
  static hashPassword(password: string): string {
    // Simple hash untuk demo - JANGAN gunakan di production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Verify password
  static verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  // Simulasi database users lokal
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        return users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLoginAt: user.lastLoginAt
            ? new Date(user.lastLoginAt)
            : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const existingIndex = users.findIndex((u) => u.id === user.id);

      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Gagal menyimpan data user");
    }
  }

  static async register(formData: RegisterFormData): Promise<AuthResponse> {
    try {
      // Validasi data
      const validationErrors = await this.validateRegisterData(formData);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: "Data tidak valid",
          errors: validationErrors as Record<string, string>,
        };
      }

      // Cek apakah email atau username sudah digunakan
      const users = await this.getAllUsers();
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );
      const usernameExists = users.some(
        (u) => u.username.toLowerCase() === formData.username.toLowerCase()
      );

      if (emailExists) {
        return {
          success: false,
          message: "Email sudah terdaftar",
          errors: { email: "Email sudah digunakan oleh akun lain" },
        };
      }

      if (usernameExists) {
        return {
          success: false,
          message: "Username sudah terdaftar",
          errors: { username: "Username sudah digunakan oleh akun lain" },
        };
      }

      // Buat user baru
      const newUser: User = {
        id: this.generateId(),
        email: formData.email.toLowerCase(),
        username: formData.username.toLowerCase(),
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        isEmailVerified: false, // Dalam implementasi nyata, perlu email verification
        createdAt: new Date(),
        passwordHash: this.hashPassword(formData.password), // Simpan hash password
      };

      // Simpan user ke database lokal
      await this.saveUser(newUser);

      // Generate token
      const token = this.generateToken(newUser);

      return {
        success: true,
        user: newUser,
        token,
        message: "Akun berhasil dibuat",
      };
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mendaftar",
      };
    }
  }

  static async login(formData: LoginFormData): Promise<AuthResponse> {
    try {
      console.log("AuthService: login called with:", formData);

      // Validasi data
      const validationErrors = this.validateLoginData(formData);
      console.log("AuthService: validation errors:", validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          message: "Data tidak valid",
          errors: validationErrors as Record<string, string>,
        };
      }

      // Cari user berdasarkan email atau username
      console.log("AuthService: Getting all users...");
      const users = await this.getAllUsers();
      console.log("AuthService: Found users:", users.length);

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === formData.emailOrUsername.toLowerCase() ||
          u.username.toLowerCase() === formData.emailOrUsername.toLowerCase()
      );
      console.log("AuthService: Found user:", user ? user.email : "not found");

      if (!user) {
        return {
          success: false,
          message: "Email/Username atau password salah",
          errors: { general: "Akun tidak ditemukan" },
        };
      }

      // Verifikasi password
      console.log("AuthService: Verifying password...");
      if (
        !user.passwordHash ||
        !this.verifyPassword(formData.password, user.passwordHash)
      ) {
        console.log("AuthService: Password verification failed");
        return {
          success: false,
          message: "Email/Username atau password salah",
          errors: { password: "Password tidak valid" },
        };
      }

      console.log("AuthService: Password verified, updating user...");
      // Update last login
      const updatedUser = {
        ...user,
        lastLoginAt: new Date(),
      };
      await this.saveUser(updatedUser);

      // Generate token
      const token = this.generateToken(updatedUser);
      console.log("AuthService: Generated token");

      // Simpan session jika remember me
      if (formData.rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      }

      console.log("AuthService: Login successful");
      return {
        success: true,
        user: updatedUser,
        token,
        message: "Login berhasil",
      };
    } catch (error) {
      console.error("AuthService: Error during login:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat login",
      };
    }
  }

  static async checkAuthSession(): Promise<AuthResponse> {
    try {
      const user = await this.getCurrentUser();
      const token = await this.getToken();
      const isRememberMe = await this.isRememberMeEnabled();

      if (user && token && isRememberMe) {
        const isValidToken = await this.validateToken(token);
        if (isValidToken) {
          return {
            success: true,
            user,
            token,
            message: "Session valid",
          };
        }
      }

      // Session tidak valid, clear data
      await this.logout();
      return {
        success: false,
        message: "Session expired",
      };
    } catch (error) {
      console.error("Error checking auth session:", error);
      return {
        success: false,
        message: "Error checking session",
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      console.log("🚪 AuthService.logout: Starting logout process");
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
      console.log("🚪 AuthService.logout: Storage cleared successfully");
    } catch (error) {
      console.error("🚪 AuthService.logout: Error during logout:", error);
      throw error;
    }
  }

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
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async saveCurrentUser(user: User): Promise<void> {
    try {
      console.log(
        "AuthService.saveCurrentUser: Starting to save user:",
        user.id
      );
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      console.log("AuthService.saveCurrentUser: User saved successfully");
    } catch (error) {
      console.error(
        "AuthService.saveCurrentUser: Error saving current user:",
        error
      );
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  static async saveToken(token: string): Promise<void> {
    try {
      console.log(
        "AuthService.saveToken: Starting to save token:",
        token.substring(0, 20) + "..."
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      console.log("AuthService.saveToken: Token saved successfully");
    } catch (error) {
      console.error("AuthService.saveToken: Error saving token:", error);
      throw error;
    }
  }

  static async isRememberMeEnabled(): Promise<boolean> {
    try {
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return rememberMe === "true";
    } catch (error) {
      console.error("Error checking remember me:", error);
      return false;
    }
  }

  // Validasi data register
  static async validateRegisterData(
    data: RegisterFormData
  ): Promise<RegisterValidationErrors> {
    const errors: RegisterValidationErrors = {};

    // Validasi email
    if (!data.email.trim()) {
      errors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Format email tidak valid";
    }

    // Validasi username
    if (!data.username.trim()) {
      errors.username = "Username harus diisi";
    } else if (data.username.length < 3) {
      errors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    // Validasi nama lengkap
    if (!data.fullName.trim()) {
      errors.fullName = "Nama lengkap harus diisi";
    }

    // Validasi nomor telepon
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = "Nomor telepon harus diisi";
    } else if (
      !/^[\+]?[0-9]{10,15}$/.test(data.phoneNumber.replace(/\s/g, ""))
    ) {
      errors.phoneNumber = "Format nomor telepon tidak valid";
    }

    // Validasi password
    if (!data.password) {
      errors.password = "Password harus diisi";
    } else if (data.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    // Validasi konfirmasi password
    if (!data.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak sama";
    }

    // Validasi role
    if (!data.role) {
      errors.role = "Role harus dipilih";
    }

    // Validasi persetujuan
    if (!data.agreeToTerms) {
      errors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    return errors;
  }

  // Validasi data login
  static validateLoginData(data: LoginFormData): LoginValidationErrors {
    const errors: LoginValidationErrors = {};

    if (!data.emailOrUsername.trim()) {
      errors.emailOrUsername = "Email atau username harus diisi";
    }

    if (!data.password) {
      errors.password = "Password harus diisi";
    }

    return errors;
  }

  // Helper functions
  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static generateToken(user: User): string {
    // Dalam implementasi nyata, gunakan JWT library
    return btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      // Dalam implementasi nyata, validasi JWT token
      const decoded = JSON.parse(atob(token));
      const user = await this.getCurrentUser();
      return user !== null && decoded.userId === user.id;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }

  // Demo/Debug functions
  static async createDemoUsers(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      if (users.length === 0) {
        // Create demo users
        const demoUsers: User[] = [
          {
            id: "demo-umkm-1",
            email: "demo@umkm.com",
            username: "demo_umkm",
            fullName: "Demo UMKM User",
            phoneNumber: "+628123456789",
            role: "umkm",
            isEmailVerified: true,
            createdAt: new Date(),
            passwordHash: this.hashPassword("demo123"),
          },
          {
            id: "demo-pendamping-1",
            email: "pendamping@demo.com",
            username: "demo_pendamping",
            fullName: "Demo Pendamping User",
            phoneNumber: "+628987654321",
            role: "pendamping",
            isEmailVerified: true,
            createdAt: new Date(),
            passwordHash: this.hashPassword("demo123"),
          },
        ];

        for (const user of demoUsers) {
          await this.saveUser(user);
        }
        console.log("Demo users created successfully");
      }
    } catch (error) {
      console.error("Error creating demo users:", error);
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USERS_DB,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
      console.log("All auth data cleared");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  static async getDebugInfo(): Promise<{
    currentUser: User | null;
    token: string | null;
    allUsers: User[];
    rememberMe: boolean;
  }> {
    return {
      currentUser: await this.getCurrentUser(),
      token: await this.getToken(),
      allUsers: await this.getAllUsers(),
      rememberMe: await this.isRememberMeEnabled(),
    };
  }
}
