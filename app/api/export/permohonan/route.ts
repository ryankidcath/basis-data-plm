import { NextResponse } from "next/server";
import {
  fetchPermohonanForExport,
  type PermohonanExportRow,
} from "@/lib/supabase/export-queries";

const CSV_HEADERS = [
  "kode_kjsb",
  "pemohon_nama",
  "tanggal_permohonan",
  "luas_permohonan",
  "penggunaan_tanah_1",
  "lokasi_tanah",
  "kota_kabupaten",
  "kecamatan",
  "kelurahan_desa",
  "status_permohonan",
  "created_at",
] as const;

function escapeCsvValue(value: string): string {
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowToCsvLine(row: PermohonanExportRow): string {
  return CSV_HEADERS.map((key) => escapeCsvValue(String(row[key]))).join(",");
}

function buildCsv(rows: PermohonanExportRow[]): string {
  const headerLine = CSV_HEADERS.join(",");
  const dataLines = rows.map(rowToCsvLine);
  return [headerLine, ...dataLines].join("\r\n");
}

export async function GET() {
  try {
    const rows = await fetchPermohonanForExport();
    const csv = buildCsv(rows);
    const bom = "\uFEFF";
    const body = bom + csv;

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="permohonan.csv"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengekspor data" },
      { status: 500 }
    );
  }
}
