import { Training, TrainingFormData, TrainingSearchParams } from "../types";
import { apiClient } from "./api";
import { API_CONFIG } from "./api/config";

export class TrainingService {
  /**
   * Get all trainings
   */
  static async getAllTrainings(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    kategori?: string;
    level?: string;
    status?: string;
    format?: string;
  }): Promise<Training[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.perPage)
        queryParams.append("per_page", params.perPage.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.kategori) queryParams.append("kategori", params.kategori);
      if (params?.level) queryParams.append("level", params.level);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.format) queryParams.append("format", params.format);

      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}?${queryParams.toString()}`,
        {
          method: "GET",
          requireAuth: false,
        }
      );

      if (response.success && response.data) {
        return response.data.map(this.transformTraining);
      }
      return [];
    } catch (error) {
      console.error("Error getting trainings:", error);
      return [];
    }
  }

  /**
   * Get training by ID
   */
  static async getTrainingById(id: string): Promise<Training | null> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}/${id}`,
        {
          method: "GET",
          requireAuth: false,
        }
      );

      if (response.success && response.data) {
        return this.transformTraining(response.data);
      }
      return null;
    } catch (error) {
      console.error("Error getting training by ID:", error);
      return null;
    }
  }

  /**
   * Save training (Create or Update)
   */
  static async saveTraining(
    training: TrainingFormData | Training
  ): Promise<void> {
    try {
      const isUpdate = "id" in training && training.id;
      const endpoint = isUpdate
        ? `${API_CONFIG.ENDPOINTS.TRAININGS}/${training.id}`
        : API_CONFIG.ENDPOINTS.TRAININGS;
      const method = isUpdate ? "PUT" : "POST";

      // Transform frontend data to backend format
      const payload = {
        judul: training.judul,
        deskripsi: training.deskripsi,
        kategori: training.kategori,
        level: training.level,
        instruktur: training.instruktur,
        tanggalMulai: training.tanggalMulai?.toISOString(),
        tanggalSelesai: training.tanggalSelesai?.toISOString(),
        durasi: String(training.durasi),
        formatPelatihan: (training as any).tipeTraining,
        harga: Number(training.harga),
        isFree: Number(training.harga) === 0,
        materi: JSON.stringify((training as any).modules || []),
        thumbnail: training.thumbnail,
        videoPreview: (training as any).videoUrl,
        status: (training as any).isAktif ? "ongoing" : "upcoming",
      };

      const response = await apiClient.request(endpoint, {
        method,
        body: payload,
        requireAuth: true,
      });

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan pelatihan");
      }
    } catch (error) {
      console.error("Error saving training:", error);
      throw error;
    }
  }

  /**
   * Delete training
   */
  static async deleteTraining(id: string): Promise<void> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}/${id}`,
        {
          method: "DELETE",
          requireAuth: true,
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus pelatihan");
      }
    } catch (error) {
      console.error("Error deleting training:", error);
      throw error;
    }
  }

  /**
   * Search trainings (Alias for getAllTrainings with params)
   */
  static async searchTrainings(
    params: TrainingSearchParams
  ): Promise<Training[]> {
    return this.getAllTrainings(params);
  }

  /**
   * Get training statistics
   */
  static async getTrainingStatistics(): Promise<{
    total: number;
    aktif: number;
    nonAktif: number;
    kategoriStats: { [key: string]: number };
  }> {
    try {
      const trainings = await this.getAllTrainings();
      const stats = {
        total: trainings.length,
        aktif: trainings.filter((t) => t.isAktif).length,
        nonAktif: trainings.filter((t) => !t.isAktif).length,
        kategoriStats: {} as { [key: string]: number },
      };

      trainings.forEach((t) => {
        stats.kategoriStats[t.kategori] =
          (stats.kategoriStats[t.kategori] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error getting training statistics:", error);
      return { total: 0, aktif: 0, nonAktif: 0, kategoriStats: {} };
    }
  }

  /**
   * Enroll in a training
   */
  static async enrollTraining(trainingId: string): Promise<boolean> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}/${trainingId}/enroll`,
        {
          method: "POST",
          requireAuth: true,
        }
      );

      return response.success;
    } catch (error) {
      console.error("Error enrolling in training:", error);
      return false;
    }
  }

  /**
   * Get my enrollments
   */
  static async getMyEnrollments(): Promise<any[]> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}/my-enrollments`,
        {
          method: "GET",
          requireAuth: true,
        }
      );

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error getting my enrollments:", error);
      return [];
    }
  }

  /**
   * Get training categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.request(
        `${API_CONFIG.ENDPOINTS.TRAININGS}/categories`,
        {
          method: "GET",
          requireAuth: false,
        }
      );

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  }

  /**
   * Format price to IDR currency
   */
  static formatPrice(price: number): string {
    if (price === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Format duration to readable string
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} Menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} Jam`;
    return `${hours} Jam ${remainingMinutes} Menit`;
  }

  /**
   * Convert Training object to TrainingFormData
   */
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
      tags: training.tags || [],
      tanggalMulai: training.tanggalMulai,
      tanggalSelesai: training.tanggalSelesai,
      sertifikatTersedia: training.sertifikatTersedia,
      videoUrl: training.videoUrl,
      materiUrl: training.materiUrl || [],
      modules: training.modules.map((m) => {
        const { id, isSelesai, ...rest } = m;
        return rest;
      }),
    };
  }

  /**
   * Convert TrainingFormData to Training object
   */
  static formDataToTraining(formData: TrainingFormData): Training {
    return {
      id: "", // Will be generated by backend or ignored on create
      ...formData,
      rating: 0,
      totalPeserta: 0,
      isAktif: true,
      modules: formData.modules.map((m, index) => ({
        ...m,
        id: `module-${Date.now()}-${index}`, // Temporary ID
        isSelesai: false,
      })),
      tanggalDibuat: new Date(),
      tanggalDiperbarui: new Date(),
    };
  }

  // Helper to transform backend data to frontend model
  private static transformTraining(data: any): Training {
    let modules = [];
    try {
      if (data.materi) {
        modules =
          typeof data.materi === "string"
            ? JSON.parse(data.materi)
            : data.materi;
      }
    } catch (e) {
      console.warn("Error parsing training modules:", e);
    }

    return {
      id: String(data.id || ""),
      judul: data.judul || "Tanpa Judul",
      deskripsi: data.deskripsi || "",
      thumbnail: data.thumbnail || "https://via.placeholder.com/400x200",
      kategori: data.kategori || "Bisnis",
      tipeTraining: data.formatPelatihan || "Video", // Map formatPelatihan to tipeTraining
      level: data.level || "Pemula",
      durasi: parseInt(data.durasi) || 0, // Backend durasi is string, frontend is number (minutes)
      harga: Number(data.harga) || 0,
      instruktur: data.instruktur || "SAPA UMKM",
      rating: Number(data.rating) || 0,
      totalPeserta: Number(data.pesertaTerdaftar) || 0,
      isAktif: data.status === "upcoming" || data.status === "ongoing",
      modules: Array.isArray(modules) ? modules : [],
      prerequisites: [], // Backend doesn't have this explicitly, maybe in 'syarat'?
      tags: [], // Backend doesn't have tags
      tanggalDibuat: data.createdAt ? new Date(data.createdAt) : new Date(),
      tanggalDiperbarui: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      tanggalMulai: data.tanggalMulai ? new Date(data.tanggalMulai) : undefined,
      tanggalSelesai: data.tanggalSelesai
        ? new Date(data.tanggalSelesai)
        : undefined,
      sertifikatTersedia: true, // Default to true or check backend
      videoUrl: data.videoPreview,
      materiUrl: [], // Map from materi if needed
    };
  }
}
