"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Wand2,
  CheckCircle,
  Library,
  Brain,
  Clock,
  FileText,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, anim: "icon-bounce" },
  { href: "/optimizer", label: "Optimizer", icon: Wand2, anim: "icon-float" },
  { href: "/evaluator", label: "Evaluator", icon: CheckCircle, anim: "icon-pulse" },
  { href: "/library", label: "Library", icon: Library, anim: "icon-bounce" },
  { href: "/contexts", label: "Context Memory", icon: Brain, anim: "icon-pulse" },
  { href: "/history", label: "History", icon: Clock, anim: "icon-spin-slow" },
  { href: "/templates", label: "Templates", icon: FileText, anim: "icon-float" },
  { href: "/settings", label: "Settings", icon: Settings, anim: "icon-spin-slow" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { profile, signOut } = useAuth();

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "User";

  return (
    <aside
      className={`fixed left-0 top-0 h-full glass flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-[68px]" : "w-[250px]"
      }`}
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 glow-card">
          <Sparkles size={20} className="text-white icon-float" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-gradient">
            PromptGenius
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--accent)] glow-border"
                  : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className={`shrink-0 ${isActive ? "icon-glow" : `group-hover:${item.anim}`}`} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* User info */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden shrink-0">
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
                <User size={14} className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{fullName}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
