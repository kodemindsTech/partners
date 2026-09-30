"use client";

import { useState } from "react";
import { Shield, Lock, Mail, KeyRound, ArrowRight, AlertCircle } from "lucide-react";
import { usePortalStore } from "@/lib/store";

interface AdminAuthModalProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminAuthModal({ onSuccess, onCancel }: AdminAuthModalProps) {
  const { adminLogin } = usePortalStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setErrorMsg("");
    setIsLoading(true);

    try {
      adminLogin(email, password);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Invalid credentials";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#151814] rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-white/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/brand/logo-light.png"
              alt="Retner"
              className="h-9 sm:h-10 w-auto object-contain dark:hidden"
            />
            <img
              src="/brand/logo-dark.png"
              alt="Retner"
              className="h-9 sm:h-10 w-auto object-contain hidden dark:block"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 text-[#9CE06F] dark:bg-[#9CE06F]/15 dark:text-[#9CE06F] text-[10px] font-mono font-bold tracking-wider uppercase mb-2 border border-zinc-800 dark:border-[#9CE06F]/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Authentication</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Restricted access for Retner management team
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-medium flex items-start gap-2 border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@retner.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1E18] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1E18] text-sm font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-zinc-900 text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>{isLoading ? "Verifying..." : "Sign In to Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-semibold text-center block"
            >
              Back to Partner Portal
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
