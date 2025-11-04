import { Alert } from "react-native";
import { AuthService } from "../services";
import { LoginFormData } from "../types";

export class AuthTestUtils {
  static async testLogin() {
    console.log("=== TESTING LOGIN FUNCTIONALITY ===");

    try {
      // 1. Create demo users first
      console.log("1. Creating demo users...");
      await AuthService.createDemoUsers();

      // 2. Get all users to verify creation
      const allUsers = await AuthService.getAllUsers();
      console.log("2. Total users created:", allUsers.length);
      console.log(
        "Users:",
        allUsers.map((u) => ({ email: u.email, role: u.role }))
      );

      // 3. Test login with demo user
      console.log("3. Testing login with demo user...");
      const testFormData: LoginFormData = {
        emailOrUsername: "demo@umkm.com",
        password: "demo123",
        rememberMe: true,
      };

      console.log("Test data:", testFormData);
      const loginResponse = await AuthService.login(testFormData);
      console.log("4. Login response:", loginResponse);

      if (loginResponse.success) {
        console.log("✅ LOGIN TEST SUCCESSFUL!");
        Alert.alert("Test Result", "Login functionality is working correctly!");
      } else {
        console.log("❌ LOGIN TEST FAILED!");
        console.log("Error:", loginResponse.message);
        Alert.alert(
          "Test Result",
          `Login test failed: ${loginResponse.message}`
        );
      }

      // 5. Test with wrong password
      console.log("5. Testing with wrong password...");
      const wrongPasswordData: LoginFormData = {
        emailOrUsername: "demo@umkm.com",
        password: "wrongpassword",
        rememberMe: false,
      };

      const wrongPasswordResponse = await AuthService.login(wrongPasswordData);
      console.log("Wrong password response:", wrongPasswordResponse);

      if (!wrongPasswordResponse.success) {
        console.log("✅ Wrong password test passed - correctly rejected");
      } else {
        console.log(
          "❌ Wrong password test failed - should have been rejected"
        );
      }
    } catch (error) {
      console.error("Test error:", error);
      Alert.alert("Test Error", "An error occurred during testing");
    }
  }

  static async testRegister() {
    console.log("=== TESTING REGISTER FUNCTIONALITY ===");

    try {
      const testRegisterData = {
        email: "test@example.com",
        username: "testuser",
        fullName: "Test User",
        phoneNumber: "+628123456789",
        password: "testpass123",
        confirmPassword: "testpass123",
        role: "umkm" as const,
        agreeToTerms: true,
      };

      console.log("Testing registration with:", testRegisterData);
      const registerResponse = await AuthService.register(testRegisterData);
      console.log("Register response:", registerResponse);

      if (registerResponse.success) {
        console.log("✅ REGISTER TEST SUCCESSFUL!");
        Alert.alert(
          "Test Result",
          "Registration functionality is working correctly!"
        );
      } else {
        console.log("❌ REGISTER TEST FAILED!");
        Alert.alert(
          "Test Result",
          `Registration test failed: ${registerResponse.message}`
        );
      }
    } catch (error) {
      console.error("Register test error:", error);
      Alert.alert(
        "Test Error",
        "An error occurred during registration testing"
      );
    }
  }

  static async debugAuthState() {
    try {
      const debugInfo = await AuthService.getDebugInfo();
      console.log("=== AUTH DEBUG INFO ===");
      console.log("Current User:", debugInfo.currentUser);
      console.log("Token:", debugInfo.token);
      console.log("All Users:", debugInfo.allUsers);
      console.log("Remember Me:", debugInfo.rememberMe);

      Alert.alert(
        "Debug Info",
        `Current User: ${debugInfo.currentUser?.email || "None"}\n` +
          `Token: ${debugInfo.token ? "Present" : "None"}\n` +
          `Total Users: ${debugInfo.allUsers.length}\n` +
          `Remember Me: ${debugInfo.rememberMe}`
      );
    } catch (error) {
      console.error("Debug error:", error);
      Alert.alert("Debug Error", "Failed to get debug info");
    }
  }
}
