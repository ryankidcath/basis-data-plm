"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_10%_10%,rgba(220,38,38,0.20),rgba(2,6,23,0)_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_90%_90%,rgba(148,163,184,0.16),rgba(2,6,23,0)_60%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 md:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <section className="motion-enter hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-100 shadow-2xl backdrop-blur-sm lg:flex lg:flex-col lg:justify-between motion-reduce:animate-none">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-red-300/30 bg-red-200/10 px-4 py-2">
                <Image
                  src="/logo.png"
                  alt="Logo KJSB Benning dan Rekan"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <p className="text-sm font-semibold tracking-wide text-red-200">
                  KJSB Benning dan Rekan
                </p>
              </div>

              <h1 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl">
                Basis Data Spasial
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
                Kelola data, monitor progres pekerjaan, dan akses dokumen secara
                terstruktur dalam satu sistem.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
              <p className="text-sm font-semibold text-white">
                Akses untuk pengguna terverifikasi
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Jika mengalami kendala login, hubungi admin internal untuk
                verifikasi akun.
              </p>
            </div>
          </section>

          <section className="motion-enter mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl motion-reduce:animate-none md:p-10">
            <div className="mb-8">
              <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-red-50 p-3">
                <Image
                  src="/logo.png"
                  alt="Logo KJSB Benning dan Rekan"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                Masuk ke Sistem
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
                Gunakan akun terdaftar untuk mengakses dashboard basis data
                spasial.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div aria-live="polite" aria-atomic="true">
                {error && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.94 5.44A2 2 0 014.5 5h11a2 2 0 011.56.44L10 10.28 2.94 5.44z" />
                      <path d="M2 7.17V14a2 2 0 002 2h12a2 2 0 002-2V7.17l-7.36 5.5a1 1 0 01-1.28 0L2 7.17z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Kata sandi
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 8a5 5 0 1110 0v1a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2V8zm2 1h6V8a3 3 0 10-6 0v1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-20 text-slate-900 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 rounded-md text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    aria-label={
                      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Masuk ke Dashboard"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Akses sistem ini dibatasi untuk pengguna internal.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
