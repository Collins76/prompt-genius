"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const trackLogin = async (method: string, status: string) => {
    try {
      await fetch("/api/track-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, status }),
      });
    } catch {
      // Non-critical — don't block login if tracking fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      await trackLogin("email", "success");
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    setError("");
    const demoEmail = "demo@promptgenius.app";
    const demoPassword = "demo123456";

    // Try signing in first
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (signInError) {
      // If account doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: { data: { first_name: "Demo", last_name: "User" } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsDemoLoading(false);
        return;
      }

      if (signUpData.user) {
        await trackLogin("demo", "success");
        router.push("/dashboard");
      }
    } else if (data.user) {
      await trackLogin("demo", "success");
      router.push("/dashboard");
    }
    setIsDemoLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">PromptGenius</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Transform Your Prompts<br />Into Powerful Results
          </h2>
          <p className="text-lg text-emerald-100 max-w-md">
            Optimize, evaluate, and manage your AI prompts with our intelligent prompt engineering platform.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          {["Instant prompt optimization for any AI model", "Smart evaluation with actionable feedback", "Organized library with folders and tags"].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              PromptGenius
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-[var(--text-secondary)] mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-[var(--danger)] text-sm border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-sm text-[var(--text-tertiary)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <Button variant="secondary" onClick={handleDemo} isLoading={isDemoLoading} className="w-full" size="lg">
            Try Demo Account
          </Button>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--accent)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
