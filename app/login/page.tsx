"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-navy-200 p-8">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo KJSB Benning dan Rekan"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-serif font-semibold text-navy-900 tracking-tight">
              KJSB Benning dan Rekan
            </h1>
            <p className="text-navy-600 mt-1 text-sm">
              Permohonan Langsung Masyarakat
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-3 rounded-lg bg-red-50 text-red-700 text-sm"
                role="alert"
              >
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-navy-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-navy-300 focus:ring-2 focus:ring-gold-400 focus:border-gold-500 text-navy-900"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-navy-700 mb-1"
              >
                Kata sandi
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-navy-300 focus:ring-2 focus:ring-gold-400 focus:border-gold-500 text-navy-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-navy-800 text-white font-medium hover:bg-navy-900 focus:ring-2 focus:ring-gold-400 disabled:opacity-60 transition-colors"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
