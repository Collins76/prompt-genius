"use client";
import { useState, useEffect } from "react";
import {
  Wand2,
  Copy,
  Save,
  RotateCcw,
  CheckCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { optimizePrompt } from "@/lib/ai-engine";
import { savePrompt, getContexts } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { AIModel, OptimizationResult } from "@/types";

const models: { value: AIModel; label: string }[] = [
  { value: "general", label: "General (All Models)" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "copilot", label: "Copilot" },
  { value: "llama", label: "LLaMA" },
];

const quickPrompts = [
  "Write a professional email to a client about a project delay",
  "Create a marketing plan for a new SaaS product launch",
  "Explain quantum computing to a 10-year-old",
  "Generate a code review checklist for a React application",
];

export default function OptimizerPage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<AIModel>("general");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user: authUser } = useAuth();

  // Support receiving input from templates page
  useEffect(() => {
    const stored = sessionStorage.getItem("pg_optimize_input");
    if (stored) {
      setInput(stored);
      sessionStorage.removeItem("pg_optimize_input");
    }
  }, []);

  const handleOptimize = () => {
    if (!input.trim()) {
      toast("error", "Please enter a prompt to optimize");
      return;
    }
    setIsOptimizing(true);
    setIsSaved(false);

    // Simulate processing time for UX
    setTimeout(() => {
      const contexts = getContexts();
      const optimized = optimizePrompt(input, model, contexts);
      setResult(optimized);
      setIsOptimizing(false);
      toast("success", "Prompt optimized successfully!");
    }, 1200);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      toast("success", "Copied to clipboard!");
    }
  };

  const handleSave = () => {
    if (result) {
      savePrompt({
        userId: authUser?.id || "",
        title: input.slice(0, 60) + (input.length > 60 ? "..." : ""),
        originalPrompt: input,
        optimizedPrompt: result.optimizedPrompt,
        category: "optimized",
        tags: [model],
        folderId: null,
        isFavorite: false,
        score: null,
        model,
      });
      setIsSaved(true);
      toast("success", "Prompt saved to library!");
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setIsSaved(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header card */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-900/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Wand2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Prompt Optimizer</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Transform basic prompts into powerful, optimized Super Prompts
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-sm">Your Prompt</label>
              <span className="text-xs text-[var(--text-tertiary)]">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt here... e.g., 'Write a blog post about AI in healthcare'"
              className="w-full min-h-[200px] p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />

            {/* Model selector */}
            <div className="mt-3">
              <label className="text-sm font-medium mb-1.5 block">Target AI Model</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as AIModel)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {models.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleOptimize} isLoading={isOptimizing} icon={<Sparkles size={16} />} className="flex-1">
                Optimize
              </Button>
              <Button variant="ghost" onClick={handleReset} icon={<RotateCcw size={16} />}>
                Reset
              </Button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-amber-500" />
              <span className="font-medium text-sm">Try These</span>
            </div>
            <div className="space-y-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setInput(qp)}
                  className="w-full text-left text-sm p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all duration-200 cursor-pointer"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--accent)]" />
                Optimized Super Prompt
              </label>
              {result && (
                <div className="flex gap-1">
                  <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer" title="Copy">
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer disabled:opacity-50"
                    title="Save"
                  >
                    {isSaved ? <CheckCircle size={16} className="text-[var(--success)]" /> : <Save size={16} />}
                  </button>
                </div>
              )}
            </div>

            {isOptimizing ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-[var(--text-secondary)]">Optimizing your prompt...</p>
                </div>
              </div>
            ) : result ? (
              <div className="min-h-[200px] p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm whitespace-pre-wrap animate-fadeIn">
                {result.optimizedPrompt}
              </div>
            ) : (
              <div className="min-h-[200px] flex items-center justify-center text-[var(--text-tertiary)] text-sm">
                <div className="text-center">
                  <ArrowRight size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Your optimized prompt will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Improvements */}
          {result && result.improvements.length > 0 && (
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 animate-fadeIn">
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--success)]" />
                Improvements Applied
              </h3>
              <ul className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
