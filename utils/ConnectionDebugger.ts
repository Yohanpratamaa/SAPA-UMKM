/**
 * 🔍 Connection Debugger for SAPA-UMKM
 * Use this script to diagnose connection issues between React Native and Flask
 */

import { Platform } from "react-native";
import { API_CONFIG } from "../services/api/config";

interface ConnectionTestResult {
  test: string;
  status: "success" | "failed" | "warning";
  message: string;
  details?: any;
}

export class ConnectionDebugger {
  private results: ConnectionTestResult[] = [];

  /**
   * Run all connection tests
   */
  async runAllTests(): Promise<ConnectionTestResult[]> {
    console.log("🔍 Starting Connection Diagnostics...\n");

    this.results = [];

    await this.testConfiguration();
    await this.testHealthEndpoint();
    await this.testAuthEndpoint();
    await this.testNetworkReachability();

    this.printResults();

    return this.results;
  }

  /**
   * Test 1: Check Configuration
   */
  private async testConfiguration() {
    console.log("📋 Test 1: Checking Configuration...");

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const timeout = API_CONFIG.TIMEOUT;

      this.addResult({
        test: "Configuration",
        status: "success",
        message: `BASE_URL: ${baseUrl}, TIMEOUT: ${timeout}ms`,
        details: {
          platform: Platform.OS,
          baseUrl,
          timeout,
          isDev: __DEV__,
        },
      });

      // Check if IP is placeholder
      if (baseUrl.includes("X.X.X") || baseUrl.includes("xxx")) {
        this.addResult({
          test: "IP Configuration",
          status: "warning",
          message:
            "⚠️ IP Address menggunakan placeholder! Ganti dengan IP komputer Anda.",
          details: {
            currentUrl: baseUrl,
            instruction:
              "Edit services/api/config.ts dan ganti YOUR_COMPUTER_IP",
          },
        });
      }
    } catch (error: any) {
      this.addResult({
        test: "Configuration",
        status: "failed",
        message: `Failed to load configuration: ${error.message}`,
      });
    }
  }

  /**
   * Test 2: Health Check Endpoint
   */
  private async testHealthEndpoint() {
    console.log("🏥 Test 2: Testing Health Endpoint...");

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const data = await response.json();

      if (response.ok && data.status === "healthy") {
        this.addResult({
          test: "Health Endpoint",
          status: "success",
          message: "✅ Backend is reachable and healthy!",
          details: data,
        });
      } else {
        this.addResult({
          test: "Health Endpoint",
          status: "warning",
          message: `Backend responded but status is: ${data.status}`,
          details: data,
        });
      }
    } catch (error: any) {
      this.addResult({
        test: "Health Endpoint",
        status: "failed",
        message: `❌ Cannot reach backend: ${error.message}`,
        details: {
          error: error.message,
          possibleCauses: [
            "Backend server is not running",
            "Wrong IP address configured",
            "Firewall blocking connection",
            "Device and computer on different networks",
          ],
        },
      });
    }
  }

  /**
   * Test 3: Auth Endpoint
   */
  private async testAuthEndpoint() {
    console.log("🔐 Test 3: Testing Auth Endpoint...");

    try {
      // Test with invalid credentials to check if endpoint is working
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_or_username: "test_connection",
          password: "test_connection",
        }),
        signal: AbortSignal.timeout(10000),
      });

      const data = await response.json();

      // We expect this to fail (401), but it means the endpoint is working
      if (response.status === 401 || response.status === 400) {
        this.addResult({
          test: "Auth Endpoint",
          status: "success",
          message: "✅ Auth endpoint is responding correctly",
          details: {
            statusCode: response.status,
            message: data.message,
          },
        });
      } else if (response.ok) {
        this.addResult({
          test: "Auth Endpoint",
          status: "warning",
          message: "Auth endpoint responded unexpectedly",
          details: data,
        });
      }
    } catch (error: any) {
      this.addResult({
        test: "Auth Endpoint",
        status: "failed",
        message: `Cannot reach auth endpoint: ${error.message}`,
        details: { error: error.message },
      });
    }
  }

  /**
   * Test 4: Network Reachability
   */
  private async testNetworkReachability() {
    console.log("🌐 Test 4: Testing Network Reachability...");

    try {
      // Test internet connectivity
      const internetTest = await fetch("https://www.google.com", {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });

      if (internetTest.ok) {
        this.addResult({
          test: "Internet Connectivity",
          status: "success",
          message: "✅ Device has internet access",
        });
      }
    } catch (error: any) {
      this.addResult({
        test: "Internet Connectivity",
        status: "warning",
        message: "⚠️ No internet access (this is ok for local testing)",
        details: { error: error.message },
      });
    }
  }

  /**
   * Add result to collection
   */
  private addResult(result: ConnectionTestResult) {
    this.results.push(result);
  }

  /**
   * Print all results in a formatted way
   */
  private printResults() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 CONNECTION DIAGNOSTIC RESULTS");
    console.log("=".repeat(60) + "\n");

    let successCount = 0;
    let warningCount = 0;
    let failedCount = 0;

    this.results.forEach((result, index) => {
      const icon =
        result.status === "success"
          ? "✅"
          : result.status === "warning"
          ? "⚠️"
          : "❌";

      console.log(`${index + 1}. ${icon} ${result.test}`);
      console.log(`   ${result.message}`);

      if (result.details) {
        console.log(`   Details:`, JSON.stringify(result.details, null, 2));
      }

      console.log("");

      if (result.status === "success") successCount++;
      else if (result.status === "warning") warningCount++;
      else failedCount++;
    });

    console.log("=".repeat(60));
    console.log(
      `✅ Passed: ${successCount} | ⚠️ Warnings: ${warningCount} | ❌ Failed: ${failedCount}`
    );
    console.log("=".repeat(60) + "\n");

    // Provide recommendations
    if (failedCount > 0) {
      console.log("🔧 RECOMMENDED ACTIONS:");
      console.log("1. Ensure Flask backend is running: python run.py");
      console.log("2. Check IP address in services/api/config.ts");
      console.log("3. Verify device and computer are on same WiFi");
      console.log("4. Check Windows Firewall settings");
      console.log(
        "5. Test backend in browser: http://YOUR_IP:5000/api/health\n"
      );
    } else if (warningCount > 0) {
      console.log("ℹ️ Some warnings detected, but connection should work.\n");
    } else {
      console.log("🎉 All tests passed! Connection is ready.\n");
    }
  }

  /**
   * Quick test - just health check
   */
  static async quickTest(): Promise<boolean> {
    console.log("⚡ Running Quick Connection Test...");

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });

      const data = await response.json();

      if (response.ok && data.status === "healthy") {
        console.log("✅ Backend is reachable!");
        return true;
      } else {
        console.log("⚠️ Backend responded but not healthy:", data);
        return false;
      }
    } catch (error: any) {
      console.log("❌ Cannot reach backend:", error.message);
      return false;
    }
  }

  /**
   * Test specific endpoint
   */
  static async testEndpoint(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any
  ): Promise<void> {
    console.log(`🧪 Testing endpoint: ${method} ${endpoint}`);

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${endpoint}`,
        options
      );
      const data = await response.json();

      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log("Response:", data);
    } catch (error: any) {
      console.log("❌ Error:", error.message);
    }
  }
}

// Export convenience functions
export const runConnectionDiagnostics = async () => {
  const tester = new ConnectionDebugger();
  return await tester.runAllTests();
};

export const quickConnectionTest = ConnectionDebugger.quickTest;
export const testEndpoint = ConnectionDebugger.testEndpoint;
