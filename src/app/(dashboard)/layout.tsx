"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ToastContainer from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    }
  }, [isLoading, user, router]);

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-[250px] transition-all duration-300">
        <TopBar />
        <main className="p-6">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
