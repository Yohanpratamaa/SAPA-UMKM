import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RegisterFormData, RegisterValidationErrors, User } from "../../types";

const { width, height } = Dimensions.get("window");

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onSignIn?: () => void;
}

const roleOptions: User["role"][] = ["umkm", "pendamping"];

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading = false,
  onSignIn,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "umkm",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<RegisterValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: RegisterValidationErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username hanya boleh mengandung huruf, angka, dan underscore";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama lengkap harus diisi";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor telepon harus diisi";
    } else if (
      !/^[\+]?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Format nomor telepon tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log("RegisterForm: handleSubmit called");
    console.log("RegisterForm: formData:", formData);
    console.log("RegisterForm: Starting validation");

    if (validateForm()) {
      console.log("RegisterForm: Validation passed, calling onSubmit");
      onSubmit(formData);
    } else {
      console.log("RegisterForm: Validation failed, errors:", errors);
      Alert.alert("Peringatan", "Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const updateField = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterValidationErrors]) {
      setErrors((prev: RegisterValidationErrors) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getRoleDisplayName = (role: User["role"]): string => {
    switch (role) {
      case "umkm":
        return "Pelaku UMKM";
      case "pendamping":
        return "Pendamping UMKM";
      default:
        return role;
    }
  };

  const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    autoCapitalize = "sentences",
    secureTextEntry = false,
    error,
    icon,
    showEyeIcon = false,
    onEyePress,
  }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focusedField === label && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={focusedField === label ? "#4F46E5" : "#9CA3AF"}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.textInput, showEyeIcon && { flex: 1 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocusedField(label)}
          onBlur={() => setFocusedField(null)}
        />
        {showEyeIcon && (
          <TouchableOpacity onPress={onEyePress} style={styles.eyeIcon}>
            <Ionicons
              name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.backgroundGradient}
      />

      <View style={styles.decorativeContainer}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#4F46E5", "#7C3AED"]}
                style={styles.logoGradient}
              >
                <Ionicons name="person-add" size={32} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.welcomeTitle}>Bergabung dengan SAPA UMKM</Text>
            <Text style={styles.welcomeSubtitle}>
              Daftarkan akun Anda untuk memulai perjalanan digital
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Section: Informasi Akun */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Informasi Akun</Text>

              <CustomInput
                label="Email"
                value={formData.email}
                onChangeText={(value: string) => updateField("email", value)}
                placeholder="contoh@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                icon="mail-outline"
              />

              <CustomInput
                label="Username"
                value={formData.username}
                onChangeText={(value: string) => updateField("username", value)}
                placeholder="username_anda"
                autoCapitalize="none"
                error={errors.username}
                icon="person-outline"
              />

              <CustomInput
                label="Password"
                value={formData.password}
                onChangeText={(value: string) => updateField("password", value)}
                placeholder="Minimal 6 karakter"
                secureTextEntry={!showPassword}
                error={errors.password}
                icon="lock-closed-outline"
                showEyeIcon={true}
                onEyePress={() => setShowPassword(!showPassword)}
              />

              <CustomInput
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                onChangeText={(value: string) =>
                  updateField("confirmPassword", value)
                }
                placeholder="Ulangi password"
                secureTextEntry={!showConfirmPassword}
                error={errors.confirmPassword}
                icon="lock-closed-outline"
                showEyeIcon={true}
                onEyePress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </View>

            {/* Section: Informasi Personal */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Informasi Personal</Text>

              <CustomInput
                label="Nama Lengkap"
                value={formData.fullName}
                onChangeText={(value: string) => updateField("fullName", value)}
                placeholder="Nama lengkap Anda"
                error={errors.fullName}
                icon="person-circle-outline"
              />

              <CustomInput
                label="Nomor Telepon"
                value={formData.phoneNumber}
                onChangeText={(value: string) =>
                  updateField("phoneNumber", value)
                }
                placeholder="+62 812 3456 7890"
                keyboardType="phone-pad"
                error={errors.phoneNumber}
                icon="call-outline"
              />

              {/* Role Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleContainer}>
                  {roleOptions.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        formData.role === role && styles.roleOptionSelected,
                      ]}
                      onPress={() => updateField("role", role)}
                    >
                      <View
                        style={[
                          styles.roleRadio,
                          formData.role === role && styles.roleRadioSelected,
                        ]}
                      >
                        {formData.role === role && (
                          <View style={styles.roleRadioDot} />
                        )}
                      </View>
                      <View style={styles.roleContent}>
                        <Text
                          style={[
                            styles.roleTitle,
                            formData.role === role && styles.roleSelectedText,
                          ]}
                        >
                          {getRoleDisplayName(role)}
                        </Text>
                        <Text
                          style={[
                            styles.roleDescription,
                            formData.role === role && styles.roleSelectedText,
                          ]}
                        >
                          {role === "umkm"
                            ? "Untuk pemilik usaha UMKM"
                            : "Untuk pendamping/konsultan UMKM"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.role && (
                  <Text style={styles.errorText}>{errors.role}</Text>
                )}
              </View>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() =>
                  updateField("agreeToTerms", !formData.agreeToTerms)
                }
                style={styles.termsCheckContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.agreeToTerms && styles.checkboxChecked,
                  ]}
                >
                  {formData.agreeToTerms && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    Saya menyetujui{" "}
                    <Text style={styles.termsLink}>Syarat dan Ketentuan</Text>{" "}
                    serta{" "}
                    <Text style={styles.termsLink}>Kebijakan Privasi</Text> SAPA
                    UMKM
                  </Text>
                </View>
              </TouchableOpacity>
              {errors.agreeToTerms && (
                <Text style={styles.errorText}>{errors.agreeToTerms}</Text>
              )}
            </View>

            {/* Error Message */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#EF4444"
                />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={
                  loading ? ["#9CA3AF", "#6B7280"] : ["#4F46E5", "#7C3AED"]
                }
                style={styles.registerButtonGradient}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.registerButtonText}>Mendaftar...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Daftar Akun</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Manual Test Register Button */}
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => {
                console.log("Manual Test Register Button Pressed");
                const testData: RegisterFormData = {
                  email: "test@register.com",
                  username: "testregister",
                  fullName: "Test Register User",
                  phoneNumber: "+6281234567890",
                  password: "test123",
                  confirmPassword: "test123",
                  role: "umkm",
                  agreeToTerms: true,
                };
                console.log(
                  "Manual Test: Calling onSubmit with test data:",
                  testData
                );
                onSubmit(testData);
              }}
            >
              <Text style={styles.testButtonText}>🧪 Test Register</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            {onSignIn && (
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={onSignIn}>
                  <Text style={styles.signInLink}>Masuk sekarang</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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
    top: height * 0.25,
    right: 30,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
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
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
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
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
    paddingVertical: 4,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  roleContainer: {
    gap: 12,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
  },
  roleOptionSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
  },
  roleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  roleRadioSelected: {
    borderColor: "#4F46E5",
  },
  roleRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F46E5",
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  roleSelectedText: {
    color: "#4F46E5",
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsCheckContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  termsLink: {
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
  registerButton: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonDisabled: {
    shadowOpacity: 0.1,
  },
  registerButtonGradient: {
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
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginRight: 8,
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signInLink: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  testButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});
