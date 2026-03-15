"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-12 md:p-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center bg-red-50 p-3 rounded-2xl mb-6">
              <Image
                src="/logo.png"
                alt="Logo KJSB Benning dan Rekan"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight font-sans">
              KJSB Benning dan Rekan
            </h1>
            <p className="text-lg font-medium text-slate-600 mt-4">
              Selamat datang kembali. Silakan masuk untuk mengakses sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div
                className="p-3 rounded-lg bg-red-50 text-red-700 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Kata sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold focus:ring-4 focus:ring-indigo-100 focus:outline-none disabled:opacity-60 transition-all"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
