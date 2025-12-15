import { Alert } from "react-native";
import { ProductStorageService, ProfileStorageService } from "../services";
import { Product } from "../types/product";
import { UMKMProfile } from "../types/profile";

export class DataSeeder {
  static async clearAllData(): Promise<void> {
    try {
      console.log("🧹 DataSeeder: Clearing all existing data...");

      // Clear all profiles
      const allProfiles = await ProfileStorageService.getAllProfiles();
      for (const profile of allProfiles) {
        await ProfileStorageService.deleteProfile(profile.id);
      }

      // Clear all products
      const allProducts = await ProductStorageService.getAllProducts();
      for (const product of allProducts) {
        await ProductStorageService.deleteProduct(product.id);
      }

      console.log("🧹 DataSeeder: All data cleared successfully");
    } catch (error) {
      console.error("🧹 DataSeeder: Error clearing data:", error);
      throw error;
    }
  }

  static async seedProfiles(): Promise<void> {
    try {
      console.log("🌱 DataSeeder: Creating sample UMKM profiles...");

      const sampleProfiles: Omit<UMKMProfile, "id" | "tanggalDaftar">[] = [
        {
          namaUsaha: "Warung Makan Bu Sari",
          jenisUsaha: "Kuliner",
          deskripsiUsaha:
            "Warung makan tradisional dengan menu masakan Padang autentik dan cita rasa yang sudah turun temurun dari keluarga.",
          alamatLengkap: "Jl. Mawar No. 15, RT 02/RW 05, Kelurahan Sukajadi",
          kota: "Bandung",
          provinsi: "Jawa Barat",
          kodePos: "40162",
          nib: "1234567890123",
          nomorKontak: "+6281234567890",
          email: "warungebusari@gmail.com",
          website: "https://warungebusari.com",
          fotoLogo: "",
          status: "aktif" as const,
        },
        {
          namaUsaha: "Batik Nusantara",
          jenisUsaha: "Fashion",
          deskripsiUsaha:
            "Produsen batik tulis dan cap dengan motif tradisional dan modern. Melayani pesanan seragam batik untuk instansi dan perusahaan.",
          alamatLengkap:
            "Jl. Malioboro No. 88, RT 01/RW 03, Kelurahan Sosromenduran",
          kota: "Yogyakarta",
          provinsi: "DI Yogyakarta",
          kodePos: "55271",
          nib: "2345678901234",
          nomorKontak: "+6281234567891",
          email: "batiknusantara@yahoo.com",
          website: "https://batiknusantara.co.id",
          fotoLogo: "",
          status: "aktif" as const,
        },
        {
          namaUsaha: "Kerajinan Bambu Asri",
          jenisUsaha: "Kerajinan",
          deskripsiUsaha:
            "Pengrajin bambu dengan berbagai produk seperti keranjang, lampu hias, furniture, dan souvenir dari bahan bambu berkualitas.",
          alamatLengkap: "Dusun Bambu Indah, RT 03/RW 02, Desa Wonokromo",
          kota: "Malang",
          provinsi: "Jawa Timur",
          kodePos: "65142",
          nib: "3456789012345",
          nomorKontak: "+6281234567892",
          email: "bambuasri@gmail.com",
          website: "https://bambuasri.com",
          fotoLogo: "",
          status: "aktif" as const,
        },
        {
          namaUsaha: "Kopi Arabika Gayo",
          jenisUsaha: "Minuman",
          deskripsiUsaha:
            "Produsen kopi arabika premium dari dataran tinggi Gayo dengan proses yang terjaga kualitasnya dari petani hingga konsumen.",
          alamatLengkap: "Desa Kebet, Kecamatan Linge, Kabupaten Aceh Tengah",
          kota: "Takengon",
          provinsi: "Aceh",
          kodePos: "24561",
          nib: "4567890123456",
          nomorKontak: "+6281234567893",
          email: "kopigayo@gmail.com",
          website: "https://kopiarabikagayo.com",
          fotoLogo: "",
          status: "aktif" as const,
        },
        {
          namaUsaha: "Tahu Sumedang Asli",
          jenisUsaha: "Makanan",
          deskripsiUsaha:
            "Produsen tahu Sumedang original dengan resep turun temurun dan kualitas terjamin untuk kepuasan pelanggan.",
          alamatLengkap: "Jl. Prabu Gajah Agung No. 45, Kotakaler",
          kota: "Sumedang",
          provinsi: "Jawa Barat",
          kodePos: "45326",
          nib: "5678901234567",
          nomorKontak: "+6281234567894",
          email: "tahusumedang@yahoo.com",
          website: "https://tahusumedangasli.com",
          fotoLogo: "",
          status: "aktif" as const,
        },
      ];

      for (const profileData of sampleProfiles) {
        const profile = ProfileStorageService.formDataToProfile(
          profileData as any
        );
        await ProfileStorageService.saveProfile(profile);
        console.log(
          `✅ Created profile: ${profile.namaUsaha} (ID: ${profile.id})`
        );
      }

      console.log("🌱 DataSeeder: Sample profiles created successfully");
    } catch (error) {
      console.error("🌱 DataSeeder: Error creating profiles:", error);
      throw error;
    }
  }

