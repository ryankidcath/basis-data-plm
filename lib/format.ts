/** Label tampilan untuk penggunaan_tanah_1 (value di DB tetap lowercase) */
export const PENGGUNAAN_TANAH_1_LABELS: Record<string, string> = {
  "pertanian/perkebunan": "Pertanian/Perkebunan",
  "hunian/pekarangan": "Hunian/Pekarangan",
  "komersial": "Komersial",
  "industri": "Industri",
  "pertambangan": "Pertambangan",
};

/** Label tampilan untuk penggunaan_tanah_2 */
export const PENGGUNAAN_TANAH_2_LABELS: Record<string, string> = {
  "pertanian": "Pertanian",
  "non-pertanian": "Non-Pertanian",
};

/**
 * Format number with Indonesian locale (thousand separator).
 * Do not use for NIB.
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "–";
  return value.toLocaleString("id-ID");
}

/**
 * Parse string with Indonesian thousand separators (dots) to integer.
 * Strips all non-digit characters.
 */
export function parseIntegerFromFormatted(s: string): number {
  const digits = s.replace(/\D/g, "");
  if (digits === "") return 0;
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Format integer for display in input (id-ID: dot as thousand separator, no decimals).
 */
export function formatIntegerForInput(value: number): string {
  if (value === 0) return "";
  return Math.floor(value).toLocaleString("id-ID", { maximumFractionDigits: 0 });
}

/** Format date for display (Indonesian locale). */
export function formatDate(s: string | null | undefined): string {
  if (!s) return "–";
  try {
    return new Date(s).toLocaleDateString("id-ID");
  } catch {
    return s;
  }
}

/** Format date long: "8 Februari 2026" (id-ID). */
export function formatDateLong(s: string | null | undefined): string {
  if (!s) return "–";
  try {
    return new Date(s).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

/** Format date with weekday: "Minggu tanggal 8 Februari 2026" (id-ID). */
export function formatDateWithDay(s: string | null | undefined): string {
  if (!s) return "–";
  try {
    const d = new Date(s);
    const weekday = d.toLocaleDateString("id-ID", { weekday: "long" });
    const long = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${weekday} tanggal ${long}`;
  } catch {
    return s;
  }
}

/** Bulan (1–12) ke Romawi I–XII. */
export function monthToRoman(month: number): string {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const i = Math.floor(month);
  if (i < 1 || i > 12) return "I";
  return romans[i - 1];
}

const NO_TANDA_TERIMA_FULL = /^A\.\d+\/TT\/KJSB\/[IVXLCDM]+\/\d{4}$/i;
const NO_SLA_FULL = /^A\.\d+\/SLA\/KJSB\/[IVXLCDM]+\/\d{4}$/i;
const NO_SURAT_TUGAS_FULL = /^B\.\d+\/ST\/KJSB\/[IVXLCDM]+\/\d{4}$/i;
const NO_SURAT_PEMBERITAHUAN_FULL = /^A\.\d+\/SPemb\/KJSB\/[IVXLCDM]+\/\d{4}$/i;

/**
 * Format nomor Surat Pemberitahuan: A.{nomor}/SPemb/KJSB/{bulan_romawi}/{tahun}.
 */
export function formatNoSuratPemberitahuan(
  noSuratPemberitahuan: string | null | undefined,
  tanggalSuratPemberitahuan: string | null | undefined
): string {
  const no = (noSuratPemberitahuan ?? "").trim();
  if (!no) return tanggalSuratPemberitahuan ? "–" : "–";
  if (NO_SURAT_PEMBERITAHUAN_FULL.test(no)) return no;
  if (!tanggalSuratPemberitahuan) return no.startsWith("A.") ? no : no ? `A.${no}` : "–";
  try {
    const d = new Date(tanggalSuratPemberitahuan);
    const roman = monthToRoman(d.getMonth() + 1);
    const numMatch = no.replace(/^A\./i, "").match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 0;
    const padded = String(num).padStart(3, "0");
    return `A.${padded}/SPemb/KJSB/${roman}/${d.getFullYear()}`;
  } catch {
    return no.startsWith("A.") ? no : no ? `A.${no}` : "–";
  }
}

/**
 * Format nomor Surat Tugas: B.{nomor}/ST/KJSB/{bulan_romawi}/{tahun}.
 */
export function formatNoSuratTugas(
  noSuratTugas: string | null | undefined,
  tanggalSuratTugas: string | null | undefined
): string {
  const no = (noSuratTugas ?? "").trim();
  if (!no) return tanggalSuratTugas ? "–" : "–";
  if (NO_SURAT_TUGAS_FULL.test(no)) return no;
  if (!tanggalSuratTugas) return no.startsWith("B.") ? no : no ? `B.${no}` : "–";
  try {
    const d = new Date(tanggalSuratTugas);
    const roman = monthToRoman(d.getMonth() + 1);
    const numMatch = no.replace(/^B\./i, "").match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 0;
    const padded = String(num).padStart(3, "0");
    return `B.${padded}/ST/KJSB/${roman}/${d.getFullYear()}`;
  } catch {
    return no.startsWith("B.") ? no : no ? `B.${no}` : "–";
  }
}

/**
 * Format nomor SLA: A.{nomor}/SLA/KJSB/{bulan_romawi}/{tahun}.
 * Jika noSla sudah lengkap (A.xxx/SLA/KJSB/ROMAN/year), dikembalikan as-is.
 */
export function formatNoSla(
  noSla: string | null | undefined,
  tanggalSla: string | null | undefined
): string {
  const no = (noSla ?? "").trim();
  if (!no) return tanggalSla ? "–" : "–";
  if (NO_SLA_FULL.test(no)) return no;
  if (!tanggalSla) return no.startsWith("A.") ? no : no ? `A.${no}` : "–";
  try {
    const d = new Date(tanggalSla);
    const year = d.getFullYear();
    const roman = monthToRoman(d.getMonth() + 1);
    const numMatch = no.replace(/^A\./i, "").match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 0;
    const padded = String(num).padStart(3, "0");
    return `A.${padded}/SLA/KJSB/${roman}/${year}`;
  } catch {
    return no.startsWith("A.") ? no : no ? `A.${no}` : "–";
  }
}

/**
 * Format nomor tanda terima: A.{nomor}/TT/KJSB/{bulan_romawi}/{tahun}.
 * Jika noTandaTerima sudah lengkap, dikembalikan as-is. Jika tidak, disusun dari angka + tanggal.
 */
export function formatNoTandaTerima(
  noTandaTerima: string | null | undefined,
  tanggalTandaTerima: string | null | undefined
): string {
  const no = (noTandaTerima ?? "").trim();
  if (!no) return tanggalTandaTerima ? "–" : "–";
  if (NO_TANDA_TERIMA_FULL.test(no)) return no;
  if (!tanggalTandaTerima) return no;
  try {
    const d = new Date(tanggalTandaTerima);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const roman = monthToRoman(month);
    const numMatch = no.replace(/^A\./i, "").match(/\d+/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 0;
    const padded = String(num).padStart(3, "0");
    return `A.${padded}/TT/KJSB/${roman}/${year}`;
  } catch {
    return no;
  }
}

/**
 * Format luas for display in m².
 * @param fromHa - if true, value is in hectares (e.g. luas_otomatis from DB); convert to m² for display
 */
export function formatLuasM2(
  value: number | null | undefined,
  fromHa?: boolean
): string {
  if (value == null || Number.isNaN(value)) return "–";
  const m2 = fromHa ? value * 10000 : value;
  return `${m2.toLocaleString("id-ID")} m²`;
}
