import { Product, ProductFormData, ProductSearchParams } from "../types";
import { apiClient } from "./api";
import { API_CONFIG } from "./api/config";

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
   * Save product (Create or Update)
   */
  static async saveProduct(product: ProductFormData | Product): Promise<void> {
    try {
      const isUpdate = "id" in product && product.id;
      const endpoint = isUpdate
        ? `${API_CONFIG.ENDPOINTS.PRODUCTS}/${product.id}`
        : API_CONFIG.ENDPOINTS.PRODUCTS;
      const method = isUpdate ? "PUT" : "POST";

      // Transform frontend data to backend format
      // Handle photos
      let gambarUtama = null;
      let gambarLainnya = null;

      // Check if 'foto' exists (from Product interface) or 'gambar' (from form data if different)
      // The ProductFormData interface has 'foto: string[]'
      const photos = (product as any).foto || [];
      if (photos.length > 0) {
        gambarUtama = photos[0];
        if (photos.length > 1) {
          gambarLainnya = JSON.stringify(photos.slice(1));
        }
      }

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

      const response = await apiClient.request(endpoint, {
        method,
        body: payload,
        requireAuth: true,
      });

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan produk");
      }
    } catch (error) {
      console.error("Error saving product:", error);
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
    const photos: string[] = [];
    if (data.gambarUtama) photos.push(data.gambarUtama);
    if (data.gambarLainnya) {
      try {
        const otherPhotos =
          typeof data.gambarLainnya === "string"
            ? JSON.parse(data.gambarLainnya)
            : data.gambarLainnya;

        if (Array.isArray(otherPhotos)) {
          photos.push(...otherPhotos);
        }
      } catch (e) {
        console.warn("Error parsing product photos:", e);
      }
    }

    return {
      id: String(data.id || ""),
      nama: data.namaProduk || "Tanpa Nama",
      deskripsi: data.deskripsi || "",
      harga: Number(data.harga) || 0,
      stok: Number(data.stok) || 0,
      kategori: data.kategori || "Lainnya",
      foto: photos.length > 0 ? photos : ["https://via.placeholder.com/300"],
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
