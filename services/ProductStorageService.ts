import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product, ProductFormData, ProductSearchParams } from "../types";

const STORAGE_KEY = "SAPA_UMKM_PRODUCTS";

export class ProductStorageService {
  static async saveProduct(product: Product): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const existingIndex = products.findIndex((p) => p.id === product.id);

      if (existingIndex >= 0) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      console.log("Product saved successfully:", product.id);
    } catch (error) {
      console.error("Error saving product:", error);
      throw new Error("Gagal menyimpan produk");
    }
  }

  static async getAllProducts(): Promise<Product[]> {
    try {
      const productsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (productsJson) {
        const products = JSON.parse(productsJson);
        // Convert date strings back to Date objects
        return products.map((product: any) => ({
          ...product,
          tanggalDibuat: new Date(product.tanggalDibuat),
          tanggalDiperbarui: new Date(product.tanggalDiperbarui),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting products:", error);
      return [];
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      console.log("ProductStorageService - Getting product by ID:", id);
      const products = await this.getAllProducts();
      console.log(
        "ProductStorageService - All products:",
        products.map((p) => ({ id: p.id, nama: p.nama }))
      );
      const product = products.find((p) => p.id === id) || null;
      console.log(
        "ProductStorageService - Found product:",
        product ? { id: product.id, nama: product.nama } : null
      );
      return product;
    } catch (error) {
      console.error("Error getting product by ID:", error);
      return null;
    }
  }

  static async getProductsByUMKMId(umkmId: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      return products.filter((p) => p.umkmId === umkmId && p.isAktif);
    } catch (error) {
      console.error("Error getting products by UMKM ID:", error);
      return [];
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      console.log("ProductStorageService - Deleting product with ID:", id);
      const products = await this.getAllProducts();
      console.log(
        "ProductStorageService - Products before delete:",
        products.map((p) => ({ id: p.id, nama: p.nama }))
      );
      const filteredProducts = products.filter((p) => p.id !== id);
      console.log(
        "ProductStorageService - Products after filter:",
        filteredProducts.map((p) => ({ id: p.id, nama: p.nama }))
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
      console.log("ProductStorageService - Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Gagal menghapus produk");
    }
  }

  static async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    try {
      let products = await this.getAllProducts();

      // Filter hanya produk aktif
      products = products.filter((p) => p.isAktif);

      // Text search
      if (params.query) {
        const lowercaseQuery = params.query.toLowerCase();
        products = products.filter(
          (product) =>
            product.nama.toLowerCase().includes(lowercaseQuery) ||
            product.deskripsi.toLowerCase().includes(lowercaseQuery) ||
            product.tags?.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery)
            ) ||
            product.kategori.toLowerCase().includes(lowercaseQuery)
        );
      }

      // Apply filters
      if (params.filter) {
        const { kategori, hargaMin, hargaMax, stokTersedia, umkmId } =
          params.filter;

        if (kategori) {
          products = products.filter((p) => p.kategori === kategori);
        }

        if (hargaMin !== undefined) {
          products = products.filter((p) => p.harga >= hargaMin);
        }

        if (hargaMax !== undefined) {
          products = products.filter((p) => p.harga <= hargaMax);
        }

        if (stokTersedia) {
          products = products.filter((p) => p.stok > 0);
        }

        if (umkmId) {
          products = products.filter((p) => p.umkmId === umkmId);
        }
      }

      // Apply sorting
      if (params.sortBy) {
        products.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (params.sortBy) {
            case "nama":
              aValue = a.nama.toLowerCase();
              bValue = b.nama.toLowerCase();
              break;
            case "harga":
              aValue = a.harga;
              bValue = b.harga;
              break;
            case "tanggalDibuat":
              aValue = a.tanggalDibuat.getTime();
              bValue = b.tanggalDibuat.getTime();
              break;
            case "stok":
              aValue = a.stok;
              bValue = b.stok;
              break;
            default:
              return 0;
          }

          if (params.sortOrder === "desc") {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          }
        });
      }

      return products;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  static async updateProductStatus(
    id: string,
    isAktif: boolean
  ): Promise<void> {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((p) => p.id === id);

      if (productIndex >= 0) {
        products[productIndex].isAktif = isAktif;
        products[productIndex].tanggalDiperbarui = new Date();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } else {
        throw new Error("Produk tidak ditemukan");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      throw new Error("Gagal mengupdate status produk");
    }
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static formDataToProduct(
    formData: ProductFormData,
    umkmId: string,
    existingProduct?: Product
  ): Product {
    const now = new Date();

    return {
      id: existingProduct?.id || this.generateId(),
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

  static async getProductStatistics(): Promise<{
    total: number;
    aktif: number;
    nonAktif: number;
    kategoriStats: { [key: string]: number };
  }> {
    try {
      const products = await this.getAllProducts();
      const aktif = products.filter((p) => p.isAktif).length;
      const nonAktif = products.filter((p) => !p.isAktif).length;

      const kategoriStats: { [key: string]: number } = {};
      products.forEach((product) => {
        kategoriStats[product.kategori] =
          (kategoriStats[product.kategori] || 0) + 1;
      });

      return {
        total: products.length,
        aktif,
        nonAktif,
        kategoriStats,
      };
    } catch (error) {
      console.error("Error getting product statistics:", error);
      return {
        total: 0,
        aktif: 0,
        nonAktif: 0,
        kategoriStats: {},
      };
    }
  }
}
