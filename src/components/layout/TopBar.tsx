"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Bell, User, Settings, LogOut, BellOff } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/optimizer": "Prompt Optimizer",
  "/evaluator": "Prompt Evaluator",
  "/library": "Prompt Library",
  "/contexts": "Context Memory",
  "/history": "History",
  "/templates": "Templates",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { profile, user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || user?.email || "User"
    : user?.email || "User";

  const title = pageTitles[pathname] || "PromptGenius";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 glass flex items-center justify-between px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <h1 className="text-xl font-semibold shrink-0">{title}</h1>
        <div className="overflow-hidden flex-1 max-w-[500px] marquee-container">
          <span className="inline-block whitespace-nowrap marquee-text">
            This PromptGenius App Was Designed and Built By Collins Anyanwu
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={20} className="icon-float" /> : <Moon size={20} className="icon-pulse" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors relative cursor-pointer"
          >
            <Bell size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl glass border border-[var(--border)] shadow-2xl z-50 animate-fadeIn overflow-hidden">
              <div className="px-4 py-3 font-semibold text-sm" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                Notifications
              </div>
              <div className="px-4 py-8 flex flex-col items-center text-center">
                <BellOff size={32} className="text-[var(--text-tertiary)] mb-3" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">No notifications yet</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">We&apos;ll notify you when something important happens</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-3 ml-1 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)] overflow-hidden">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={fullName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <span className="text-sm font-medium hidden sm:block max-w-[140px] truncate">{fullName}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl glass border border-[var(--border)] shadow-2xl z-50 animate-fadeIn overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={fullName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{fullName}</p>
                    <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
