import { Product, ProductFormData, ProductSearchParams } from "../types";
import { apiClient } from "./api";
import { API_CONFIG } from "./api/config";
import { ImageUploadService } from "./ImageUploadService";

export class ProductService {
  /**
   * Get all products for the current user (My Products)
   */
  static async getMyProducts(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    kategori?: string;
    status?: string;
  }): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.perPage)
        queryParams.append("per_page", params.perPage.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.kategori) queryParams.append("kategori", params.kategori);
      if (params?.status) queryParams.append("status", params.status);

      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}?${queryParams.toString()}`,
        {
          method: "GET",
          requireAuth: true,
        }
      );

      if (response.success && response.data) {
        return response.data.map(this.transformProduct);
      }
      return [];
    } catch (error) {
      console.error("Error getting my products:", error);
      return [];
    }
  }

  /**
   * Get all public products (Marketplace)
   */
  static async getAllProducts(
    params?: ProductSearchParams
  ): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append("search", params.search);
      if (params?.kategori) queryParams.append("kategori", params.kategori);
      if (params?.minPrice)
        queryParams.append("min_price", params.minPrice.toString());
      if (params?.maxPrice)
        queryParams.append("max_price", params.maxPrice.toString());

      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}/all?${queryParams.toString()}`,
        {
          method: "GET",
          requireAuth: false,
        }
      );

      if (response.success && response.data) {
        return response.data.map(this.transformProduct);
      }
      return [];
    } catch (error) {
      console.error("Error getting marketplace products:", error);
      return [];
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
        {
          method: "GET",
          requireAuth: false,
        }
      );

      if (response.success && response.data) {
        return this.transformProduct(response.data);
      }
      return null;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      return null;
    }
  }

  /**
   * Upload product image to server
   * Try FormData first, fallback to FileSystem if it fails
   */
  static async uploadImage(imageUri: string): Promise<string | null> {
    try {
      console.log("📤 Uploading image:", imageUri);

      // Method 1: Try FormData approach (standard for React Native)
      try {
        // Create form data (React Native compatible)
        const formData = new FormData();

        // Extract filename from URI
        const uriParts = imageUri.split("/");
        const filename =
          uriParts[uriParts.length - 1] || `photo_${Date.now()}.jpg`;

        // Get file extension
        const fileExtension = filename.split(".").pop()?.toLowerCase() || "jpg";
        const mimeType = `image/${
          fileExtension === "jpg" ? "jpeg" : fileExtension
        }`;

        console.log("📸 Image details:", { filename, mimeType, imageUri });

        // For React Native, we need to format the file object correctly
        // @ts-ignore - React Native FormData accepts this format
        formData.append("file", {
          uri: imageUri,
          type: mimeType,
          name: filename,
        });

        console.log("📦 Method 1: FormData prepared, sending to server...");

        // Upload to backend
        const response = await apiClient.request(
          `${API_CONFIG.ENDPOINTS.PRODUCTS}/upload-image`,
          {
            method: "POST",
            body: formData,
            requireAuth: true,
          }
        );

        console.log("📬 Upload response:", response);

        if (response.success && response.data?.url) {
          console.log("✅ Image uploaded successfully:", response.data.url);
          return response.data.url;
        }

        console.warn(
          "⚠️ Method 1 (FormData) failed, trying Method 2 (FileSystem)..."
        );
      } catch (formDataError) {
        console.warn("⚠️ Method 1 error:", formDataError);
      }

      // Method 2: Fallback to expo-file-system
      console.log("📦 Method 2: Using expo-file-system...");
      const url = await ImageUploadService.uploadImageWithFileSystem(imageUri);

      if (url) {
        console.log("✅ Image uploaded via FileSystem:", url);
        return url;
      }

      console.error("❌ Both upload methods failed");
      return null;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return null;
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadImages(imageUris: string[]): Promise<string[]> {
    try {
      console.log(`📤 Uploading ${imageUris.length} images...`);

      const uploadPromises = imageUris.map((uri) => this.uploadImage(uri));
      const results = await Promise.all(uploadPromises);

      // Filter out null values (failed uploads)
      const successfulUploads = results.filter(
        (url) => url !== null
      ) as string[];

      console.log(
        `✅ ${successfulUploads.length}/${imageUris.length} images uploaded successfully`
      );

      return successfulUploads;
    } catch (error) {
      console.error("❌ Error uploading multiple images:", error);
      return [];
    }
  }

  /**
   * Save product (Create or Update)
   */
  static async saveProduct(product: ProductFormData | Product): Promise<void> {
    try {
      const isUpdate = "id" in product && product.id;
      const endpoint = isUpdate
        ? `${API_CONFIG.ENDPOINTS.PRODUCTS}/${product.id}`
        : API_CONFIG.ENDPOINTS.PRODUCTS;
      const method = isUpdate ? "PUT" : "POST";

      // ✅ STEP 1: Upload images first if they are local URIs
      let gambarUtama = null;
      let gambarLainnya = null;

      const photos = (product as any).foto || [];

      if (photos.length > 0) {
        console.log("📤 Starting image upload process...");

        // Check if photos are local URIs (need upload) or already URLs
        const needsUpload = photos.some(
          (uri: string) =>
            uri.startsWith("file://") || uri.startsWith("content://")
        );

        let uploadedUrls: string[] = [];

        if (needsUpload) {
          // Upload local images to server
          uploadedUrls = await this.uploadImages(photos);

          if (uploadedUrls.length === 0) {
            throw new Error("Gagal mengupload foto produk");
          }
        } else {
          // Already URLs, use directly
          uploadedUrls = photos;
        }

        // Set gambar utama and lainnya from uploaded URLs
        gambarUtama = uploadedUrls[0];
        if (uploadedUrls.length > 1) {
          gambarLainnya = JSON.stringify(uploadedUrls.slice(1));
        }

        console.log("✅ Images processed:", {
          gambarUtama,
          totalImages: uploadedUrls.length,
        });
      }

      // ✅ STEP 2: Save product with image URLs
      const payload = {
        namaProduk: product.nama,
        deskripsi: product.deskripsi,
        harga: product.harga,
        stok: product.stok,
        kategori: product.kategori,
        gambar_utama: gambarUtama,
        gambar_lainnya: gambarLainnya,
        satuan: (product as any).satuan,
        status: (product as any).isAktif ? "aktif" : "nonaktif",
      };

      console.log("📤 Saving product with payload:", payload);

      const response = await apiClient.request(endpoint, {
        method,
        body: payload,
        requireAuth: true,
      });

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan produk");
      }

      console.log("✅ Product saved successfully");
    } catch (error) {
      console.error("❌ Error saving product:", error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<void> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`,
        {
          method: "DELETE",
          requireAuth: true,
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  /**
   * Search products (Alias for getAllProducts with params)
   */
  static async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    return this.getAllProducts(params);
  }

  /**
   * Get products by UMKM ID
   * Note: Backend might need a specific endpoint for this, or we filter client-side if not available.
   * For now, we'll assume we can filter marketplace products or add a query param if backend supports it.
   */
  static async getProductsByUMKMId(umkmId: string): Promise<Product[]> {
    // TODO: Implement backend filter by UMKM ID if needed.
    // For now, fetching all and filtering (inefficient but matches current logic)
    // OR better: The backend /all endpoint might support umkm_id filter.
    // Let's assume we just return empty for now or implement if critical.
    return [];
  }

  /**
   * Get product statistics
   */
  static async getProductStatistics(): Promise<{
    total: number;
    aktif: number;
    nonAktif: number;
    kategoriStats: { [key: string]: number };
  }> {
    try {
      const products = await this.getMyProducts();
      const stats = {
        total: products.length,
        aktif: products.filter((p) => p.isAktif).length,
        nonAktif: products.filter((p) => !p.isAktif).length,
        kategoriStats: {} as { [key: string]: number },
      };

      products.forEach((p) => {
        stats.kategoriStats[p.kategori] =
          (stats.kategoriStats[p.kategori] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error getting product statistics:", error);
      return { total: 0, aktif: 0, nonAktif: 0, kategoriStats: {} };
    }
  }

  // Helper to transform backend data to frontend model
  private static transformProduct(data: any): Product {
    console.log("🔄 Transforming product data:", {
      id: data.id,
      nama: data.namaProduk,
      gambarUtama: data.gambarUtama,
      gambarLainnya: data.gambarLainnya,
    });

    const photos: string[] = [];

    // Add main image
    if (data.gambarUtama) {
      const validUrl = data.gambarUtama.trim();
      if (validUrl) {
        photos.push(validUrl);
        console.log("✅ Main image added:", validUrl);
      }
    }

    // Add other images
    if (data.gambarLainnya) {
      try {
        const otherPhotos =
          typeof data.gambarLainnya === "string"
            ? JSON.parse(data.gambarLainnya)
            : data.gambarLainnya;

        if (Array.isArray(otherPhotos)) {
          otherPhotos.forEach((photo: string) => {
            const validUrl = photo.trim();
            if (validUrl) {
              photos.push(validUrl);
            }
          });
          console.log("✅ Other images added:", otherPhotos.length);
        }
      } catch (e) {
        console.warn("⚠️ Error parsing product photos:", e);
      }
    }

    console.log(
      "📸 Total photos for product ${data.id}:",
      photos.length,
      photos
    );

    const transformedProduct = {
      id: String(data.id || ""),
      nama: data.namaProduk || "Tanpa Nama",
      deskripsi: data.deskripsi || "",
      harga: Number(data.harga) || 0,
      stok: Number(data.stok) || 0,
      kategori: data.kategori || "Lainnya",
      foto: photos.length > 0 ? photos : [],
      satuan: data.satuan || "pcs",
      umkmId: String(data.userId || ""),
      umkmNama: data.umkmNama || "UMKM",
      isAktif: data.status === "aktif",
      rating: Number(data.rating) || 0,
      terjual: Number(data.sold) || 0,
      lokasi: data.lokasi || "",
      tanggalDibuat: data.createdAt ? new Date(data.createdAt) : new Date(),
      tanggalDiperbarui: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };

    console.log("✨ Product transformed:", {
      id: transformedProduct.id,
      nama: transformedProduct.nama,
      fotoCount: transformedProduct.foto.length,
      firstFoto: transformedProduct.foto[0],
    });

    return transformedProduct;
  }

  static formDataToProduct(
    formData: ProductFormData,
    umkmId: string,
    existingProduct?: Product
  ): Product {
    const now = new Date();

    return {
      id: existingProduct?.id || "", // Backend will generate ID
      umkmId,
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      harga: parseFloat(formData.harga) || 0,
      kategori: formData.kategori,
      foto: formData.foto,
      stok: parseInt(formData.stok) || 0,
      satuan: formData.satuan,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
      isAktif: true,
      tanggalDibuat: existingProduct?.tanggalDibuat || now,
      tanggalDiperbarui: now,
    };
  }

  static productToFormData(product: Product): ProductFormData {
    return {
      nama: product.nama,
      deskripsi: product.deskripsi,
      harga: product.harga.toString(),
      kategori: product.kategori,
      foto: product.foto,
      stok: product.stok.toString(),
      satuan: product.satuan,
      tags: product.tags?.join(", ") || "",
    };
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }
}
