"use client";
import { useState, useMemo } from "react";
import { FileText, Search, Copy, Wand2, ArrowRight, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { promptTemplates, categories } from "@/data/templates";
import { PromptTemplate } from "@/types";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTemplate, setActiveTemplate] = useState<PromptTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let result = promptTemplates;
    if (selectedCategory !== "All") result = result.filter((t) => t.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, selectedCategory]);

  const openTemplate = (template: PromptTemplate) => {
    setActiveTemplate(template);
    const vars: Record<string, string> = {};
    template.variables.forEach((v) => (vars[v] = ""));
    setVariables(vars);
  };

  const getFilledTemplate = () => {
    if (!activeTemplate) return "";
    let result = activeTemplate.template;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || `[${key}]`);
    });
    return result;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFilledTemplate());
    toast("success", "Template copied to clipboard!");
  };

  const handleOptimize = () => {
    const filled = getFilledTemplate();
    sessionStorage.setItem("pg_optimize_input", filled);
    window.location.href = "/optimizer";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-200 dark:border-amber-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Prompt Templates</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {promptTemplates.length} pre-built templates to jumpstart your prompts
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
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => openTemplate(template)}
            className="text-left bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)] hover:shadow-[var(--card-shadow)] transition-all group cursor-pointer"
          >
            <div className="text-2xl mb-3">{template.icon}</div>
            <h3 className="font-semibold text-sm mb-1 group-hover:text-[var(--accent)] transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">{template.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                {template.category}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">{template.variables.length} variables</span>
            </div>
          </button>
        ))}
      </div>

      {/* Template fill modal */}
      <Modal
        isOpen={!!activeTemplate}
        onClose={() => setActiveTemplate(null)}
        title={activeTemplate ? `${activeTemplate.icon} ${activeTemplate.name}` : ""}
        maxWidth="max-w-2xl"
      >
        {activeTemplate && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">{activeTemplate.description}</p>

            {/* Variable inputs */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Fill in the variables:</h4>
              {activeTemplate.variables.map((v) => (
                <div key={v}>
                  <label className="block text-sm font-medium mb-1 capitalize">{v.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    value={variables[v] || ""}
                    onChange={(e) => setVariables({ ...variables, [v]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    placeholder={`Enter ${v}...`}
                  />
                </div>
              ))}
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium mb-1">Preview</label>
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                {getFilledTemplate()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleCopy} icon={<Copy size={14} />} size="sm" variant="secondary">
                Copy
              </Button>
              <Button onClick={handleOptimize} icon={<Wand2 size={14} />} size="sm">
                Optimize This
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
