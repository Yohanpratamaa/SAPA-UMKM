import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { AuthService } from "../services";

export class LoginDebugger {
  static async runFullDiagnostic() {
    console.log("🔍 ===== FULL LOGIN DIAGNOSTIC =====");

    try {
      // Step 1: Check AsyncStorage availability
      console.log("1️⃣ Testing AsyncStorage...");
      await this.testAsyncStorage();

      // Step 2: Clear all data and start fresh
      console.log("2️⃣ Clearing all data...");
      await AuthService.clearAllData();

      // Step 3: Create demo users
      console.log("3️⃣ Creating demo users...");
      await AuthService.createDemoUsers();

      // Step 4: Verify demo users were created
      console.log("4️⃣ Verifying demo users...");
      const users = await AuthService.getAllUsers();
      console.log("Users found:", users.length);
      users.forEach((user) => {
        console.log(
          `- ${user.email} (${user.role}) - hasPassword: ${!!user.passwordHash}`
        );
      });

      // Step 5: Test password hashing
      console.log("5️⃣ Testing password hashing...");
      const testPassword = "demo123";
      const hashedPassword = AuthService.hashPassword(testPassword);
      const isVerified = AuthService.verifyPassword(
        testPassword,
        hashedPassword
      );
      console.log(
        `Password: ${testPassword} -> Hash: ${hashedPassword} -> Verified: ${isVerified}`
      );

      // Step 6: Test login with demo user
      console.log("6️⃣ Testing login...");
      const loginData = {
        emailOrUsername: "demo@umkm.com",
        password: "demo123",
        rememberMe: true,
      };

      const loginResult = await AuthService.login(loginData);
      console.log("Login result:", loginResult);

      // Step 7: Show results
      const summary = this.generateSummary(users, loginResult);
      Alert.alert("Diagnostic Complete", summary);
    } catch (error) {
      console.error("❌ Diagnostic failed:", error);
      Alert.alert("Diagnostic Failed", `Error: ${error}`);
    }
  }

  static async testAsyncStorage() {
    try {
      const testKey = "test_key";
      const testValue = "test_value";

      // Test write
      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);

      if (retrieved === testValue) {
        console.log("✅ AsyncStorage working correctly");
        return true;
      } else {
        console.log("❌ AsyncStorage read/write failed");
        return false;
      }
    } catch (error) {
      console.error("❌ AsyncStorage test failed:", error);
      throw error;
    }
  }

  static generateSummary(users: any[], loginResult: any): string {
    let summary = "🔍 DIAGNOSTIC RESULTS:\n\n";

    summary += `👥 Users Created: ${users.length}\n`;
    users.forEach((user, index) => {
      summary += `${index + 1}. ${user.email} (${user.role})\n`;
    });

    summary += `\n🔐 Login Test:\n`;
    summary += `Status: ${loginResult.success ? "✅ SUCCESS" : "❌ FAILED"}\n`;

    if (loginResult.success) {
      summary += `User: ${loginResult.user?.email}\n`;
      summary += `Token: ${loginResult.token ? "Generated" : "Missing"}\n`;
    } else {
      summary += `Error: ${loginResult.message}\n`;
      if (loginResult.errors) {
        Object.entries(loginResult.errors).forEach(([key, value]) => {
          summary += `${key}: ${value}\n`;
        });
      }
    }

    return summary;
  }

  static async quickTest() {
    try {
      await AuthService.createDemoUsers();
      const result = await AuthService.login({
        emailOrUsername: "demo@umkm.com",
        password: "demo123",
        rememberMe: true,
      });

      Alert.alert(
        "Quick Test",
        result.success
          ? `✅ Login SUCCESS!\nUser: ${result.user?.email}`
          : `❌ Login FAILED: ${result.message}`
      );
    } catch (error) {
      Alert.alert("Quick Test Error", `${error}`);
    }
  }
}
