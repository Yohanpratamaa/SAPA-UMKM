/**
 * Image Debugger - Troubleshooting tool untuk masalah image display
 */

export class ImageDebugger {
  /**
   * Test apakah image URL accessible dari aplikasi
   */
  static async testImageUrl(imageUrl: string): Promise<{
    success: boolean;
    url: string;
    status?: number;
    error?: string;
    details?: any;
  }> {
    try {
      console.log("🔍 Testing image URL:", imageUrl);

      // Test 1: Check if URL is valid
      try {
        new URL(imageUrl);
      } catch (e) {
        return {
          success: false,
          url: imageUrl,
          error: "Invalid URL format",
          details: e,
        };
      }

      // Test 2: Try to fetch the image
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const response = await fetch(imageUrl, {
          method: "HEAD", // Only get headers, not full image
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          return {
            success: true,
            url: imageUrl,
            status: response.status,
            details: {
              contentType,
              contentLength: response.headers.get("content-length"),
              isImage: contentType?.startsWith("image/"),
            },
          };
        } else {
          return {
            success: false,
            url: imageUrl,
            status: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        return {
          success: false,
          url: imageUrl,
          error:
            fetchError.name === "AbortError"
              ? "Request timeout"
              : fetchError.message,
          details: fetchError,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        url: imageUrl,
        error: error.message || "Unknown error",
        details: error,
      };
    }
  }

  /**
   * Test multiple image URLs
   */
  static async testMultipleUrls(urls: string[]): Promise<void> {
    console.log("\n========== IMAGE URL TESTING ==========");
    console.log(`Testing ${urls.length} image URL(s)...\n`);

    for (let i = 0; i < urls.length; i++) {
      console.log(`\n--- Test ${i + 1}/${urls.length} ---`);
      const result = await this.testImageUrl(urls[i]);

      if (result.success) {
        console.log("✅ SUCCESS");
        console.log("URL:", result.url);
        console.log("Status:", result.status);
        console.log("Details:", result.details);
      } else {
        console.log("❌ FAILED");
        console.log("URL:", result.url);
        console.log("Error:", result.error);
        if (result.status) console.log("Status:", result.status);
      }
    }

    console.log("\n========================================\n");
  }

  /**
   * Generate diagnostic report untuk product images
   */
  static async diagnoseProduct(product: any): Promise<{
    productId: string;
    productName: string;
    totalImages: number;
    workingImages: number;
    brokenImages: number;
    results: any[];
  }> {
    console.log("\n🔬 DIAGNOSING PRODUCT IMAGES");
    console.log("Product:", product.nama || product.namaProduk);
    console.log("ID:", product.id);

    const photos = product.foto || [];
    const results = [];

    for (const url of photos) {
      const result = await this.testImageUrl(url);
      results.push(result);
    }

    const workingImages = results.filter((r) => r.success).length;
    const brokenImages = results.filter((r) => !r.success).length;

    const report = {
      productId: product.id,
      productName: product.nama || product.namaProduk,
      totalImages: photos.length,
      workingImages,
      brokenImages,
      results,
    };

    console.log("\n📊 DIAGNOSIS RESULTS:");
    console.log("Total Images:", report.totalImages);
    console.log("Working:", report.workingImages, "✅");
    console.log("Broken:", report.brokenImages, "❌");

    if (brokenImages > 0) {
      console.log("\n⚠️ BROKEN IMAGES:");
      results
        .filter((r) => !r.success)
        .forEach((r, i) => {
          console.log(`${i + 1}. ${r.url}`);
          console.log(`   Error: ${r.error}`);
        });
    }

    return report;
  }

  /**
   * Check backend API connection
   */
  static async checkBackendConnection(baseUrl: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    console.log("\n🔌 Checking backend connection...");
    console.log("Base URL:", baseUrl);

    try {
      // Test health endpoint
      const healthUrl = `${baseUrl}/api/health`;
      console.log("Testing:", healthUrl);

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend is reachable");
        return {
          success: true,
          message: "Backend connection successful",
          details: data,
        };
      } else {
        console.log("❌ Backend returned error");
        return {
          success: false,
          message: `Backend returned ${response.status}: ${response.statusText}`,
          details: { status: response.status },
        };
      }
    } catch (error: any) {
      console.log("❌ Cannot reach backend");
      return {
        success: false,
        message: error.message || "Connection failed",
        details: error,
      };
    }
  }

  /**
   * Comprehensive system check
   */
  static async runSystemCheck(
    baseUrl: string,
    sampleImageUrl?: string
  ): Promise<void> {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║   IMAGE TROUBLESHOOTING SYSTEM CHECK   ║");
    console.log("╚════════════════════════════════════════╝\n");

    // 1. Backend connection
    console.log("1️⃣ Backend Connection Test");
    await this.checkBackendConnection(baseUrl);

    // 2. Sample image test
    if (sampleImageUrl) {
      console.log("\n2️⃣ Sample Image Test");
      await this.testImageUrl(sampleImageUrl);
    }

    // 3. Upload folder test
    console.log("\n3️⃣ Uploads Folder Test");
    const uploadTestUrl = `${baseUrl}/uploads/products/test.jpg`;
    console.log("Testing uploads path:", uploadTestUrl);
    await this.testImageUrl(uploadTestUrl);

    console.log("\n✅ System check complete!\n");
  }
}
