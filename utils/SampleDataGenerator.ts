import { ProductStorageService } from "../services/ProductStorageService";
import { ProfileStorageService } from "../services/ProfileStorageService";
import { Product } from "../types/product";
import { UMKMProfile } from "../types/profile";

export class SampleDataGenerator {
  // Sample UMKM Profiles Data
  private static sampleProfiles: Omit<UMKMProfile, "id" | "tanggalDaftar">[] = [
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
      website: "",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Digital Creative Studio",
      jenisUsaha: "Teknologi",
      deskripsiUsaha:
        "Jasa pembuatan website, aplikasi mobile, desain grafis, dan digital marketing untuk UMKM dan perusahaan kecil.",
      alamatLengkap: "Ruko Techno Park Blok C No. 12, RT 05/RW 08",
      kota: "Surabaya",
      provinsi: "Jawa Timur",
      kodePos: "60115",
      nib: "4567890123456",
      nomorKontak: "+6281234567893",
      email: "info@digitalcreative.id",
      website: "https://digitalcreative.id",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Tani Organik Sejahtera",
      jenisUsaha: "Pertanian",
      deskripsiUsaha:
        "Petani organik yang memproduksi sayuran dan buah-buahan segar tanpa pestimik. Melayani pasar lokal dan ekspor.",
      alamatLengkap: "Jl. Sawah Hijau No. 25, RT 04/RW 06, Desa Sukamaju",
      kota: "Bogor",
      provinsi: "Jawa Barat",
      kodePos: "16710",
      nib: "5678901234567",
      nomorKontak: "+6281234567894",
      email: "taniorganik@gmail.com",
      website: "",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Service AC Bersama",
      jenisUsaha: "Jasa",
      deskripsiUsaha:
        "Jasa perbaikan dan maintenance AC untuk rumah tangga dan komersial. Melayani 24 jam dengan teknisi berpengalaman.",
      alamatLengkap:
        "Jl. Industri Raya No. 45, RT 07/RW 04, Kelurahan Cikarang",
      kota: "Bekasi",
      provinsi: "Jawa Barat",
      kodePos: "17530",
      nib: "6789012345678",
      nomorKontak: "+6281234567895",
      email: "serviceac@gmail.com",
      website: "",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Toko Kelontong Berkah",
      jenisUsaha: "Perdagangan",
      deskripsiUsaha:
        "Toko kelontong lengkap yang menyediakan kebutuhan sehari-hari, sembako, dan produk rumah tangga dengan harga terjangkau.",
      alamatLengkap: "Jl. Pasar Lama No. 33, RT 02/RW 01, Kelurahan Karawang",
      kota: "Karawang",
      provinsi: "Jawa Barat",
      kodePos: "41311",
      nib: "7890123456789",
      nomorKontak: "+6281234567896",
      email: "tokokelontongberkah@gmail.com",
      website: "",
      fotoLogo: "",
      status: "pending" as const,
    },
    {
      namaUsaha: "Catering Mama Rosa",
      jenisUsaha: "Kuliner",
      deskripsiUsaha:
        "Jasa catering untuk acara pernikahan, meeting, dan event dengan menu Indonesia dan internasional. Higenis dan halal.",
      alamatLengkap: "Komplek Villa Indah Blok D No. 18, RT 03/RW 09",
      kota: "Tangerang",
      provinsi: "Banten",
      kodePos: "15117",
      nib: "8901234567890",
      nomorKontak: "+6281234567897",
      email: "cateringmamarosa@gmail.com",
      website: "https://mamarosa-catering.com",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Klinik Kecantikan Aura",
      jenisUsaha: "Jasa",
      deskripsiUsaha:
        "Klinik kecantikan dengan treatment lengkap facial, skincare, dan perawatan tubuh menggunakan produk berkualitas premium.",
      alamatLengkap: "Jl. Sudirman No. 156, RT 06/RW 03, Kelurahan Menteng",
      kota: "Jakarta Pusat",
      provinsi: "DKI Jakarta",
      kodePos: "10310",
      nib: "9012345678901",
      nomorKontak: "+6281234567898",
      email: "klinikauraskincare@gmail.com",
      website: "https://auraskincare.id",
      fotoLogo: "",
      status: "aktif" as const,
    },
    {
      namaUsaha: "Mebel Jati Lestari",
      jenisUsaha: "Kerajinan",
      deskripsiUsaha:
        "Produsen mebel kayu jati dengan desain custom dan kualitas ekspor. Melayani furniture rumah dan kantor.",
      alamatLengkap: "Jl. Industri Kayu No. 77, RT 05/RW 07, Desa Tegalweru",
      kota: "Jepara",
      provinsi: "Jawa Tengah",
      kodePos: "59464",
      nib: "0123456789012",
      nomorKontak: "+6281234567899",
      email: "mebeljatilestari@yahoo.com",
      website: "",
      fotoLogo: "",
      status: "pending" as const,
    },
  ];

  // Sample Products Data
  private static sampleProducts: {
    nama: string;
    deskripsi: string;
    harga: number;
    kategori: string;
    stok: number;
    satuan: string;
    tags: string[];
    umkmIndex: number; // Index of UMKM profile
  }[] = [
    // Warung Makan Bu Sari Products
    {
      nama: "Rendang Daging Sapi",
      deskripsi:
        "Rendang daging sapi asli Padang dengan bumbu rempah pilihan. Dimasak dengan santan kelapa segar dan daging sapi premium.",
      harga: 45000,
      kategori: "Makanan",
      stok: 20,
      satuan: "porsi",
      tags: ["rendang", "padang", "daging", "halal", "tradisional"],
      umkmIndex: 0,
    },
    {
      nama: "Gulai Ayam Kampung",
      deskripsi:
        "Gulai ayam kampung dengan kuah santan yang gurih dan rempah yang meresap. Menggunakan ayam kampung segar.",
      harga: 35000,
      kategori: "Makanan",
      stok: 15,
      satuan: "porsi",
      tags: ["gulai", "ayam", "kampung", "santan", "padang"],
      umkmIndex: 0,
    },
    {
      nama: "Es Teh Manis",
      deskripsi:
        "Es teh manis segar dengan gula aren asli. Minuman pendamping yang cocok untuk hidangan Padang.",
      harga: 8000,
      kategori: "Minuman",
      stok: 50,
      satuan: "gelas",
      tags: ["es teh", "manis", "segar", "gula aren"],
      umkmIndex: 0,
    },

    // Batik Nusantara Products
    {
      nama: "Kemeja Batik Motif Parang",
      deskripsi:
        "Kemeja batik pria dengan motif parang klasik. Bahan katun premium, nyaman dipakai untuk acara formal maupun casual.",
      harga: 275000,
      kategori: "Fashion",
      stok: 25,
      satuan: "pcs",
      tags: ["batik", "kemeja", "parang", "pria", "formal"],
      umkmIndex: 1,
    },
    {
      nama: "Blouse Batik Wanita Modern",
      deskripsi:
        "Blouse batik wanita dengan cutting modern dan motif kontemporer. Cocok untuk kerja dan acara semi formal.",
      harga: 225000,
      kategori: "Fashion",
      stok: 30,
      satuan: "pcs",
      tags: ["batik", "blouse", "wanita", "modern", "kerja"],
      umkmIndex: 1,
    },
    {
      nama: "Kain Batik Tulis Yogya",
      deskripsi:
        "Kain batik tulis asli Yogyakarta dengan motif tradisional. Bahan berkualitas tinggi untuk keperluan seragam atau fashion.",
      harga: 450000,
      kategori: "Fashion",
      stok: 12,
      satuan: "meter",
      tags: ["batik", "tulis", "yogya", "kain", "tradisional"],
      umkmIndex: 1,
    },

    // Kerajinan Bambu Asri Products
    {
      nama: "Keranjang Bambu Multifungsi",
      deskripsi:
        "Keranjang bambu ukuran medium yang dapat digunakan untuk penyimpanan buah, sayuran, atau barang-barang rumah tangga.",
      harga: 85000,
      kategori: "Kerajinan",
      stok: 18,
      satuan: "pcs",
      tags: ["keranjang", "bambu", "multifungsi", "penyimpanan", "natural"],
      umkmIndex: 2,
    },
    {
      nama: "Lampu Hias Bambu Minimalis",
      deskripsi:
        "Lampu hias dari bambu dengan desain minimalis modern. Cocok untuk dekorasi rumah atau kafe dengan nuansa natural.",
      harga: 125000,
      kategori: "Furniture",
      stok: 10,
      satuan: "pcs",
      tags: ["lampu", "bambu", "minimalis", "dekorasi", "natural"],
      umkmIndex: 2,
    },

    // Digital Creative Studio Products
    {
      nama: "Paket Website UMKM",
      deskripsi:
        "Paket pembuatan website untuk UMKM dengan desain responsive, SEO friendly, dan maintenance 6 bulan gratis.",
      harga: 2500000,
      kategori: "Jasa",
      stok: 5,
      satuan: "paket",
      tags: ["website", "umkm", "responsive", "seo", "maintenance"],
      umkmIndex: 3,
    },
    {
      nama: "Jasa Desain Logo & Branding",
      deskripsi:
        "Jasa desain logo profesional lengkap dengan brand guidelines dan aplikasi pada berbagai media promosi.",
      harga: 750000,
      kategori: "Jasa",
      stok: 10,
      satuan: "paket",
      tags: ["logo", "branding", "desain", "profesional", "guidelines"],
      umkmIndex: 3,
    },

    // Tani Organik Sejahtera Products
    {
      nama: "Sayuran Organik Mix 1kg",
      deskripsi:
        "Paket sayuran organik campuran berisi kangkung, bayam, sawi, dan tomat. Segar dipetik langsung dari kebun.",
      harga: 35000,
      kategori: "Makanan",
      stok: 40,
      satuan: "kg",
      tags: ["sayuran", "organik", "segar", "kangkung", "bayam"],
      umkmIndex: 4,
    },
    {
      nama: "Buah Naga Organik",
      deskripsi:
        "Buah naga merah organik dengan rasa manis alami. Dipetik saat matang optimal untuk kualitas terbaik.",
      harga: 55000,
      kategori: "Makanan",
      stok: 25,
      satuan: "kg",
      tags: ["buah naga", "organik", "manis", "segar", "premium"],
      umkmIndex: 4,
    },

    // Service AC Bersama Products
    {
      nama: "Service AC Rutin",
      deskripsi:
        "Layanan service AC rutin meliputi pembersihan filter, cek freon, dan maintenance untuk performa optimal AC Anda.",
      harga: 150000,
      kategori: "Jasa",
      stok: 20,
      satuan: "unit",
      tags: ["service", "ac", "rutin", "maintenance", "pembersihan"],
      umkmIndex: 5,
    },

    // Catering Mama Rosa Products
    {
      nama: "Paket Catering Nasi Box",
      deskripsi:
        "Paket nasi box untuk acara meeting atau gathering. Berisi nasi, lauk, sayur, dan buah. Minimum order 20 box.",
      harga: 25000,
      kategori: "Makanan",
      stok: 100,
      satuan: "box",
      tags: ["catering", "nasi box", "meeting", "lauk", "sayur"],
      umkmIndex: 7,
    },
    {
      nama: "Paket Prasmanan Wedding",
      deskripsi:
        "Paket prasmanan lengkap untuk acara pernikahan dengan menu Indonesia dan internasional. Melayani 100-500 tamu.",
      harga: 85000,
      kategori: "Makanan",
      stok: 10,
      satuan: "porsi",
      tags: ["catering", "wedding", "prasmanan", "indonesia", "internasional"],
      umkmIndex: 7,
    },

    // Klinik Kecantikan Aura Products
    {
      nama: "Facial Brightening Premium",
      deskripsi:
        "Treatment facial untuk mencerahkan wajah dengan serum vitamin C dan teknologi terbaru. Hasil terlihat langsung.",
      harga: 350000,
      kategori: "Jasa",
      stok: 15,
      satuan: "sesi",
      tags: ["facial", "brightening", "vitamin c", "premium", "kecantikan"],
      umkmIndex: 8,
    },
    {
      nama: "Body Scrub Luxury Spa",
      deskripsi:
        "Perawatan body scrub dengan bahan natural untuk mengangkat sel kulit mati dan melembabkan kulit.",
      harga: 225000,
      kategori: "Jasa",
      stok: 20,
      satuan: "sesi",
      tags: ["body scrub", "spa", "natural", "luxury", "perawatan"],
      umkmIndex: 8,
    },

    // Mebel Jati Lestari Products
    {
      nama: "Meja Makan Jati Minimalis",
      deskripsi:
        "Meja makan kayu jati solid ukuran 6 kursi dengan desain minimalis modern. Finishing natural dan tahan lama.",
      harga: 4500000,
      kategori: "Furniture",
      stok: 5,
      satuan: "set",
      tags: ["meja makan", "jati", "minimalis", "6 kursi", "solid"],
      umkmIndex: 9,
    },
    {
      nama: "Lemari Pakaian Jati Custom",
      deskripsi:
        "Lemari pakaian kayu jati dengan desain custom sesuai kebutuhan. 3 pintu dengan laci dan gantungan baju.",
      harga: 6750000,
      kategori: "Furniture",
      stok: 3,
      satuan: "unit",
      tags: ["lemari", "jati", "custom", "3 pintu", "pakaian"],
      umkmIndex: 9,
    },
  ];

  // Generate and save sample UMKM profiles
  static async generateSampleProfiles(): Promise<void> {
    try {
      console.log("🏭 Generating sample UMKM profiles...");

      const existingProfiles = await ProfileStorageService.getAllProfiles();
      if (existingProfiles.length > 0) {
        console.log("⚠️ Profiles already exist. Skipping generation.");
        return;
      }

      for (const profileData of this.sampleProfiles) {
        const profile: UMKMProfile = {
          ...profileData,
          id: ProfileStorageService.generateId(),
          tanggalDaftar: new Date(),
        };

        await ProfileStorageService.saveProfile(profile);
        console.log(`✅ Created profile: ${profile.namaUsaha}`);
      }

      console.log(
        `🎉 Successfully generated ${this.sampleProfiles.length} UMKM profiles!`
      );
    } catch (error) {
      console.error("❌ Error generating sample profiles:", error);
      throw error;
    }
  }

  // Generate and save sample products
  static async generateSampleProducts(): Promise<void> {
    try {
      console.log("🛍️ Generating sample products...");

      const existingProducts = await ProductStorageService.getAllProducts();
      if (existingProducts.length > 0) {
        console.log("⚠️ Products already exist. Skipping generation.");
        return;
      }

      // Get all profiles to map products to UMKMs
      const profiles = await ProfileStorageService.getAllProfiles();
      if (profiles.length === 0) {
        console.log(
          "⚠️ No UMKM profiles found. Please generate profiles first."
        );
        return;
      }

      for (const productData of this.sampleProducts) {
        const umkmProfile = profiles[productData.umkmIndex];
        if (!umkmProfile) {
          console.log(
            `⚠️ UMKM profile not found for index ${productData.umkmIndex}`
          );
          continue;
        }

        const product: Product = {
          id: ProductStorageService.generateId(),
          umkmId: umkmProfile.id,
          nama: productData.nama,
          deskripsi: productData.deskripsi,
          harga: productData.harga,
          kategori: productData.kategori as any,
          foto: [], // Empty for now, can be filled later
          stok: productData.stok,
          satuan: productData.satuan,
          tags: productData.tags,
          isAktif: true,
          tanggalDibuat: new Date(),
          tanggalDiperbarui: new Date(),
        };

        await ProductStorageService.saveProduct(product);
        console.log(
          `✅ Created product: ${product.nama} for ${umkmProfile.namaUsaha}`
        );
      }

      console.log(
        `🎉 Successfully generated ${this.sampleProducts.length} products!`
      );
    } catch (error) {
      console.error("❌ Error generating sample products:", error);
      throw error;
    }
  }

  // Generate both profiles and products
  static async generateAllSampleData(): Promise<void> {
    try {
      console.log("🚀 Starting sample data generation...");

      await this.generateSampleProfiles();
      await this.generateSampleProducts();

      console.log("✨ All sample data generated successfully!");
    } catch (error) {
      console.error("❌ Error generating sample data:", error);
      throw error;
    }
  }

  // Clear all data (for testing purposes)
  static async clearAllData(): Promise<void> {
    try {
      console.log("🗑️ Clearing all data...");

      // Clear all profiles and products
      const profiles = await ProfileStorageService.getAllProfiles();
      const products = await ProductStorageService.getAllProducts();

      for (const profile of profiles) {
        await ProfileStorageService.deleteProfile(profile.id);
      }

      for (const product of products) {
        await ProductStorageService.deleteProduct(product.id);
      }

      console.log("✅ All data cleared successfully!");
    } catch (error) {
      console.error("❌ Error clearing data:", error);
      throw error;
    }
  }

  // Get summary of generated data
  static async getDataSummary(): Promise<{
    profileCount: number;
    productCount: number;
    profilesByJenis: { [key: string]: number };
    productsByKategori: { [key: string]: number };
  }> {
    try {
      const profiles = await ProfileStorageService.getAllProfiles();
      const products = await ProductStorageService.getAllProducts();

      const profilesByJenis: { [key: string]: number } = {};
      const productsByKategori: { [key: string]: number } = {};

      profiles.forEach((profile) => {
        profilesByJenis[profile.jenisUsaha] =
          (profilesByJenis[profile.jenisUsaha] || 0) + 1;
      });

      products.forEach((product) => {
        productsByKategori[product.kategori] =
          (productsByKategori[product.kategori] || 0) + 1;
      });

      return {
        profileCount: profiles.length,
        productCount: products.length,
        profilesByJenis,
        productsByKategori,
      };
    } catch (error) {
      console.error("❌ Error getting data summary:", error);
      throw error;
    }
  }
}
