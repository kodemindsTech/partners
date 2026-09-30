"use client";

import { useRouter } from "next/navigation";
import { AdminConsole } from "@/components/admin/AdminConsole";
import { AdminAuthModal } from "@/components/auth/AdminAuthModal";
import { usePortalStore } from "@/lib/store";

export default function AdminPage() {
  const router = useRouter();
  const { authSession, logout } = usePortalStore();

  const isAdminAuthenticated = authSession.userType === "admin";

  return (
    <div className="min-h-screen bg-zinc-950">
      {isAdminAuthenticated ? (
        <AdminConsole onLogout={logout} />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F7] dark:bg-black">
          <AdminAuthModal onSuccess={() => {}} />
        </div>
      )}
    </div>
  );
}
