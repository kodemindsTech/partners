"use client";

import { PartnerView } from "@/components/partner/PartnerView";
import { PartnerAuthModal } from "@/components/auth/PartnerAuthModal";
import { usePortalStore } from "@/lib/store";

export default function Home() {
  const { authSession, logout } = usePortalStore();

  const isPartnerAuthenticated = authSession.userType === "partner";

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col">
      {isPartnerAuthenticated ? (
        <PartnerView onLogout={logout} />
      ) : (
        <div className="flex-1 min-h-screen flex items-center justify-center p-4 bg-[#F5F5F7] dark:bg-black">
          <PartnerAuthModal onSuccess={() => {}} />
        </div>
      )}
    </div>
  );
}
