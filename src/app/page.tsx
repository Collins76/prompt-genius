"use client";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  CheckCircle,
  Library,
  Brain,
  FileText,
  Clock,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const features = [
    {
      icon: Wand2,
      title: "Prompt Optimizer",
      description: "Transform basic prompts into powerful Super Prompts optimized for any AI model. Get instant improvements with smart algorithms.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: CheckCircle,
      title: "Prompt Evaluator",
      description: "Get detailed quality scores across 5 dimensions: clarity, specificity, context, actionability, and creativity.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Library,
      title: "Prompt Library",
      description: "Save, organize, tag, and search all your prompts. Create custom folders and find your best work instantly.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Brain,
      title: "Context Memory",
      description: "Store project backgrounds, brand guidelines, and audience info. Automatically inject context into every prompt.",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: FileText,
      title: "Template Library",
      description: "12+ pre-built templates for content writing, development, marketing, education, and more. Fill variables and go.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Globe,
      title: "Multi-Model Support",
      description: "Optimized for ChatGPT, Claude, Gemini, Copilot, and LLaMA. Get model-specific tuning for best results.",
      color: "from-lime-500 to-green-600",
    },
  ];

  const benefits = [
    { icon: Zap, text: "10x better AI responses" },
    { icon: Clock, text: "Save hours of trial and error" },
    { icon: Shield, text: "100% private — your data stays local" },
    { icon: Star, text: "No API keys required" },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              PromptGenius
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-[var(--bg-secondary)] dark:to-teal-950/30" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium mb-6">
            <Sparkles size={14} />
            AI-Powered Prompt Engineering Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Prompts
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Into Powerful Results
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Create, optimize, evaluate, and manage your AI prompts. Works with ChatGPT, Claude, Gemini, Copilot, and more. Get 10x better AI responses in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/25"
            >
              Start Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              Try Demo
            </Link>
          </div>

          {/* Benefits bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <b.icon size={16} className="text-[var(--accent)]" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need for Perfect Prompts</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              A complete toolkit for creating, optimizing, and managing AI prompts across all major platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[var(--card-shadow-lg)] transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-[var(--text-secondary)]">Three simple steps to better AI responses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter Your Prompt",
                description: "Type or paste any prompt — from a simple question to a complex instruction.",
              },
              {
                step: "2",
                title: "Optimize & Evaluate",
                description: "Our AI engine analyzes and enhances your prompt with proven optimization strategies.",
              },
              {
                step: "3",
                title: "Use & Save",
                description: "Copy the optimized prompt to any AI tool. Save to your library for reuse.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <Sparkles size={40} className="mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl font-bold mb-3">Ready to Create Better Prompts?</h2>
              <p className="text-emerald-100 max-w-lg mx-auto mb-8">
                Join PromptGenius today and start getting better results from every AI interaction. No API keys needed — completely free to start.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Get Started Free <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">PromptGenius</span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            Built with Next.js &amp; Tailwind CSS. Your data stays local.
          </p>
        </div>
      </footer>
    </div>
  );
}
