import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthService } from "../services";
import { AuthState, LoginFormData, RegisterFormData } from "../types";

interface AuthContextType extends AuthState {
  login: (formData: LoginFormData) => Promise<boolean>;
  register: (userData: RegisterFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: undefined,
  });

  // Cek authentication status saat app dimulai
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("🔍 AuthContext: Checking auth status on mount...");
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const [user, token] = await Promise.all([
          AuthService.getCurrentUser(),
          AuthService.getToken(),
        ]);

        console.log("🔍 AuthContext: Retrieved from storage:", {
          hasUser: !!user,
          hasToken: !!token,
          userId: user?.id,
          tokenPreview: token?.substring(0, 20) + "...",
        });

        if (user && token) {
          console.log("✅ AuthContext: User and token found, validating...");
          // Validasi token dengan API
          const isValidToken = await AuthService.validateToken(token);

          console.log("🔍 AuthContext: Token validation result:", isValidToken);

          if (isValidToken) {
            console.log(
              "✅ AuthContext: Token is valid, setting authenticated state"
            );
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              token,
            });
          } else {
            console.warn("⚠️ AuthContext: Token is invalid, logging out");
            // Token tidak valid, logout
            await logout();
          }
        } else {
          console.log(
            "ℹ️ AuthContext: No user or token found, setting unauthenticated state"
          );
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: undefined,
          });
        }
      } catch (error) {
        console.error("❌ AuthContext: Error checking auth status:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: undefined,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (formData: LoginFormData): Promise<boolean> => {
    try {
      console.log("🔐 AuthContext.login: Starting login process...");
      console.log("🔐 AuthContext.login: Form data:", {
        emailOrUsername: formData.emailOrUsername,
        rememberMe: formData.rememberMe,
      });

      const response = await AuthService.login(formData);
      console.log("🔐 AuthContext.login: AuthService response:", {
        success: response.success,
        hasUser: !!response.user,
        hasToken: !!response.token,
        message: response.message,
      });

      if (response.success && response.user && response.token) {
        console.log(
          "✅ AuthContext.login: Login successful, saving user and token..."
        );

        // Save to storage
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        // Verify saved
        const savedToken = await AuthService.getToken();
        console.log("🔍 AuthContext.login: Verification after save:", {
          tokenSaved: !!savedToken,
          tokenLength: savedToken?.length,
        });

        // Update state
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          token: response.token,
        });

        console.log("✅ AuthContext.login: State updated, login complete!");
        return true;
      }

      console.warn("⚠️ AuthContext.login: Login failed:", response.message);
      return false;
    } catch (error) {
      console.error("❌ AuthContext.login: Login error:", error);
      return false;
    }
  };

  const register = async (userData: RegisterFormData): Promise<boolean> => {
    try {
      console.log("AuthContext: register called with:", userData);
      const response = await AuthService.register(userData);
      console.log("AuthContext: register response:", response);

      if (response.success && response.user && response.token) {
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          token: response.token,
        });

        console.log("AuthContext: register successful");
        return true;
      }

      console.log("AuthContext: register failed:", response.message);
      return false;
    } catch (error) {
      console.error("AuthContext: Register error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🚪 AuthContext.logout: Starting logout process");
      await AuthService.logout();
      console.log("🚪 AuthContext.logout: AuthService.logout completed");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: undefined,
      });
      console.log("🚪 AuthContext.logout: Auth state cleared");
    } catch (error) {
      console.error("🚪 AuthContext.logout: Logout error:", error);
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setAuthState((prev) => ({
          ...prev,
          user,
        }));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
