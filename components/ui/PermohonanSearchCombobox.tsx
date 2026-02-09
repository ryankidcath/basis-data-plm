"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PermohonanOption {
  id: string;
  kode_kjsb: string;
}

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 30;

interface PermohonanSearchComboboxProps {
  value: PermohonanOption | null;
  onChange: (item: PermohonanOption | null) => void;
  placeholder?: string;
  className?: string;
}

export function PermohonanSearchCombobox({
  value,
  onChange,
  placeholder = "Ketik untuk cari kode KJSB...",
  className = "",
}: PermohonanSearchComboboxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<PermohonanOption[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("permohonan")
          .select("id, kode_kjsb")
          .ilike("kode_kjsb", `%${trimmed}%`)
          .order("kode_kjsb")
          .limit(SEARCH_LIMIT)
          .abortSignal(controller.signal);
        setSearchResults((data ?? []) as PermohonanOption[]);
      } catch (err: unknown) {
        if ((err as { name?: string })?.name !== "AbortError") setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      runSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, isOpen, runSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = isOpen ? searchQuery : value?.kode_kjsb ?? "";

  const handleSelect = (item: PermohonanOption) => {
    onChange(item);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div ref={containerRef} className={`relative flex-1 min-w-0 ${className}`}>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-navy-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 py-1 bg-white border border-navy-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchLoading ? (
            <div className="px-3 py-4 text-sm text-navy-500 text-center">
              Mencari...
            </div>
          ) : searchQuery.trim() === "" ? (
            <div className="px-3 py-4 text-sm text-navy-500 text-center">
              Ketik untuk cari...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="px-3 py-4 text-sm text-navy-500 text-center">
              Tidak ada hasil
            </div>
          ) : (
            <ul className="py-0">
              {searchResults.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(p)}
                    className="w-full text-left px-3 py-2 text-sm text-navy-800 hover:bg-navy-100 focus:bg-navy-100 focus:outline-none"
                  >
                    {p.kode_kjsb}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
