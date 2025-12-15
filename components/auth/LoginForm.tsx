import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LoginFormData, LoginValidationErrors } from "../../types";

const { width, height } = Dimensions.get("window");

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading?: boolean;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onDemoLogin?: () => void;
  onDebugAction?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  onForgotPassword,
  onSignUp,
  onDemoLogin,
  onDebugAction,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Refs for TextInput components
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const validateForm = (): boolean => {
    const newErrors: LoginValidationErrors = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email atau username harus diisi";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log("LoginForm: handleSubmit called");
    console.log("FormData:", formData);

    if (validateForm()) {
      console.log("LoginForm: Validation passed, calling onSubmit");
      onSubmit(formData);
    } else {
      console.log("LoginForm: Validation failed", errors);
      Alert.alert("Peringatan", "Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const updateField = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev: LoginFormData) => ({ ...prev, [field]: value }));
    if (errors[field as keyof LoginValidationErrors]) {
      setErrors((prev: LoginValidationErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.backgroundGradient}
      />

      {/* Decorative background elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              style={styles.logoGradient}
            >
              <Ionicons name="business" size={32} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.welcomeTitle}>Selamat Datang Kembali</Text>
          <Text style={styles.welcomeSubtitle}>
            Masuk ke akun SAPA UMKM Anda untuk melanjutkan
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email/Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email atau Username</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // Focus the TextInput when the wrapper is pressed
                const input = emailInputRef.current;
                if (input) {
                  input.focus();
                }
              }}
              style={[
                styles.inputWrapper,
                focusedField === "emailOrUsername" &&
                  styles.inputWrapperFocused,
                errors.emailOrUsername && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={
                  focusedField === "emailOrUsername" ? "#4F46E5" : "#9CA3AF"
                }
                style={styles.inputIcon}
              />
              <TextInput
                ref={emailInputRef}
                style={styles.textInput}
                value={formData.emailOrUsername}
                onChangeText={(value) => updateField("emailOrUsername", value)}
                placeholder="Masukkan email atau username"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField("emailOrUsername")}
                onBlur={() => setFocusedField(null)}
              />
            </TouchableOpacity>
            {errors.emailOrUsername && (
              <Text style={styles.errorText}>{errors.emailOrUsername}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // Focus the TextInput when the wrapper is pressed
                const input = passwordInputRef.current;
                if (input) {
                  input.focus();
                }
              }}
              style={[
                styles.inputWrapper,
                focusedField === "password" && styles.inputWrapperFocused,
                errors.password && styles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focusedField === "password" ? "#4F46E5" : "#9CA3AF"}
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordInputRef}
                style={[styles.textInput, { flex: 1 }]}
                value={formData.password}
                onChangeText={(value) => updateField("password", value)}
                placeholder="Masukkan password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </TouchableOpacity>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => updateField("rememberMe", !formData.rememberMe)}
              style={styles.rememberMeContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.rememberMe && styles.checkboxChecked,
                ]}
              >
                {formData.rememberMe && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text style={styles.rememberMeText}>Ingat saya</Text>
            </TouchableOpacity>

            {onForgotPassword && (
              <TouchableOpacity onPress={onForgotPassword}>
                <Text style={styles.forgotPasswordText}>Lupa password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Error Message */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ["#9CA3AF", "#6B7280"] : ["#4F46E5", "#7C3AED"]}
              style={styles.loginButtonGradient}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loginButtonText}>Memuat...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Masuk</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          {onSignUp && (
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={onSignUp}>
                <Text style={styles.signUpLink}>Daftar sekarang</Text>
              </TouchableOpacity>
            </View>
          )}

          Demo Login Button
          {onDemoLogin && (
            <TouchableOpacity style={styles.demoButton} onPress={onDemoLogin}>
              <Text style={styles.demoButtonText}>🎭 Coba Demo Login</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: -1, // Ensure decorative elements are behind everything
    pointerEvents: "none", // Prevent decorative elements from intercepting touches
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100, // Ensure form is above all decorative elements
    position: "relative",
  },
  inputContainer: {
    marginBottom: 20,
    zIndex: 50, // Ensure input container is above decorative elements
    position: "relative",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50, // Ensure minimum touch area
    zIndex: 10, // Ensure input is above decorative elements
  },
  inputWrapperFocused: {
    borderColor: "#4F46E5",
    backgroundColor: "#FFF",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 8, // Increased touch area
    minHeight: 24, // Ensure minimum height for text
  },
  eyeIcon: {
    padding: 8, // Increased padding for better touch area
    marginLeft: 4,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  generalErrorText: {
    fontSize: 14,
    color: "#EF4444",
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    shadowOpacity: 0.1,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginRight: 8,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signUpLink: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  demoButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 12,
  },
  demoButtonText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  debugButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  debugButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  manualTestButton: {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 0, 0.3)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 8,
  },
  manualTestButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
});
