"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBidangTanahGeo, type BidangTanahGeo } from "@/lib/supabase/queries";

export function useParcelGeometries() {
  const [parcels, setParcels] = useState<BidangTanahGeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBidangTanahGeo();
      setParcels(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat bidang tanah");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { parcels, loading, error, refresh };
}
