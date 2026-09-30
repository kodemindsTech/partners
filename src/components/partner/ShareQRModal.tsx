"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Copy, Check, MessageSquareShare, ExternalLink } from "lucide-react";

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  partnerName: string;
}

export function ShareQRModal({ isOpen, onClose, referralCode, partnerName }: ShareQRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [campaign, setCampaign] = useState("general");

  const fullUrl = `https://partners.retner.ai/r/${referralCode}${campaign !== "general" ? `?c=${campaign}` : ""}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#1F251D",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [isOpen, fullUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out Retner.ai — the AI WhatsApp growth platform for D2C brands. Use my partner link to get priority onboarding and trial credits: ${fullUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9CE06F]/20 text-[#1F251D] dark:text-[#9CE06F] text-xs font-semibold mb-3">
          <span>● Partner Referral QR</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Share Your Link
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Scan to attribute leads directly to <span className="font-semibold text-zinc-800 dark:text-zinc-200">{partnerName}</span>
        </p>

        {/* Campaign Sub-Tag Selector */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs">
          <span className="text-zinc-400">Tag:</span>
          {["general", "whatsapp", "instagram", "linkedin"].map((tag) => (
            <button
              key={tag}
              onClick={() => setCampaign(tag)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                campaign === tag
                  ? "bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* QR Code Container */}
        <div className="mt-4 p-3 bg-white rounded-2xl border border-zinc-200 shadow-inner inline-block">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Referral QR Code" className="w-48 h-48 mx-auto rounded-lg" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-zinc-400">
              Generating QR...
            </div>
          )}
        </div>

        {/* Link Pill */}
        <div className="mt-4 flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-left">
          <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-[200px]">
            {fullUrl}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-medium text-xs hover:bg-[#20bd5a] transition active:scale-95 shadow-sm"
          >
            <MessageSquareShare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => window.open(fullUrl, "_blank")}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium text-xs hover:opacity-90 transition active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Redirect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
