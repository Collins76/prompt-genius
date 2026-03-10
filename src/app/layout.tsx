import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "PromptGenius - AI Prompt Optimizer & Manager",
  description:
    "Create, optimize, evaluate, and manage your AI prompts. Works with ChatGPT, Claude, Gemini, Copilot, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
