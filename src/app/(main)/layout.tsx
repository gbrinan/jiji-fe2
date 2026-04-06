"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasToken } from "@/lib/api";
import { AuthProvider } from "@/hooks/useAuth";
import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthProvider>
      <div className="pb-16">
        {children}
      </div>
      <BottomNav />
    </AuthProvider>
  );
}
