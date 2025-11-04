// Data FAQ untuk konsultasi digital UMKM
// Berisi pertanyaan umum dan jawaban otomatis dari konsultan virtual

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const faqData: FAQItem[] = [
  // Kategori: Perizinan
  {
    id: 1,
    category: "Perizinan",
    question: "Bagaimana cara mendapatkan NIB (Nomor Induk Berusaha)?",
    answer:
      "Anda bisa membuat NIB melalui OSS (Online Single Submission) dengan langkah berikut:\n1. Daftar akun di oss.go.id\n2. Login dan pilih 'Perizinan Berusaha'\n3. Isi data perusahaan dan upload dokumen\n4. Submit dan tunggu persetujuan\n5. NIB akan terbit otomatis setelah disetujui",
    keywords: ["nib", "nomor induk berusaha", "oss", "perizinan"],
  },
  {
    id: 2,
    category: "Perizinan",
    question: "Dokumen apa saja yang dibutuhkan untuk mendaftar UMKM?",
    answer:
      "Dokumen yang diperlukan:\n• KTP pemilik usaha\n• NPWP (jika ada)\n• Surat keterangan domisili usaha\n• Foto lokasi usaha\n• Surat pernyataan tidak akan mengganggu lingkungan\n• Data bank untuk rekening usaha",
    keywords: ["dokumen", "pendaftaran", "umkm", "syarat"],
  },
  {
    id: 3,
    category: "Perizinan",
    question: "Berapa biaya untuk mengurus izin usaha UMKM?",
    answer:
      "Biaya perizinan UMKM umumnya gratis atau sangat murah:\n• NIB: Gratis\n• Sertifikat halal: Gratis untuk UMKM\n• PIRT: Rp 150.000 - 300.000\n• SIUP: Gratis untuk usaha kecil\n• TDP: Sesuai tarif daerah (biasanya <Rp 100.000)",
    keywords: ["biaya", "tarif", "gratis", "izin usaha"],
  },

  // Kategori: Keuangan
  {
    id: 4,
    category: "Keuangan",
    question: "Bagaimana cara memisahkan keuangan pribadi dan bisnis?",
    answer:
      "Tips memisahkan keuangan pribadi dan bisnis:\n1. Buka rekening bank terpisah untuk usaha\n2. Catat semua pemasukan dan pengeluaran bisnis\n3. Gunakan aplikasi pencatatan keuangan\n4. Tentukan gaji tetap untuk diri sendiri\n5. Jangan campur uang pribadi dengan modal usaha",
    keywords: ["keuangan", "rekening", "pisah", "pencatatan"],
  },
  {
    id: 5,
    category: "Keuangan",
    question: "Apa itu cash flow dan bagaimana mengelolanya?",
    answer:
      "Cash flow adalah arus kas masuk dan keluar bisnis. Cara mengelola:\n• Buat proyeksi cash flow bulanan\n• Pantau piutang dan tagihan\n• Siapkan dana darurat 3-6 bulan operasional\n• Percepat penagihan piutang\n• Atur jadwal pembayaran hutang\n• Gunakan aplikasi seperti BukuWarung atau Accurate",
    keywords: ["cash flow", "arus kas", "piutang", "hutang"],
  },
  {
    id: 6,
    category: "Keuangan",
    question: "Bagaimana cara mengajukan kredit UMKM di bank?",
    answer:
      "Langkah mengajukan kredit UMKM:\n1. Siapkan laporan keuangan minimal 6 bulan\n2. Lengkapi dokumen: KTP, NPWP, surat usaha\n3. Buat proposal bisnis yang menarik\n4. Pilih bank dengan bunga kompetitif\n5. Ajukan melalui program KUR (Kredit Usaha Rakyat)\n6. Siapkan jaminan sesuai ketentuan bank",
    keywords: ["kredit", "pinjaman", "kur", "bank", "modal"],
  },

  // Kategori: Pemasaran
  {
    id: 7,
    category: "Pemasaran",
    question: "Apa strategi pemasaran digital yang efektif untuk UMKM?",
    answer:
      "Strategi pemasaran digital efektif:\n• Manfaatkan media sosial (Instagram, Facebook, TikTok)\n• Daftar di marketplace (Shopee, Tokopedia, Bukalapak)\n• Buat konten menarik dan konsisten\n• Gunakan WhatsApp Business untuk customer service\n• Optimasi Google My Business untuk bisnis lokal\n• Kolaborasi dengan influencer mikro",
    keywords: ["pemasaran digital", "social media", "marketplace", "instagram"],
  },
  {
    id: 8,
    category: "Pemasaran",
    question: "Bagaimana cara menentukan harga produk yang tepat?",
    answer:
      "Cara menentukan harga produk:\n1. Hitung biaya produksi + overhead\n2. Riset harga kompetitor\n3. Tentukan margin keuntungan (20-50%)\n4. Pertimbangkan nilai tambah produk\n5. Test dengan harga berbeda\n6. Sesuaikan dengan target market\n7. Review berkala sesuai inflasi",
    keywords: ["harga", "pricing", "margin", "keuntungan"],
  },
  {
    id: 9,
    category: "Pemasaran",
    question: "Bagaimana cara meningkatkan penjualan online?",
    answer:
      "Tips meningkatkan penjualan online:\n• Foto produk berkualitas tinggi\n• Deskripsi produk yang detail dan menarik\n• Respon cepat pada customer inquiry\n• Berikan promo dan diskon menarik\n• Kumpulkan review positif dari pembeli\n• Gunakan sistem rating dan testimoni\n• Aktif posting konten di media sosial",
    keywords: ["penjualan online", "foto produk", "promo", "review"],
  },

  // Kategori: Digitalisasi
  {
    id: 10,
    category: "Digitalisasi",
    question: "Aplikasi apa saja yang diperlukan untuk mengelola UMKM digital?",
    answer:
      "Aplikasi penting untuk UMKM digital:\n• Pencatatan: BukuWarung, Accurate, Jurnal\n• Pembayaran: QRIS, GoPay, OVO, Dana\n• Komunikasi: WhatsApp Business, Telegram\n• E-commerce: Shopee, Tokopedia, Instagram Shop\n• Desain: Canva, PicsArt\n• Analytic: Google Analytics, Facebook Insights",
    keywords: [
      "aplikasi",
      "digital",
      "bukuwarung",
      "qris",
      "whatsapp business",
    ],
  },
  {
    id: 11,
    category: "Digitalisasi",
    question: "Bagaimana cara membuat website sederhana untuk UMKM?",
    answer:
      "Cara membuat website UMKM:\n1. Gunakan platform gratis: WordPress.com, Wix, Toko.id\n2. Pilih template sesuai bisnis Anda\n3. Isi konten: profil usaha, produk, kontak\n4. Tambahkan foto berkualitas\n5. Pastikan mobile-friendly\n6. Daftarkan di Google My Business\n7. Optimalkan untuk SEO lokal",
    keywords: ["website", "wordpress", "wix", "seo", "mobile-friendly"],
  },
  {
    id: 12,
    category: "Digitalisasi",
    question: "Apa itu QRIS dan bagaimana cara mendaftarnya?",
    answer:
      "QRIS (Quick Response Code Indonesian Standard) adalah sistem pembayaran digital. Cara daftar:\n1. Datang ke bank atau e-wallet provider\n2. Bawa KTP dan dokumen usaha\n3. Isi formulir pendaftaran\n4. Dapatkan stiker QR code\n5. Pasang di tempat usaha\n6. Edukasi pelanggan cara menggunakan\nKeuntungan: Transaksi cepat, aman, dan terdata otomatis",
    keywords: ["qris", "pembayaran digital", "qr code", "cashless"],
  },
];

// Fungsi untuk mencari FAQ berdasarkan kategori
export const getFAQByCategory = (category: string): FAQItem[] => {
  return faqData.filter((item) => item.category === category);
};

// Fungsi untuk mencari FAQ berdasarkan keyword
export const searchFAQ = (keyword: string): FAQItem[] => {
  const lowerKeyword = keyword.toLowerCase();
  return faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(lowerKeyword) ||
      item.answer.toLowerCase().includes(lowerKeyword) ||
      item.keywords.some((k) => k.toLowerCase().includes(lowerKeyword))
  );
};

// Daftar kategori yang tersedia
export const categories = [
  "Perizinan",
  "Keuangan",
  "Pemasaran",
  "Digitalisasi",
];
