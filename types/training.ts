export interface Training {
  id: string;
  judul: string;
  deskripsi: string;
  thumbnail: string;
  kategori: KategoriTraining;
  tipeTraining: TipeTraining;
  level: LevelTraining;
  durasi: number; // dalam menit
  harga: number; // 0 untuk gratis
  instruktur: string;
  rating: number;
  totalPeserta: number;
  isAktif: boolean;
  modules: TrainingModule[];
  prerequisites?: string[];
  tags: string[];
  tanggalDibuat: Date;
  tanggalDiperbarui: Date;
  tanggalMulai?: Date;
  tanggalSelesai?: Date;
  sertifikatTersedia: boolean;
  videoUrl?: string;
  materiUrl?: string[];
}

export interface TrainingModule {
  id: string;
  judul: string;
  deskripsi: string;
  durasi: number; // dalam menit
  urutan: number;
  tipeKonten: TipeKonten;
  kontenUrl: string;
  isGratis: boolean;
  isSelesai?: boolean;
}

export interface Certificate {
  id: string;
  trainingId: string;
  userId: string;
  namaLengkap: string;
  judulTraining: string;
  instruktur: string;
  tanggalSelesai: Date;
  tanggalTerbit: Date;
  nomorSertifikat: string;
  nilaiAkhir: number;
  templateId: string;
  downloadUrl?: string;
  isValid: boolean;
}

export interface TrainingProgress {
  id: string;
  trainingId: string;
  userId: string;
  progressPersentase: number;
  modulesSelesai: string[];
  waktuMulai: Date;
  waktuTerakhirAkses: Date;
  nilaiQuiz?: { [moduleId: string]: number };
  isSelesai: boolean;
}

export interface TrainingFormData {
  judul: string;
  deskripsi: string;
  thumbnail: string;
  kategori: KategoriTraining;
  tipeTraining: TipeTraining;
  level: LevelTraining;
  durasi: number;
  harga: number;
  instruktur: string;
  prerequisites: string[];
  tags: string[];
  tanggalMulai?: Date;
  tanggalSelesai?: Date;
  sertifikatTersedia: boolean;
  videoUrl?: string;
  materiUrl: string[];
  modules: Omit<TrainingModule, "id" | "isSelesai">[];
}

export interface TrainingFilter {
  kategori?: KategoriTraining;
  tipeTraining?: TipeTraining;
  level?: LevelTraining;
  hargaMin?: number;
  hargaMax?: number;
  gratisOnly?: boolean;
  sertifikatTersedia?: boolean;
  ratingMin?: number;
}

export interface TrainingSearchParams {
  query?: string;
  filter?: TrainingFilter;
  sortBy?: "terbaru" | "terpopuler" | "rating" | "harga";
  page?: number;
  limit?: number;
}

export interface TrainingValidationErrors {
  judul?: string;
  deskripsi?: string;
  thumbnail?: string;
  kategori?: string;
  tipeTraining?: string;
  level?: string;
  durasi?: string;
  harga?: string;
  instruktur?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
  videoUrl?: string;
  modules?: string;
}

// Enums
export enum KategoriTraining {
  DIGITAL_MARKETING = "Digital Marketing",
  E_COMMERCE = "E-Commerce",
  KEUANGAN = "Keuangan & Akuntansi",
  MANAJEMEN = "Manajemen Bisnis",
  TEKNOLOGI = "Teknologi & IT",
  PRODUKSI = "Produksi & Operasi",
  HUKUM = "Hukum & Regulasi",
  SOFT_SKILLS = "Soft Skills",
  KEPEMIMPINAN = "Kepemimpinan",
  INOVASI = "Inovasi & Kreativitas",
}

export enum TipeTraining {
  ONLINE = "Online",
  OFFLINE = "Offline",
  HYBRID = "Hybrid",
}

export enum LevelTraining {
  PEMULA = "Pemula",
  MENENGAH = "Menengah",
  LANJUTAN = "Lanjutan",
  AHLI = "Ahli",
}

export enum TipeKonten {
  VIDEO = "Video",
  ARTIKEL = "Artikel",
  PDF = "PDF",
  QUIZ = "Quiz",
  PRESENTASI = "Presentasi",
  WEBINAR = "Webinar",
}

// Constants
export const KATEGORI_TRAINING = Object.values(KategoriTraining);
export const TIPE_TRAINING = Object.values(TipeTraining);
export const LEVEL_TRAINING = Object.values(LevelTraining);
export const TIPE_KONTEN = Object.values(TipeKonten);

// Utility types
export type TrainingStatistics = {
  total: number;
  aktif: number;
  nonAktif: number;
  gratis: number;
  berbayar: number;
  kategoriStats: { [key in KategoriTraining]: number };
  levelStats: { [key in LevelTraining]: number };
  rataRataRating: number;
  totalPeserta: number;
};
