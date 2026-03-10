export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginHistoryEntry {
  id: string;
  user_id: string;
  login_at: string;
  ip_address: string | null;
  user_agent: string | null;
  method: string;
  status: string;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  originalPrompt: string;
  optimizedPrompt: string;
  category: string;
  tags: string[];
  folderId: string | null;
  isFavorite: boolean;
  score: number | null;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  promptCount: number;
  createdAt: string;
}

export interface ContextMemory {
  id: string;
  userId: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  icon: string;
}

export interface EvaluationResult {
  overallScore: number;
  clarity: number;
  specificity: number;
  context: number;
  actionability: number;
  creativity: number;
  feedback: string;
  suggestions: string[];
}

export interface OptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  model: string;
}

export interface PromptHistory {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changeDescription: string;
  createdAt: string;
}

export type Theme = "light" | "dark" | "system";

export type AIModel = "chatgpt" | "claude" | "gemini" | "copilot" | "llama" | "general";
