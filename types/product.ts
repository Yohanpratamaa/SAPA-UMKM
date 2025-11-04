export interface Product {
  id: string;
  umkmId: string; // ID UMKM yang memiliki produk ini
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: KategoriProduk;
  foto: string[]; // Array untuk multiple photos
  stok: number;
  satuan: string; // pcs, kg, liter, dll
  tags?: string[]; // untuk pencarian
  isAktif: boolean;
  tanggalDibuat: Date;
  tanggalDiperbarui: Date;
}

export interface ProductFormData {
  nama: string;
  deskripsi: string;
  harga: string; // string untuk form input
  kategori: KategoriProduk;
  foto: string[];
  stok: string; // string untuk form input
  satuan: string;
  tags: string;
}

export interface ProductValidationErrors {
  nama?: string;
  deskripsi?: string;
  harga?: string;
  kategori?: string;
  foto?: string;
  stok?: string;
  satuan?: string;
  tags?: string;
}

export type KategoriProduk =
  | "Makanan"
  | "Minuman"
  | "Fashion"
  | "Kerajinan"
  | "Teknologi"
  | "Kecantikan"
  | "Kesehatan"
  | "Elektronik"
  | "Furniture"
  | "Otomotif"
  | "Pendidikan"
  | "Jasa"
  | "Lainnya";

export const KATEGORI_PRODUK: KategoriProduk[] = [
  "Makanan",
  "Minuman",
  "Fashion",
  "Kerajinan",
  "Teknologi",
  "Kecantikan",
  "Kesehatan",
  "Elektronik",
  "Furniture",
  "Otomotif",
  "Pendidikan",
  "Jasa",
  "Lainnya",
];

export const SATUAN_OPTIONS = [
  "pcs",
  "kg",
  "gram",
  "liter",
  "ml",
  "meter",
  "cm",
  "set",
  "pasang",
  "lusin",
  "box",
  "pack",
];

export interface ProductFilter {
  kategori?: KategoriProduk;
  hargaMin?: number;
  hargaMax?: number;
  stokTersedia?: boolean;
  umkmId?: string;
}

export interface ProductSearchParams {
  query?: string;
  filter?: ProductFilter;
  sortBy?: "nama" | "harga" | "tanggalDibuat" | "stok";
  sortOrder?: "asc" | "desc";
}
