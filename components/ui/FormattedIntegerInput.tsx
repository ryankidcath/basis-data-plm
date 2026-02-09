"use client";

import { useState, useEffect, useRef } from "react";
import { parseIntegerFromFormatted, formatIntegerForInput } from "@/lib/format";

interface FormattedIntegerInputProps {
  name: string;
  defaultValue: number | null | undefined | "";
  className?: string;
  /** When true, empty input submits as empty (for optional fields like luas_hasil_ukur) */
  optional?: boolean;
}

export function FormattedIntegerInput({
  name,
  defaultValue,
  className = "",
  optional = false,
}: FormattedIntegerInputProps) {
  const initial =
    defaultValue === "" || defaultValue == null
      ? optional
        ? ("")
        : (0 as number | "")
      : (Math.floor(Number(defaultValue)) as number | "");

  const [rawValue, setRawValue] = useState<number | "">(initial);
  const prevDefaultRef = useRef<number | "" | null | undefined>(defaultValue);

  useEffect(() => {
    if (prevDefaultRef.current === defaultValue) return;
    prevDefaultRef.current = defaultValue;
    const next =
      defaultValue === "" || defaultValue == null
        ? optional
          ? ("")
          : (0 as number | "")
        : (Math.floor(Number(defaultValue)) as number | "");
    setRawValue(next);
  }, [defaultValue, optional]);

  const displayValue =
    rawValue === "" ? "" : formatIntegerForInput(rawValue as number);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const parsed = parseIntegerFromFormatted(raw);
    if (raw.trim() === "") {
      setRawValue(optional ? "" : 0);
      return;
    }
    setRawValue(parsed);
  }

  const hiddenValue = rawValue === "" ? "" : String(rawValue);

  return (
    <>
      <input type="hidden" name={name} value={hiddenValue} />
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={className}
        placeholder="0"
      />
    </>
  );
}
