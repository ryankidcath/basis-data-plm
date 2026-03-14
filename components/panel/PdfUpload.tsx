"use client";

import { useState, useRef } from "react";

interface PdfUploadProps {
  permohonanId: string;
  onSaved?: () => void;
  embedded?: boolean;
}

export default function PdfUpload({ permohonanId, onSaved, embedded = false }: PdfUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("permohonanId", permohonanId);
      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal mengunggah PDF.");
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSuccess(true);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah PDF.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const wrapperClass = embedded ? "pb-4" : "rounded-lg border border-navy-200 bg-white p-4";
  return (
    <div className={wrapperClass}>
      <h3 className="text-sm font-medium text-navy-800 mb-2">Upload PDF Hasil Scan</h3>
      <p className="text-xs text-navy-500 mb-3">
        Upload file PDF hasil scan. File akan dikirim ke Discord channel #berkas-plm. Maksimal 25MB.
      </p>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-2">PDF berhasil dikirim ke Discord.</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-navy-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-navy-100 file:text-navy-800 file:font-medium"
      />
      {uploading && <p className="mt-2 text-xs text-navy-500">Mengunggah...</p>}
    </div>
  );
}
