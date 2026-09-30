"use client";

import { useState } from "react";
import { Shield, Lock, Mail, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import { usePortalStore } from "@/lib/store";

interface AdminAuthModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminAuthModal({ onSuccess, onCancel }: AdminAuthModalProps) {
  const { adminLogin } = usePortalStore();

  const [email, setEmail] = useState("admin@retner.ai");
  const [password, setPassword] = useState("Admin@123");
  const [totp, setTotp] = useState("123456");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      adminLogin(email, password, totp);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Invalid admin credentials";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-[#9CE06F] flex items-center justify-center font-black text-xl mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-3">
            Admin Command Center
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Restricted access · Multi-factor authentication required
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
              Admin Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
              2FA Authenticator Code (TOTP)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                maxLength={6}
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-zinc-900 text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{isLoading ? "Authenticating..." : "Sign in to Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 text-xs text-zinc-500 hover:text-zinc-800 font-semibold"
            >
              Back to Partner Portal
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
