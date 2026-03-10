"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  FolderPlus,
  Star,
  Copy,
  Trash2,
  MoreHorizontal,
  Filter,
  Grid3x3,
  List,
  Download,
  FolderOpen,
  Tag,
  Eye,
  Edit3,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import {
  getPrompts,
  getFolders,
  createFolder,
  deleteFolder,
  updateFolder,
  deletePrompt,
  toggleFavorite,
  updatePrompt,
} from "@/lib/store";
import { Prompt, Folder } from "@/types";

export default function LibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#6366f1");
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [contextMenu, setContextMenu] = useState<{ promptId: string; x: number; y: number } | null>(null);

  const reload = () => {
    setPrompts(getPrompts());
    setFolders(getFolders());
  };

  useEffect(() => {
    reload();
  }, []);

  const filteredPrompts = useMemo(() => {
    let result = prompts;
    if (selectedFolder) result = result.filter((p) => p.folderId === selectedFolder);
    if (showFavorites) result = result.filter((p) => p.isFavorite);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.originalPrompt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [prompts, selectedFolder, showFavorites, search]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), newFolderColor);
    setNewFolderName("");
    setShowNewFolder(false);
    reload();
    toast("success", "Folder created!");
  };

  const handleDeleteFolder = (id: string) => {
    deleteFolder(id);
    if (selectedFolder === id) setSelectedFolder(null);
    reload();
    toast("success", "Folder deleted");
  };

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id);
    setContextMenu(null);
    reload();
    toast("success", "Prompt deleted");
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    reload();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("success", "Copied to clipboard!");
  };

  const handleMoveToFolder = (promptId: string, folderId: string | null) => {
    updatePrompt(promptId, { folderId });
    setContextMenu(null);
    reload();
    toast("success", folderId ? "Moved to folder" : "Removed from folder");
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredPrompts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompts-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("success", `Exported ${filteredPrompts.length} prompts`);
  };

  const folderColors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <Button
          variant={showFavorites ? "primary" : "secondary"}
          size="sm"
          onClick={() => setShowFavorites(!showFavorites)}
          icon={<Star size={14} className={showFavorites ? "fill-white" : ""} />}
        >
          Favorites
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          {viewMode === "grid" ? <List size={14} /> : <Grid3x3 size={14} />}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download size={14} />}>
          Export
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Folder sidebar */}
        <div className="w-56 shrink-0 space-y-2 hidden lg:block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Folders</span>
            <button onClick={() => setShowNewFolder(true)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded cursor-pointer">
              <FolderPlus size={16} />
            </button>
          </div>

          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              !selectedFolder ? "bg-[var(--accent-light)] text-[var(--accent)]" : "hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            <Filter size={16} />
            All Prompts
            <span className="ml-auto text-xs">{prompts.length}</span>
          </button>

          {folders.map((folder) => (
            <div key={folder.id} className="group relative">
              <button
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  selectedFolder === folder.id
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <FolderOpen size={16} style={{ color: folder.color }} />
                <span className="truncate flex-1 text-left">{folder.name}</span>
                <span className="text-xs">{prompts.filter((p) => p.folderId === folder.id).length}</span>
              </button>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-0.5">
                <button onClick={() => setEditingFolder(folder)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded cursor-pointer">
                  <Edit3 size={12} />
                </button>
                <button onClick={() => handleDeleteFolder(folder.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-[var(--danger)] cursor-pointer">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {showNewFolder && (
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] space-y-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
              <div className="flex gap-1">
                {folderColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewFolderColor(c)}
                    className={`w-5 h-5 rounded-full cursor-pointer ${newFolderColor === c ? "ring-2 ring-offset-2 ring-[var(--accent)]" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateFolder} className="flex-1">
                  Create
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNewFolder(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Prompts grid/list */}
        <div className="flex-1">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-[var(--text-tertiary)]" />
              </div>
              <h3 className="font-medium mb-1">No prompts found</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {search ? "Try a different search term" : "Start by optimizing a prompt"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-4 hover:shadow-[var(--card-shadow)] transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-sm truncate flex-1">{prompt.title}</h3>
                    <div className="flex gap-0.5 shrink-0">
                      <button onClick={() => handleToggleFavorite(prompt.id)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                        <Star size={14} className={prompt.isFavorite ? "text-amber-500 fill-amber-500" : "text-[var(--text-tertiary)]"} />
                      </button>
                      <button onClick={() => setContextMenu({ promptId: prompt.id, x: 0, y: 0 })} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{prompt.originalPrompt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {prompt.score && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] font-medium">
                          {prompt.score}
                        </span>
                      )}
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                        {prompt.model}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setViewingPrompt(prompt)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleCopy(prompt.optimizedPrompt)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                        <Copy size={14} />
                      </button>
                      <button onClick={() => handleDeletePrompt(prompt.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--danger)] cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
              {filteredPrompts.map((prompt) => (
                <div key={prompt.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
                  <button onClick={() => handleToggleFavorite(prompt.id)} className="cursor-pointer">
                    <Star size={16} className={prompt.isFavorite ? "text-amber-500 fill-amber-500" : "text-[var(--text-tertiary)]"} />
                  </button>
                  <div className="flex-1 min-w-0" onClick={() => setViewingPrompt(prompt)} role="button" tabIndex={0}>
                    <div className="font-medium text-sm truncate">{prompt.title}</div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">{prompt.originalPrompt}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {prompt.score && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] font-medium">{prompt.score}</span>
                    )}
                    <span className="text-xs text-[var(--text-tertiary)]">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleCopy(prompt.optimizedPrompt)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] cursor-pointer">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => handleDeletePrompt(prompt.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-[var(--danger)] cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Context menu for moving to folders */}
      {contextMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] shadow-lg p-2 min-w-[200px] animate-scaleIn">
            <div className="px-3 py-1.5 text-xs font-medium text-[var(--text-tertiary)]">Move to folder</div>
            <button
              onClick={() => handleMoveToFolder(contextMenu.promptId, null)}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer"
            >
              No folder
            </button>
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => handleMoveToFolder(contextMenu.promptId, f.id)}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center gap-2 cursor-pointer"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View prompt modal */}
      <Modal isOpen={!!viewingPrompt} onClose={() => setViewingPrompt(null)} title={viewingPrompt?.title || ""} maxWidth="max-w-2xl">
        {viewingPrompt && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">Original Prompt</label>
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] text-sm whitespace-pre-wrap">{viewingPrompt.originalPrompt}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-secondary)] block mb-1">Optimized Prompt</label>
              <div className="p-3 rounded-lg bg-[var(--accent-light)] text-sm whitespace-pre-wrap">{viewingPrompt.optimizedPrompt}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-[var(--text-tertiary)]" />
              {viewingPrompt.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]">{tag}</span>
              ))}
              <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                Created {new Date(viewingPrompt.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleCopy(viewingPrompt.optimizedPrompt)} icon={<Copy size={14} />} size="sm">
                Copy Optimized
              </Button>
              <Button variant="secondary" onClick={() => handleCopy(viewingPrompt.originalPrompt)} icon={<Copy size={14} />} size="sm">
                Copy Original
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit folder modal */}
      <Modal isOpen={!!editingFolder} onClose={() => setEditingFolder(null)} title="Edit Folder">
        {editingFolder && (
          <div className="space-y-3">
            <input
              type="text"
              defaultValue={editingFolder.name}
              onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <div className="flex gap-1">
              {folderColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setEditingFolder({ ...editingFolder, color: c })}
                  className={`w-6 h-6 rounded-full cursor-pointer ${editingFolder.color === c ? "ring-2 ring-offset-2 ring-[var(--accent)]" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                updateFolder(editingFolder.id, { name: editingFolder.name, color: editingFolder.color });
                setEditingFolder(null);
                reload();
                toast("success", "Folder updated");
              }}
            >
              Save Changes
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
