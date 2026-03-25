"use client";

import { motion } from "motion/react";
import { use, useState } from "react";
import { signIn } from "~/lib/auth-client";

export default function LoginClient({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = use(searchParamsPromise);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    await signIn.social({
      provider: "discord",
      callbackURL: callbackUrl ?? "/dashboard",
    });
  }

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl"
      >
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-xl font-bold text-text">Sign in to Baitin</h1>
          <p className="text-sm text-muted">
            Connect your Discord account to access the dashboard.
          </p>
        </div>

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {loading ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="20" height="15" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.105 4.898A58.55 58.55 0 0045.653.415a.22.22 0 00-.233.11 40.784 40.784 0 00-1.8 3.697c-5.456-.817-10.886-.817-16.23 0-.485-1.164-1.201-2.587-1.828-3.697a.228.228 0 00-.233-.11 58.386 58.386 0 00-14.451 4.483.207.207 0 00-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 00.093.167c6.073 4.46 11.955 7.167 17.729 8.962a.23.23 0 00.249-.082 42.08 42.08 0 003.627-5.9.225.225 0 00-.123-.312 38.772 38.772 0 01-5.539-2.64.228.228 0 01-.022-.378c.372-.279.744-.569 1.1-.862a.22.22 0 01.23-.031c11.619 5.304 24.198 5.304 35.68 0a.219.219 0 01.233.027c.356.293.728.586 1.103.865a.228.228 0 01-.02.378 36.384 36.384 0 01-5.54 2.637.227.227 0 00-.121.315 47.249 47.249 0 003.624 5.897.225.225 0 00.249.084c5.801-1.794 11.684-4.502 17.757-8.961a.228.228 0 00.092-.164c1.48-15.315-2.48-28.618-10.497-40.412a.18.18 0 00-.093-.084zM23.725 37.19c-3.498 0-6.38-3.226-6.38-7.188s2.826-7.188 6.38-7.188c3.582 0 6.437 3.254 6.38 7.188 0 3.962-2.826 7.188-6.38 7.188zm23.593 0c-3.498 0-6.38-3.226-6.38-7.188s2.826-7.188 6.38-7.188c3.582 0 6.437 3.254 6.38 7.188 0 3.962-2.826 7.188-6.38 7.188z" fill="currentColor"/>
            </svg>
          )}
          {loading ? "Connecting..." : "Continue with Discord"}
        </motion.button>

        <p className="mt-6 text-center text-xs text-muted">
          By signing in you agree to our{" "}
          <a href="/terms" className="underline hover:text-text">
            Terms
          </a>{" "}
          &amp;{" "}
          <a href="/privacy" className="underline hover:text-text">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
