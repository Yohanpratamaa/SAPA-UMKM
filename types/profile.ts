export interface UMKMProfile {
  id: string;
  namaUsaha: string;
  jenisUsaha: string;
  deskripsiUsaha?: string;
  alamatLengkap: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  nib: string; // Nomor Induk Berusaha
  nomorKontak: string;
  email?: string;
  website?: string;
  fotoLogo?: string; // URI atau base64 string
  tanggalDaftar: Date;
  status: "aktif" | "non-aktif" | "pending";
}

export interface UMKMFormData {
  namaUsaha: string;
  jenisUsaha: string;
  deskripsiUsaha: string;
  alamatLengkap: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  nib: string;
  nomorKontak: string;
  email: string;
  website: string;
  fotoLogo?: string;
}

export interface ValidationErrors {
  namaUsaha?: string;
  jenisUsaha?: string;
  alamatLengkap?: string;
  kota?: string;
  provinsi?: string;
  kodePos?: string;
  nib?: string;
  nomorKontak?: string;
  email?: string;
}

export type JenisUsahaOptions =
  | "Kuliner"
  | "Fashion"
  | "Kerajinan"
  | "Teknologi"
  | "Pertanian"
  | "Jasa"
  | "Perdagangan"
  | "Lainnya";
