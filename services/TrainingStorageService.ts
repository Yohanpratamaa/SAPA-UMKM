import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Certificate,
  KategoriTraining,
  LevelTraining,
  Training,
  TrainingFormData,
  TrainingModule,
  TrainingProgress,
  TrainingSearchParams,
  TrainingStatistics,
} from "../types";

const STORAGE_KEY = "SAPA_UMKM_TRAININGS";
const PROGRESS_KEY = "SAPA_UMKM_TRAINING_PROGRESS";
const CERTIFICATE_KEY = "SAPA_UMKM_CERTIFICATES";

export class TrainingStorageService {
  // Training CRUD Operations
  static async saveTraining(training: Training): Promise<void> {
    try {
      const trainings = await this.getAllTrainings();
      const existingIndex = trainings.findIndex((t) => t.id === training.id);

      if (existingIndex >= 0) {
        trainings[existingIndex] = training;
      } else {
        trainings.push(training);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
      console.log("Training saved successfully:", training.id);
    } catch (error) {
      console.error("Error saving training:", error);
      throw new Error("Gagal menyimpan pelatihan");
    }
  }

  static async getAllTrainings(): Promise<Training[]> {
    try {
      const trainingsJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (trainingsJson) {
        const trainings = JSON.parse(trainingsJson);
        return trainings.map((training: any) => ({
          ...training,
          tanggalDibuat: new Date(training.tanggalDibuat),
          tanggalDiperbarui: new Date(training.tanggalDiperbarui),
          tanggalMulai: training.tanggalMulai
            ? new Date(training.tanggalMulai)
            : undefined,
          tanggalSelesai: training.tanggalSelesai
            ? new Date(training.tanggalSelesai)
            : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting trainings:", error);
      return [];
    }
  }

  static async getTrainingById(id: string): Promise<Training | null> {
    try {
      console.log("TrainingStorageService - Getting training by ID:", id);
      const trainings = await this.getAllTrainings();
      console.log(
        "TrainingStorageService - All trainings:",
        trainings.map((t) => ({ id: t.id, judul: t.judul }))
      );

      const training = trainings.find((t) => t.id === id);
      console.log("TrainingStorageService - Found training:", training);
      return training || null;
    } catch (error) {
      console.error("Error getting training by ID:", error);
      return null;
    }
  }

  static async deleteTraining(id: string): Promise<void> {
    try {
      const trainings = await this.getAllTrainings();
      const filteredTrainings = trainings.filter((t) => t.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(filteredTrainings)
      );
      console.log("Training deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting training:", error);
      throw new Error("Gagal menghapus pelatihan");
    }
  }

  // Search and Filter
  static async searchTrainings(
    params: TrainingSearchParams
  ): Promise<Training[]> {
    try {
      let trainings = await this.getAllTrainings();

      // Filter aktif saja
      trainings = trainings.filter((t) => t.isAktif);

      // Text search
      if (params.query) {
        const lowercaseQuery = params.query.toLowerCase();
        trainings = trainings.filter(
          (training) =>
            training.judul.toLowerCase().includes(lowercaseQuery) ||
            training.deskripsi.toLowerCase().includes(lowercaseQuery) ||
            training.instruktur.toLowerCase().includes(lowercaseQuery) ||
            training.tags.some((tag) =>
              tag.toLowerCase().includes(lowercaseQuery)
            ) ||
            training.kategori.toLowerCase().includes(lowercaseQuery)
        );
      }

      // Apply filters
      if (params.filter) {
        const { filter } = params;

        if (filter.kategori) {
          trainings = trainings.filter((t) => t.kategori === filter.kategori);
        }

        if (filter.tipeTraining) {
          trainings = trainings.filter(
            (t) => t.tipeTraining === filter.tipeTraining
          );
        }

        if (filter.level) {
          trainings = trainings.filter((t) => t.level === filter.level);
        }

        if (filter.hargaMin !== undefined) {
          trainings = trainings.filter((t) => t.harga >= filter.hargaMin!);
        }

        if (filter.hargaMax !== undefined) {
          trainings = trainings.filter((t) => t.harga <= filter.hargaMax!);
        }

        if (filter.gratisOnly) {
          trainings = trainings.filter((t) => t.harga === 0);
        }

        if (filter.sertifikatTersedia) {
          trainings = trainings.filter((t) => t.sertifikatTersedia);
        }

        if (filter.ratingMin !== undefined) {
          trainings = trainings.filter((t) => t.rating >= filter.ratingMin!);
        }
      }

      // Sorting
      if (params.sortBy) {
        switch (params.sortBy) {
          case "terbaru":
            trainings.sort(
              (a, b) => b.tanggalDibuat.getTime() - a.tanggalDibuat.getTime()
            );
            break;
          case "terpopuler":
            trainings.sort((a, b) => b.totalPeserta - a.totalPeserta);
            break;
          case "rating":
            trainings.sort((a, b) => b.rating - a.rating);
            break;
          case "harga":
            trainings.sort((a, b) => a.harga - b.harga);
            break;
        }
      }

      // Pagination
      if (params.page && params.limit) {
        const startIndex = (params.page - 1) * params.limit;
        trainings = trainings.slice(startIndex, startIndex + params.limit);
      }

      return trainings;
    } catch (error) {
      console.error("Error searching trainings:", error);
      return [];
    }
  }

  // Training Progress Management
  static async saveProgress(progress: TrainingProgress): Promise<void> {
    try {
      const allProgress = await this.getAllProgress();
      const existingIndex = allProgress.findIndex(
        (p) =>
          p.trainingId === progress.trainingId && p.userId === progress.userId
      );

      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }

      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      console.log("Training progress saved:", progress.id);
    } catch (error) {
      console.error("Error saving progress:", error);
      throw new Error("Gagal menyimpan progress pelatihan");
    }
  }

  static async createProgress(
    progressData: Omit<TrainingProgress, "id">
  ): Promise<TrainingProgress> {
    try {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const progress: TrainingProgress = { ...progressData, id };
      await this.saveProgress(progress);
      return progress;
    } catch (error) {
      console.error("Error creating progress:", error);
      throw new Error("Gagal membuat progress pelatihan");
    }
  }

  static async getAllProgress(): Promise<TrainingProgress[]> {
    try {
      const progressJson = await AsyncStorage.getItem(PROGRESS_KEY);
      if (progressJson) {
        const progress = JSON.parse(progressJson);
        return progress.map((p: any) => ({
          ...p,
          waktuMulai: new Date(p.waktuMulai),
          waktuTerakhirAkses: new Date(p.waktuTerakhirAkses),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting progress:", error);
      return [];
    }
  }

  static async getProgressByUser(userId: string): Promise<TrainingProgress[]> {
    try {
      const allProgress = await this.getAllProgress();
      return allProgress.filter((p) => p.userId === userId);
    } catch (error) {
      console.error("Error getting user progress:", error);
      return [];
    }
  }

  static async getProgressByTraining(
    trainingId: string,
    userId: string
  ): Promise<TrainingProgress | null> {
    try {
      const allProgress = await this.getAllProgress();
      return (
        allProgress.find(
          (p) => p.trainingId === trainingId && p.userId === userId
        ) || null
      );
    } catch (error) {
      console.error("Error getting training progress:", error);
      return null;
    }
  }

  static async getTrainingProgress(
    userId: string,
    trainingId: string
  ): Promise<TrainingProgress | null> {
    return this.getProgressByTraining(trainingId, userId);
  }

  // Certificate Management
  static async saveCertificate(certificate: Certificate): Promise<void> {
    try {
      const certificates = await this.getAllCertificates();
      const existingIndex = certificates.findIndex(
        (c) => c.id === certificate.id
      );

      if (existingIndex >= 0) {
        certificates[existingIndex] = certificate;
      } else {
        certificates.push(certificate);
      }

      await AsyncStorage.setItem(CERTIFICATE_KEY, JSON.stringify(certificates));
      console.log("Certificate saved:", certificate.id);
    } catch (error) {
      console.error("Error saving certificate:", error);
      throw new Error("Gagal menyimpan sertifikat");
    }
  }

  static async createCertificate(
    certificateData: Omit<Certificate, "id">
  ): Promise<Certificate> {
    try {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const certificate: Certificate = { ...certificateData, id };
      await this.saveCertificate(certificate);
      return certificate;
    } catch (error) {
      console.error("Error creating certificate:", error);
      throw new Error("Gagal membuat sertifikat");
    }
  }

  static async getAllCertificates(): Promise<Certificate[]> {
    try {
      const certificatesJson = await AsyncStorage.getItem(CERTIFICATE_KEY);
      if (certificatesJson) {
        const certificates = JSON.parse(certificatesJson);
        return certificates.map((cert: any) => ({
          ...cert,
          tanggalSelesai: new Date(cert.tanggalSelesai),
          tanggalTerbit: new Date(cert.tanggalTerbit),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting certificates:", error);
      return [];
    }
  }

  static async getCertificatesByUser(userId: string): Promise<Certificate[]> {
    try {
      const allCertificates = await this.getAllCertificates();
      return allCertificates.filter((c) => c.userId === userId);
    } catch (error) {
      console.error("Error getting user certificates:", error);
      return [];
    }
  }

  static async getCertificate(
    userId: string,
    trainingId: string
  ): Promise<Certificate | null> {
    try {
      const allCertificates = await this.getAllCertificates();
      return (
        allCertificates.find(
          (c) => c.userId === userId && c.trainingId === trainingId
        ) || null
      );
    } catch (error) {
      console.error("Error getting certificate:", error);
      return null;
    }
  }

  // Statistics
  static async getTrainingStatistics(): Promise<TrainingStatistics> {
    try {
      const trainings = await this.getAllTrainings();
      const aktif = trainings.filter((t) => t.isAktif).length;
      const nonAktif = trainings.filter((t) => !t.isAktif).length;
      const gratis = trainings.filter((t) => t.harga === 0).length;
      const berbayar = trainings.filter((t) => t.harga > 0).length;

      const kategoriStats: { [key in KategoriTraining]: number } = {} as any;
      Object.values(KategoriTraining).forEach((kategori) => {
        kategoriStats[kategori] = trainings.filter(
          (t) => t.kategori === kategori
        ).length;
      });

      const levelStats: { [key in LevelTraining]: number } = {} as any;
      Object.values(LevelTraining).forEach((level) => {
        levelStats[level] = trainings.filter((t) => t.level === level).length;
      });

      const totalRating = trainings.reduce((sum, t) => sum + t.rating, 0);
      const rataRataRating =
        trainings.length > 0 ? totalRating / trainings.length : 0;

      const totalPeserta = trainings.reduce(
        (sum, t) => sum + t.totalPeserta,
        0
      );

      return {
        total: trainings.length,
        aktif,
        nonAktif,
        gratis,
        berbayar,
        kategoriStats,
        levelStats,
        rataRataRating,
        totalPeserta,
      };
    } catch (error) {
      console.error("Error getting training statistics:", error);
      return {
        total: 0,
        aktif: 0,
        nonAktif: 0,
        gratis: 0,
        berbayar: 0,
        kategoriStats: {} as any,
        levelStats: {} as any,
        rataRataRating: 0,
        totalPeserta: 0,
      };
    }
  }

  // Utility Functions
  static formDataToTraining(
    formData: TrainingFormData,
    existingId?: string
  ): Training {
    const now = new Date();
    const id =
      existingId ||
      `training_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate modules with IDs
    const modules: TrainingModule[] = formData.modules.map((module, index) => ({
      ...module,
      id: `module_${id}_${index + 1}`,
    }));

    return {
      id,
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      thumbnail: formData.thumbnail,
      kategori: formData.kategori,
      tipeTraining: formData.tipeTraining,
      level: formData.level,
      durasi: formData.durasi,
      harga: formData.harga,
      instruktur: formData.instruktur,
      rating: 0, // Initial rating
      totalPeserta: 0, // Initial participants
      isAktif: true,
      modules,
      prerequisites: formData.prerequisites,
      tags: formData.tags,
      tanggalDibuat: now,
      tanggalDiperbarui: now,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      sertifikatTersedia: formData.sertifikatTersedia,
      videoUrl: formData.videoUrl,
      materiUrl: formData.materiUrl,
    };
  }

  static trainingToFormData(training: Training): TrainingFormData {
    return {
      judul: training.judul,
      deskripsi: training.deskripsi,
      thumbnail: training.thumbnail,
      kategori: training.kategori,
      tipeTraining: training.tipeTraining,
      level: training.level,
      durasi: training.durasi,
      harga: training.harga,
      instruktur: training.instruktur,
      prerequisites: training.prerequisites || [],
      tags: training.tags,
      tanggalMulai: training.tanggalMulai,
      tanggalSelesai: training.tanggalSelesai,
      sertifikatTersedia: training.sertifikatTersedia,
      videoUrl: training.videoUrl,
      materiUrl: training.materiUrl || [],
      modules: training.modules.map(({ id, isSelesai, ...module }) => module),
    };
  }

  static formatPrice(price: number): string {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} menit`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} jam`;
    }

    return `${hours} jam ${remainingMinutes} menit`;
  }

  static generateCertificateNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp}-${random}`;
  }
}
