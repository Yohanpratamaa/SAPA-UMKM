import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthService } from "../services";
import { AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
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
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const [user, token] = await Promise.all([
          AuthService.getCurrentUser(),
          AuthService.getToken(),
        ]);

        if (user && token) {
          // Validasi token
          const isValidToken = await AuthService.validateToken(token);

          if (isValidToken) {
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              token,
            });
          } else {
            // Token tidak valid, logout
            await logout();
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: undefined,
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
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

  const login = async (
    emailOrUsername: string,
    password: string,
    rememberMe?: boolean
  ): Promise<boolean> => {
    try {
      const response = await AuthService.login({
        emailOrUsername,
        password,
        rememberMe,
      });

      if (response.success && response.user && response.token) {
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          token: response.token,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await AuthService.register(userData);

      if (response.success && response.user && response.token) {
        await AuthService.saveCurrentUser(response.user);
        await AuthService.saveToken(response.token);

        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          token: response.token,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: undefined,
      });
    } catch (error) {
      console.error("Logout error:", error);
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
