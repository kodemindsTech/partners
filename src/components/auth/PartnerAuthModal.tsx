"use client";

import { useState } from "react";
import { 
  Building2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  MessageSquareShare,
  Lock
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { PartnerType } from "@/lib/types";

interface PartnerAuthModalProps {
  onSuccess?: () => void;
}

export function PartnerAuthModal({ onSuccess }: PartnerAuthModalProps) {
  const { partnerLogin, partnerSignup, partners } = usePortalStore();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [phoneOrEmail, setPhoneOrEmail] = useState("+91 98765 43210");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("849201");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Signup form state
  const [name, setName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [partnerType, setPartnerType] = useState<PartnerType>("marketing_agency");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [website, setWebsite] = useState("");
  const [d2cBrandsCount, setD2cBrandsCount] = useState("5-10 brands");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Handle Send Login OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpCode(code); // Pre-fill for instant frictionless demo
      setLoginStep("otp");
    }, 400);
  };

  // Handle Verify Login OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      partnerLogin(phoneOrEmail);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Invalid phone or email";
      setErrorMsg(message);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg("Please accept the Retner Partner Terms to proceed.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      partnerSignup({
        name,
        phone: signupPhone,
        email: signupEmail,
        type: partnerType,
        companyName: companyName || undefined,
        city,
        website: website || undefined,
        d2cBrandsCount: 5,
      });

      setIsLoading(false);
      setSignupSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Error creating partner account";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1F251D] dark:bg-[#9CE06F] text-[#9CE06F] dark:text-[#1F251D] flex items-center justify-center font-black text-xl mx-auto shadow-md">
            R
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-3">
            {mode === "login" ? "Partner Portal Login" : "Join Partner Program"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {mode === "login"
              ? "Access your leads, commission ledger & payouts"
              : "Refer D2C brands to Retner & earn up to 20% lifetime commission"}
          </p>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setLoginStep("phone");
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === "login"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Partner Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              mode === "signup"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Sign Up as Partner
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* MODE 1: LOGIN (WhatsApp OTP) */}
        {mode === "login" && (
          <div>
            {loginStep === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
                    WhatsApp Mobile Number / Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210 or email"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    We will send a 6-digit WhatsApp OTP verification code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquareShare className="w-4 h-4" />
                  <span>{isLoading ? "Sending OTP..." : "Send WhatsApp OTP"}</span>
                </button>

                {/* Quick 1-Click Demo Accounts */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block mb-2 text-center">
                    Demo Instant Login (1-Click)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {partners.slice(0, 2).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPhoneOrEmail(p.phone);
                          setLoginStep("otp");
                          setOtpCode("849201");
                        }}
                        className="p-2 text-left rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 text-xs transition"
                      >
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{p.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{p.phone}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* OTP Code Input Step */
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-[#9CE06F]/15 border border-[#9CE06F]/30 text-[#1F251D] dark:text-[#9CE06F] text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold">Simulated WhatsApp OTP:</span>
                    <span className="font-mono font-black text-sm ml-2">{generatedOtp}</span>
                  </div>
                  <span className="text-[10px] font-semibold">5 min expiry</span>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="849201"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-[0.5em] py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xl font-mono font-black text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginStep("phone")}
                    className="py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold"
                  >
                    Change Phone
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm shadow-md"
                  >
                    {isLoading ? "Verifying..." : "Verify & Enter Portal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* MODE 2: SIGN UP */}
        {mode === "signup" && (
          <div>
            {signupSuccess ? (
              <div className="py-8 text-center animate-in zoom-in-95 duration-200 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-[#9CE06F] mx-auto" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Welcome to Retner Partners!
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Your partner profile has been registered and is now listed under the Admin Review pipeline. Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765..."
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@agency.in"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Partner Type
                    </label>
                    <select
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    >
                      <option value="marketing_agency">Marketing Agency</option>
                      <option value="shopify_agency">Shopify Dev Agency</option>
                      <option value="freelancer">Freelance Growth Consultant</option>
                      <option value="existing_customer">Existing Retner Customer</option>
                      <option value="other">Influencer / Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Agency / Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Website or Social
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. agency.co"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#9CE06F]"
                    />
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#1F251D]"
                    />
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                      I accept the Retner Partner Agreement, code of conduct, and 90-day lead protection terms.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !termsAccepted}
                  className="w-full py-3.5 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition disabled:opacity-40 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>{isLoading ? "Creating Partner Account..." : "Complete Sign Up (Instant Link)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
