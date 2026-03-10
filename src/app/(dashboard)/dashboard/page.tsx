"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wand2,
  CheckCircle,
  Library,
  Brain,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { getPrompts, getFolders, getContexts, seedSampleData } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { Prompt } from "@/types";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [folderCount, setFolderCount] = useState(0);
  const [contextCount, setContextCount] = useState(0);
  const { profile } = useAuth();
  const userName = profile?.first_name || "there";

  useEffect(() => {
    seedSampleData();
    setPrompts(getPrompts());
    setFolderCount(getFolders().length);
    setContextCount(getContexts().length);
  }, []);

  const favorites = prompts.filter((p) => p.isFavorite).length;
  const avgScore = prompts.length
    ? Math.round(prompts.reduce((sum, p) => sum + (p.score || 0), 0) / prompts.length)
    : 0;
  const recentPrompts = prompts.slice(0, 5);

  const stats = [
    {
      label: "Total Prompts",
      value: prompts.length,
      icon: Library,
      color: "from-emerald-500 to-green-500",
      href: "/library",
    },
    {
      label: "Favorites",
      value: favorites,
      icon: Star,
      color: "from-amber-500 to-orange-500",
      href: "/library",
    },
    {
      label: "Avg Score",
      value: avgScore || "—",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      href: "/evaluator",
    },
    {
      label: "Contexts",
      value: contextCount,
      icon: Brain,
      color: "from-teal-500 to-cyan-500",
      href: "/contexts",
    },
  ];

  const quickActions = [
    {
      label: "Optimize Prompt",
      description: "Transform your prompt into a powerful Super Prompt",
      icon: Wand2,
      href: "/optimizer",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Evaluate Prompt",
      description: "Get detailed feedback and a quality score",
      icon: CheckCircle,
      href: "/evaluator",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Browse Templates",
      description: "Start with 12+ pre-built prompt templates",
      icon: Sparkles,
      href: "/templates",
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Context Memory",
      description: "Set up project contexts for consistent prompts",
      icon: Brain,
      href: "/contexts",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {userName}!</h2>
          <p className="text-emerald-100 mb-4">
            Ready to craft some powerful prompts? Here&apos;s your overview.
          </p>
          <Link href="/optimizer">
            <Button variant="secondary" icon={<Zap size={16} />} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Quick Optimize
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[var(--bg-primary)] rounded-xl p-5 border border-[var(--border)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-lg)] transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon size={20} className="text-white" />
                </div>
                <div className="font-medium mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {action.label}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{action.description}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Prompts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Prompts</h3>
            {prompts.length > 0 && (
              <Link href="/library" className="text-sm text-[var(--accent)] hover:underline">
                View all
              </Link>
            )}
          </div>
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
            {recentPrompts.length === 0 ? (
              <div className="p-6 text-center">
                <Clock size={32} className="mx-auto text-[var(--text-tertiary)] mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">No prompts yet</p>
                <Link href="/optimizer" className="text-sm text-[var(--accent)] hover:underline mt-1 inline-block">
                  Create your first prompt
                </Link>
              </div>
            ) : (
              recentPrompts.map((prompt) => (
                <div key={prompt.id} className="p-3 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate flex-1">{prompt.title}</span>
                    {prompt.isFavorite && <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{prompt.originalPrompt}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {prompt.score && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] font-medium">
                        Score: {prompt.score}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
