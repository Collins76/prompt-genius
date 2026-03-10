"use client";
import { useState } from "react";
import { CheckCircle, BarChart3, Lightbulb, ArrowRight, RotateCcw, Wand2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { evaluatePrompt } from "@/lib/ai-engine";
import { EvaluationResult } from "@/types";
import Link from "next/link";

export default function EvaluatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = () => {
    if (!input.trim()) {
      toast("error", "Please enter a prompt to evaluate");
      return;
    }
    setIsEvaluating(true);
    setTimeout(() => {
      const evaluation = evaluatePrompt(input);
      setResult(evaluation);
      setIsEvaluating(false);
      toast("success", "Evaluation complete!");
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 60) return "#10b981";
    if (score >= 40) return "var(--warning)";
    return "var(--danger)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Work";
  };

  const dimensions = result
    ? [
        { label: "Clarity", score: result.clarity },
        { label: "Specificity", score: result.specificity },
        { label: "Context", score: result.context },
        { label: "Actionability", score: result.actionability },
        { label: "Creativity", score: result.creativity },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-900/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Prompt Evaluator</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Get detailed feedback and quality scores for your prompts
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-sm">Enter Your Prompt</label>
              <span className="text-xs text-[var(--text-tertiary)]">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or type your prompt here to evaluate its quality..."
              className="w-full min-h-[250px] p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleEvaluate}
                isLoading={isEvaluating}
                icon={<BarChart3 size={16} />}
                className="flex-1 !bg-emerald-600 hover:!bg-emerald-700"
              >
                Evaluate Prompt
              </Button>
              <Button variant="ghost" onClick={() => { setInput(""); setResult(null); }} icon={<RotateCcw size={16} />}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isEvaluating ? (
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">Analyzing your prompt...</p>
              </div>
            </div>
          ) : result ? (
            <>
              {/* Overall Score */}
              <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 animate-fadeIn">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <svg width="100" height="100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={getScoreColor(result.overallScore)}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - result.overallScore / 100)}
                        className="score-ring"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                        {result.overallScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold" style={{ color: getScoreColor(result.overallScore) }}>
                      {getScoreLabel(result.overallScore)}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{result.feedback}</p>
                  </div>
                </div>
              </div>

              {/* Dimension scores */}
              <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 animate-fadeIn">
                <h3 className="font-medium text-sm mb-4">Detailed Breakdown</h3>
                <div className="space-y-3">
                  {dimensions.map((dim) => (
                    <div key={dim.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{dim.label}</span>
                        <span className="text-sm font-medium" style={{ color: getScoreColor(dim.score) }}>
                          {dim.score}/100
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${dim.score}%`,
                            backgroundColor: getScoreColor(dim.score),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 animate-fadeIn">
                  <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500" />
                    Suggestions for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{i + 1}</span>
                        </div>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link href="/optimizer" className="mt-4 inline-block">
                    <Button variant="secondary" size="sm" icon={<Wand2 size={14} />}>
                      Optimize This Prompt
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 min-h-[300px] flex items-center justify-center">
              <div className="text-center text-[var(--text-tertiary)]">
                <ArrowRight size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Evaluation results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
