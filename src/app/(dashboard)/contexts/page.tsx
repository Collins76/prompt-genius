"use client";
import { useState, useEffect } from "react";
import { Brain, Plus, Edit3, Trash2, ToggleLeft, ToggleRight, Save, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { getContexts, createContext, updateContext, deleteContext } from "@/lib/store";
import { ContextMemory } from "@/types";

export default function ContextsPage() {
  const [contexts, setContexts] = useState<ContextMemory[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<ContextMemory | null>(null);
  const [form, setForm] = useState({ name: "", description: "", content: "", isActive: true });

  const reload = () => setContexts(getContexts());

  useEffect(() => {
    reload();
  }, []);

  const handleCreate = () => {
    if (!form.name.trim() || !form.content.trim()) {
      toast("error", "Name and content are required");
      return;
    }
    createContext({
      name: form.name.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      isActive: form.isActive,
    });
    setForm({ name: "", description: "", content: "", isActive: true });
    setShowCreate(false);
    reload();
    toast("success", "Context created!");
  };

  const handleUpdate = () => {
    if (!editing) return;
    updateContext(editing.id, {
      name: form.name.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      isActive: form.isActive,
    });
    setEditing(null);
    reload();
    toast("success", "Context updated!");
  };

  const handleDelete = (id: string) => {
    deleteContext(id);
    reload();
    toast("success", "Context deleted");
  };

  const handleToggle = (id: string, isActive: boolean) => {
    updateContext(id, { isActive: !isActive });
    reload();
    toast("info", isActive ? "Context deactivated" : "Context activated");
  };

  const openEdit = (ctx: ContextMemory) => {
    setEditing(ctx);
    setForm({ name: ctx.name, description: ctx.description, content: ctx.content, isActive: ctx.isActive });
  };

  const activeCount = contexts.filter((c) => c.isActive).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-200 dark:border-purple-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Context Memory</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Store project contexts to automatically enhance your prompts
              </p>
            </div>
          </div>
          <Button onClick={() => { setForm({ name: "", description: "", content: "", isActive: true }); setShowCreate(true); }} icon={<Plus size={16} />}>
            New Context
          </Button>
        </div>
      </div>

      {/* Active indicator */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
        {activeCount} active context{activeCount !== 1 ? "s" : ""} will be injected into optimized prompts
      </div>

      {/* Context list */}
      {contexts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-[var(--text-tertiary)]" />
          </div>
          <h3 className="font-medium mb-1">No contexts yet</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Create contexts to provide background information for your prompts
          </p>
          <Button onClick={() => setShowCreate(true)} icon={<Plus size={16} />}>
            Create Your First Context
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contexts.map((ctx) => (
            <div
              key={ctx.id}
              className={`bg-[var(--bg-primary)] rounded-xl border p-5 transition-all ${
                ctx.isActive
                  ? "border-purple-300 dark:border-purple-800 shadow-[var(--card-shadow)]"
                  : "border-[var(--border)] opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{ctx.name}</h3>
                    {ctx.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  {ctx.description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{ctx.description}</p>
                  )}
                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {ctx.content}
                  </div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-2">
                    Updated {new Date(ctx.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleToggle(ctx.id, ctx.isActive)}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    title={ctx.isActive ? "Deactivate" : "Activate"}
                  >
                    {ctx.isActive ? (
                      <ToggleRight size={20} className="text-[var(--success)]" />
                    ) : (
                      <ToggleLeft size={20} className="text-[var(--text-tertiary)]" />
                    )}
                  </button>
                  <button onClick={() => openEdit(ctx)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(ctx.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--danger)] transition-colors cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreate || !!editing}
        onClose={() => { setShowCreate(false); setEditing(null); }}
        title={editing ? "Edit Context" : "Create New Context"}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="e.g., My SaaS Project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Brief description of this context"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Context Content *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full min-h-[150px] p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Enter background information, project details, audience info, brand guidelines, etc."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Active (inject into optimized prompts)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <Button onClick={editing ? handleUpdate : handleCreate} icon={<Save size={16} />} className="flex-1">
              {editing ? "Save Changes" : "Create Context"}
            </Button>
            <Button variant="ghost" onClick={() => { setShowCreate(false); setEditing(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
