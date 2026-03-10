"use client";
import { useState, useEffect, useMemo } from "react";
import { Clock, Copy, Trash2, Eye, Search, Calendar, Filter } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { getPrompts, deletePrompt } from "@/lib/store";
import { Prompt } from "@/types";

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

  const reload = () => setPrompts(getPrompts());
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    let result = [...prompts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (dateFilter !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (dateFilter === "today") cutoff.setHours(0, 0, 0, 0);
      else if (dateFilter === "week") cutoff.setDate(now.getDate() - 7);
      else if (dateFilter === "month") cutoff.setMonth(now.getMonth() - 1);
      result = result.filter((p) => new Date(p.createdAt) >= cutoff);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.originalPrompt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [prompts, search, dateFilter]);

  const handleDelete = (id: string) => {
    deletePrompt(id);
    reload();
    toast("success", "Prompt deleted");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("success", "Copied!");
  };

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Prompt[]> = {};
    filtered.forEach((p) => {
      const date = new Date(p.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(p);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-5 border border-blue-200 dark:border-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Clock size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Prompt History</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Browse all your past prompts organized by date
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        {(["all", "today", "week", "month"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer capitalize ${
              dateFilter === f
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            {f === "all" ? "All Time" : f === "week" ? "This Week" : f === "month" ? "This Month" : "Today"}
          </button>
        ))}
      </div>

      {/* History list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={32} className="mx-auto text-[var(--text-tertiary)] mb-3" />
          <h3 className="font-medium mb-1">No history yet</h3>
          <p className="text-sm text-[var(--text-secondary)]">Your prompt history will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} className="text-[var(--text-tertiary)]" />
                <h3 className="text-sm font-medium text-[var(--text-secondary)]">{date}</h3>
                <span className="text-xs text-[var(--text-tertiary)]">({items.length})</span>
              </div>
              <div className="space-y-2">
                {items.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="bg-[var(--bg-primary)] rounded-lg border border-[var(--border)] px-4 py-3 flex items-center gap-4 hover:shadow-[var(--card-shadow)] transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{prompt.title}</div>
                      <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{prompt.originalPrompt}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {prompt.score && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] font-medium">
                          {prompt.score}
                        </span>
                      )}
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {prompt.model}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {new Date(prompt.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingPrompt(prompt)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleCopy(prompt.optimizedPrompt)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                          <Copy size={14} />
                        </button>
                        <button onClick={() => handleDelete(prompt.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--danger)] cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View modal */}
      <Modal isOpen={!!viewingPrompt} onClose={() => setViewingPrompt(null)} title={viewingPrompt?.title || ""} maxWidth="max-w-2xl">
        {viewingPrompt && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">Original</label>
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-sm whitespace-pre-wrap">{viewingPrompt.originalPrompt}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">Optimized</label>
              <div className="p-3 rounded-lg bg-[var(--accent-light)] text-sm whitespace-pre-wrap">{viewingPrompt.optimizedPrompt}</div>
            </div>
            <Button onClick={() => handleCopy(viewingPrompt.optimizedPrompt)} icon={<Copy size={14} />} size="sm">
              Copy Optimized
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
