export const WARNING_SYMBOL = "/images/warning-symbol.png";
export const SUCCESS_SYMBOL = "/images/success-checkmark-symbol.png";

export const ERROR_404 = {
  title: "Tagihan Belum Tersedia/Sudah Terbayar",
  message: "Status tagihan belum tersedia / sudah terbayar.",
  image: WARNING_SYMBOL,
};

export const ERROR_NETWORK_DISTRUPTION = {
  title: "Gangguan Jaringan",
  message: "Tidak ada koneksi internet/koneksi tidak stabil.",
  image: "/images/bad-network-symbol.svg",
};

export const DELETE_CONFIRMATION = {
  title: "Apakah Anda yakin ingin menghapus ID Pelanggan ini?",
  image: WARNING_SYMBOL,
};

export const ERROR_CUSTOMER_ID_MISSING = {
  title: "ID Pelanggan Belum Terisi",
  message: "Mohon Mengisi ID Pelanggan.",
  image: WARNING_SYMBOL,
};

export const ERROR_CUSTOMER_ID_NOT_FOUND = {
  title: "ID Pelanggan Tidak Ditemukan",
  message: "Mohon periksa lagi ID Pelanggan yang Anda masukkan.",
  image: WARNING_SYMBOL,
};

export const ERROR_UNAUTHORIZED = {
  title: "Akses Tidak Sah",
  message:
    "Anda tidak memiliki izin untuk melihat halaman ini. Silakan login dengan akun yang tepat atau hubungi call center 135.",
  image: WARNING_SYMBOL,
};

export const SUCCESS_CUSTOMER_ID_SAVED = {
  title: "ID Pelanggan Berhasil Disimpan",
  message: "Data ID Pelanggan telah berhasil disimpan.",
  image: SUCCESS_SYMBOL,
};

export const SUCCESS_CUSTOMER_ID_DELETED = {
  title: "ID Pelanggan Berhasil Dihapus",
  message: "Data ID Pelanggan telah berhasil dihapus.",
  image: SUCCESS_SYMBOL,
};

export const ERROR_BILLING_NUMBER_EXISTS = {
  title: "ID Pelanggan Sudah Tersimpan",
  message: "ID Pelanggan sudah terdaftar untuk akun ini.",
  image: WARNING_SYMBOL,
};

export const ERROR_INVALID_MOBILE_NUMBER = {
  title: "Nomor Handphone Tidak Valid",
  message:
    "Nomor handphone yang Anda masukkan tidak valid. Mohon periksa kembali dan coba lagi.",
  image: WARNING_SYMBOL,
};

export const ERROR_EXCEED_BILLING_NUMBERS = {
  title: "Sudah Batas Maksimal Penyimpanan",
  message: "",
  image: WARNING_SYMBOL,
};

export const ERROR_PAYMENT_URL_NOT_FOUND = {
  title: "URL Pembayaran Tidak Ditemukan",
  message:
    "Tidak dapat menemukan URL Pembayaran. Mohon periksa kembali dan coba lagi.",
  image: WARNING_SYMBOL,
};
