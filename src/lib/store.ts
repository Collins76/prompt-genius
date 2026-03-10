import { Prompt, Folder, ContextMemory, User, Theme } from "@/types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEYS = {
  user: "pg_user",
  prompts: "pg_prompts",
  folders: "pg_folders",
  contexts: "pg_contexts",
  theme: "pg_theme",
  authToken: "pg_auth_token",
};

// Helper for safe localStorage access
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Auth
export function getUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.user, null);
}

export function setUser(user: User): void {
  setItem(STORAGE_KEYS.user, user);
  setItem(STORAGE_KEYS.authToken, uuidv4());
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

// Theme
export function getTheme(): Theme {
  return getItem<Theme>(STORAGE_KEYS.theme, "light");
}

export function setTheme(theme: Theme): void {
  setItem(STORAGE_KEYS.theme, theme);
}

// Prompts
export function getPrompts(): Prompt[] {
  return getItem<Prompt[]>(STORAGE_KEYS.prompts, []);
}

export function savePrompt(prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">): Prompt {
  const prompts = getPrompts();
  const newPrompt: Prompt = {
    ...prompt,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  prompts.unshift(newPrompt);
  setItem(STORAGE_KEYS.prompts, prompts);
  return newPrompt;
}

export function updatePrompt(id: string, updates: Partial<Prompt>): Prompt | null {
  const prompts = getPrompts();
  const index = prompts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  prompts[index] = { ...prompts[index], ...updates, updatedAt: new Date().toISOString() };
  setItem(STORAGE_KEYS.prompts, prompts);
  return prompts[index];
}

export function deletePrompt(id: string): void {
  const prompts = getPrompts().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.prompts, prompts);
}

export function toggleFavorite(id: string): void {
  const prompts = getPrompts();
  const index = prompts.findIndex((p) => p.id === id);
  if (index !== -1) {
    prompts[index].isFavorite = !prompts[index].isFavorite;
    setItem(STORAGE_KEYS.prompts, prompts);
  }
}

// Folders
export function getFolders(): Folder[] {
  return getItem<Folder[]>(STORAGE_KEYS.folders, []);
}

export function createFolder(name: string, color: string = "#6366f1"): Folder {
  const folders = getFolders();
  const folder: Folder = {
    id: uuidv4(),
    userId: getUser()?.id || "",
    name,
    color,
    promptCount: 0,
    createdAt: new Date().toISOString(),
  };
  folders.push(folder);
  setItem(STORAGE_KEYS.folders, folders);
  return folder;
}

export function updateFolder(id: string, updates: Partial<Folder>): void {
  const folders = getFolders();
  const index = folders.findIndex((f) => f.id === id);
  if (index !== -1) {
    folders[index] = { ...folders[index], ...updates };
    setItem(STORAGE_KEYS.folders, folders);
  }
}

export function deleteFolder(id: string): void {
  const folders = getFolders().filter((f) => f.id !== id);
  setItem(STORAGE_KEYS.folders, folders);
  // Unassign prompts from the deleted folder
  const prompts = getPrompts().map((p) =>
    p.folderId === id ? { ...p, folderId: null } : p
  );
  setItem(STORAGE_KEYS.prompts, prompts);
}

// Context Memory
export function getContexts(): ContextMemory[] {
  return getItem<ContextMemory[]>(STORAGE_KEYS.contexts, []);
}

export function createContext(data: Omit<ContextMemory, "id" | "userId" | "createdAt" | "updatedAt">): ContextMemory {
  const contexts = getContexts();
  const ctx: ContextMemory = {
    ...data,
    id: uuidv4(),
    userId: getUser()?.id || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  contexts.push(ctx);
  setItem(STORAGE_KEYS.contexts, contexts);
  return ctx;
}

export function updateContext(id: string, updates: Partial<ContextMemory>): void {
  const contexts = getContexts();
  const index = contexts.findIndex((c) => c.id === id);
  if (index !== -1) {
    contexts[index] = { ...contexts[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.contexts, contexts);
  }
}

export function deleteContext(id: string): void {
  const contexts = getContexts().filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.contexts, contexts);
}

// Seed sample data for dashboard cards
export function seedSampleData(): void {
  if (typeof window === "undefined") return;

  const existingPrompts = getPrompts();
  const existingContexts = getContexts();

  // Only seed if no data exists
  if (existingPrompts.length > 0 || existingContexts.length > 0) return;

  const now = new Date();

  const samplePrompts: Prompt[] = [
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Blog Post Generator",
      originalPrompt: "Write a blog post about AI",
      optimizedPrompt: "I need you to write a comprehensive blog post about artificial intelligence...",
      category: "writing",
      tags: ["blog", "AI", "writing"],
      folderId: null,
      isFavorite: true,
      score: 100,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 1).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 1).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Code Review Assistant",
      originalPrompt: "Review my code for bugs",
      optimizedPrompt: "I need you to perform a thorough code review analyzing the following code...",
      category: "coding",
      tags: ["code", "review", "debugging"],
      folderId: null,
      isFavorite: true,
      score: 98,
      model: "claude",
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Marketing Copy Writer",
      originalPrompt: "Write marketing copy for my product",
      optimizedPrompt: "I need you to craft compelling marketing copy for a product launch...",
      category: "marketing",
      tags: ["marketing", "copywriting", "product"],
      folderId: null,
      isFavorite: false,
      score: 95,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Data Analysis Report",
      originalPrompt: "Analyze this dataset",
      optimizedPrompt: "I need you to perform a comprehensive data analysis on the provided dataset...",
      category: "analysis",
      tags: ["data", "analysis", "report"],
      folderId: null,
      isFavorite: false,
      score: 92,
      model: "gemini",
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Email Template Creator",
      originalPrompt: "Write a professional email",
      optimizedPrompt: "I need you to compose a professional email template with context and background...",
      category: "writing",
      tags: ["email", "professional", "template"],
      folderId: null,
      isFavorite: true,
      score: 100,
      model: "claude",
      createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "SEO Content Strategy",
      originalPrompt: "Create an SEO strategy",
      optimizedPrompt: "I need you to develop a comprehensive SEO content strategy...",
      category: "marketing",
      tags: ["SEO", "content", "strategy"],
      folderId: null,
      isFavorite: false,
      score: 97,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "API Documentation Writer",
      originalPrompt: "Write API docs",
      optimizedPrompt: "I need you to create comprehensive API documentation with examples...",
      category: "coding",
      tags: ["API", "documentation", "technical"],
      folderId: null,
      isFavorite: true,
      score: 100,
      model: "claude",
      createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Creative Story Prompt",
      originalPrompt: "Write a short story",
      optimizedPrompt: "I need you to explore and brainstorm a creative short story with unique perspectives...",
      category: "creative",
      tags: ["story", "creative", "fiction"],
      folderId: null,
      isFavorite: false,
      score: 94,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Resume Optimizer",
      originalPrompt: "Improve my resume",
      optimizedPrompt: "I need you to optimize and enhance a professional resume...",
      category: "writing",
      tags: ["resume", "career", "professional"],
      folderId: null,
      isFavorite: false,
      score: 96,
      model: "gemini",
      createdAt: new Date(now.getTime() - 86400000 * 9).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 9).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Unit Test Generator",
      originalPrompt: "Generate unit tests",
      optimizedPrompt: "I need you to generate comprehensive unit tests with step-by-step coverage...",
      category: "coding",
      tags: ["testing", "unit tests", "code"],
      folderId: null,
      isFavorite: true,
      score: 99,
      model: "claude",
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Product Description Writer",
      originalPrompt: "Write product descriptions",
      optimizedPrompt: "I need you to craft compelling product descriptions for e-commerce...",
      category: "marketing",
      tags: ["product", "ecommerce", "description"],
      folderId: null,
      isFavorite: false,
      score: 93,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 11).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 11).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      title: "Meeting Summary Bot",
      originalPrompt: "Summarize meeting notes",
      optimizedPrompt: "I need you to create a structured meeting summary with action items...",
      category: "business",
      tags: ["meeting", "summary", "business"],
      folderId: null,
      isFavorite: false,
      score: 91,
      model: "chatgpt",
      createdAt: new Date(now.getTime() - 86400000 * 12).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 12).toISOString(),
    },
  ];

  const sampleContexts: ContextMemory[] = [
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      name: "Tech Startup",
      description: "Context for a SaaS tech startup focused on AI productivity tools",
      content: "We are an AI-powered productivity startup building tools for developers. Our tone is professional yet approachable. Target audience: software engineers and tech leads.",
      isActive: true,
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      name: "E-commerce Brand",
      description: "Context for a direct-to-consumer lifestyle brand",
      content: "We are a lifestyle brand selling eco-friendly home products. Our voice is warm, sustainable-focused, and community-driven. Target audience: environmentally conscious millennials.",
      isActive: true,
      createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      name: "Education Platform",
      description: "Context for an online learning platform",
      content: "We provide online courses for professional development. Our tone is encouraging, educational, and accessible. Target audience: mid-career professionals seeking upskilling.",
      isActive: false,
      createdAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 8).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      name: "Healthcare App",
      description: "Context for a patient-facing health and wellness app",
      content: "We build a mobile health app for chronic disease management. Our tone is compassionate, clinical accuracy is crucial. Target audience: patients and caregivers aged 30-65.",
      isActive: true,
      createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 10).toISOString(),
    },
    {
      id: uuidv4(),
      userId: getUser()?.id || "demo",
      name: "Finance Blog",
      description: "Context for personal finance and investing content",
      content: "We run a personal finance blog covering budgeting, investing, and financial independence. Tone is informative and empowering. Target audience: young professionals aged 22-35.",
      isActive: false,
      createdAt: new Date(now.getTime() - 86400000 * 14).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 14).toISOString(),
    },
  ];

  setItem(STORAGE_KEYS.prompts, samplePrompts);
  setItem(STORAGE_KEYS.contexts, sampleContexts);
}
