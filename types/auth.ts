export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  role: "umkm" | "admin" | "pendamping";
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  passwordHash?: string; // Hash password untuk keamanan
}

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: User["role"];
  agreeToTerms: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface LoginValidationErrors {
  emailOrUsername?: string;
  password?: string;
  general?: string;
}

export interface RegisterValidationErrors {
  email?: string;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  agreeToTerms?: string;
  general?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  errors?: Record<string, string>;
}