  static async seedProducts(): Promise<void> {
    try {
      console.log("🛍️ DataSeeder: Creating sample products...");

      // Get all profiles first to associate products
      const profiles = await ProfileStorageService.getAllProfiles();
      if (profiles.length === 0) {
        throw new Error("No profiles found. Please create profiles first.");
      }

      const sampleProducts = [
        {
          umkmId: profiles[0].id,
          nama: "Nasi Padang Spesial",
          kategori: "Makanan" as const,
          deskripsi:
            "Nasi Padang lengkap dengan rendang, ayam gulai, dan sayur nangka. Porsi melimpah dengan cita rasa autentik.",
          harga: 25000,
          stok: 50,
          satuan: "porsi",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[0].id,
          nama: "Rendang Daging Sapi",
          kategori: "Makanan" as const,
          deskripsi:
            "Rendang daging sapi dengan bumbu rempah tradisional, dimasak hingga empuk dan kaya rasa.",
          harga: 80000,
          stok: 20,
          satuan: "kg",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[1]?.id || profiles[0].id,
          nama: "Batik Tulis Motif Parang",
          kategori: "Fashion" as const,
          deskripsi:
            "Batik tulis premium dengan motif parang klasik, dibuat dengan pewarna alami dan teknik tradisional.",
          harga: 350000,
          stok: 15,
          satuan: "lembar",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[1]?.id || profiles[0].id,
          nama: "Kemeja Batik Kantor",
          kategori: "Fashion" as const,
          deskripsi:
            "Kemeja batik formal untuk kantor dengan desain modern dan bahan berkualitas tinggi.",
          harga: 180000,
          stok: 30,
          satuan: "buah",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[2]?.id || profiles[0].id,
          nama: "Keranjang Bambu Anyam",
          kategori: "Kerajinan" as const,
          deskripsi:
            "Keranjang bambu anyam handmade untuk keperluan rumah tangga, tahan lama dan ramah lingkungan.",
          harga: 45000,
          stok: 25,
          satuan: "buah",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[2]?.id || profiles[0].id,
          nama: "Lampu Hias Bambu",
          kategori: "Kerajinan" as const,
          deskripsi:
            "Lampu hias dari bambu dengan desain unik dan artistik, cocok untuk dekorasi rumah modern.",
          harga: 125000,
          stok: 12,
          satuan: "buah",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[3]?.id || profiles[0].id,
          nama: "Kopi Arabika Gayo Premium",
          kategori: "Minuman" as const,
          deskripsi:
            "Kopi arabika premium dari dataran tinggi Gayo dengan aroma dan rasa yang khas.",
          harga: 120000,
          stok: 40,
          satuan: "kg",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[3]?.id || profiles[0].id,
          nama: "Kopi Bubuk Halus",
          kategori: "Minuman" as const,
          deskripsi:
            "Kopi bubuk halus siap seduh dengan tingkat kematangan yang sempurna.",
          harga: 85000,
          stok: 60,
          satuan: "kg",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[4]?.id || profiles[0].id,
          nama: "Tahu Sumedang Original",
          kategori: "Makanan" as const,
          deskripsi:
            "Tahu Sumedang original dengan tekstur lembut di dalam dan renyah di luar.",
          harga: 15000,
          stok: 100,
          satuan: "kotak",
          foto: [""],
          isAktif: true,
        },
        {
          umkmId: profiles[4]?.id || profiles[0].id,
          nama: "Tahu Bulat Goreng",
          kategori: "Makanan" as const,
          deskripsi:
            "Tahu bulat goreng crispy dengan isian yang lezat, cocok untuk camilan.",
          harga: 12000,
          stok: 80,
          satuan: "kotak",
          foto: [""],
          isAktif: true,
        },
      ];

      for (const productData of sampleProducts) {
        const product: Product = {
          id: ProductStorageService.generateId(),
          tanggalDibuat: new Date(),
          tanggalDiperbarui: new Date(),
          ...productData,
        };

        await ProductStorageService.saveProduct(product);
        console.log(`✅ Created product: ${product.nama} (ID: ${product.id})`);
      }

      console.log("🛍️ DataSeeder: Sample products created successfully");
    } catch (error) {
      console.error("🛍️ DataSeeder: Error creating products:", error);
      throw error;
    }
  }

  static async seedAllData(): Promise<void> {
    try {
      console.log("🚀 DataSeeder: Starting complete data seeding...");

      // Clear existing data first
      await this.clearAllData();

      // Create profiles first
      await this.seedProfiles();

      // Then create products
      await this.seedProducts();

      console.log("🎉 DataSeeder: All sample data created successfully!");

      Alert.alert(
        "Berhasil! 🎉",
        "Data sample berhasil dibuat:\n\n• 5 Profil UMKM\n• 10 Produk marketplace\n\nSilakan cek tab Profile dan Marketplace untuk melihat data yang telah dibuat.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("🚀 DataSeeder: Error in complete seeding:", error);
      Alert.alert(
        "Error",
        `Gagal membuat data sample: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  }

  static async getDataStatus(): Promise<{
    profileCount: number;
    productCount: number;
    profileStats: any;
    productStats: any;
  }> {
    try {
      const profiles = await ProfileStorageService.getAllProfiles();
      const productStats = await ProductStorageService.getProductStatistics();

      return {
        profileCount: profiles.length,
        productCount: productStats.total,
        profileStats: {
          totalProfiles: profiles.length,
          totalProducts: productStats.total,
        },
        productStats,
      };
    } catch (error) {
      console.error("📊 DataSeeder: Error getting data status:", error);
      throw error;
    }
  }
}
