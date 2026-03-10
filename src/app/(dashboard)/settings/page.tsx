"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Settings, Sun, Moon, Monitor, User, Save, Trash2, Download, Upload, AlertTriangle, Camera, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { createClient } from "@/lib/supabase/browser";
import { Theme } from "@/types";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user: authUser, profile, signOut, refreshProfile } = useAuth();
  const { upload: uploadAvatar, isUploading, error: uploadError } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile && authUser) {
      setFormData({
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: authUser.email || "",
      });
    }
  }, [profile, authUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const success = await uploadAvatar(file);
    if (success) {
      toast("success", "Profile picture updated!");
    } else {
      toast("error", "Failed to upload profile picture");
    }
    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authUser.id);

    if (error) {
      toast("error", "Failed to update profile");
    } else {
      await refreshProfile();
      toast("success", "Profile updated!");
    }
    setIsSaving(false);
  };

  const handleExportData = () => {
    const data = {
      prompts: JSON.parse(localStorage.getItem("pg_prompts") || "[]"),
      folders: JSON.parse(localStorage.getItem("pg_folders") || "[]"),
      contexts: JSON.parse(localStorage.getItem("pg_contexts") || "[]"),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promptgenius-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("success", "Data exported successfully!");
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.prompts) localStorage.setItem("pg_prompts", JSON.stringify(data.prompts));
          if (data.folders) localStorage.setItem("pg_folders", JSON.stringify(data.folders));
          if (data.contexts) localStorage.setItem("pg_contexts", JSON.stringify(data.contexts));
          toast("success", "Data imported successfully! Refresh to see changes.");
        } catch {
          toast("error", "Invalid file format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDeleteAccount = async () => {
    // Clear localStorage data
    localStorage.removeItem("pg_prompts");
    localStorage.removeItem("pg_folders");
    localStorage.removeItem("pg_contexts");
    await signOut();
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={18} /> },
    { value: "dark", label: "Dark", icon: <Moon size={18} /> },
    { value: "system", label: "System", icon: <Monitor size={18} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Settings</h2>
            <p className="text-sm text-[var(--text-secondary)]">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Camera size={18} /> Profile Picture
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden shadow-lg">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            >
              {isUploading ? (
                <Loader2 size={20} className="text-white animate-spin" />
              ) : (
                <Camera size={20} className="text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              icon={<Upload size={14} />}
            >
              Upload Photo
            </Button>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              JPG, PNG or GIF. Max 2MB.
            </p>
            {uploadError && (
              <p className="text-xs text-[var(--danger)] mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <User size={18} /> Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] text-sm opacity-60"
            />
          </div>
        </div>
        <Button onClick={handleSaveProfile} isLoading={isSaving} icon={<Save size={16} />} className="mt-4">
          Save Profile
        </Button>
      </div>

      {/* Appearance */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4">Appearance</h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === t.value
                  ? "border-[var(--accent)] bg-[var(--accent-light)]"
                  : "border-[var(--border)] hover:border-[var(--accent)]/50"
              }`}
            >
              {t.icon}
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6">
        <h3 className="font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
            <div>
              <div className="font-medium text-sm">Export Data</div>
              <div className="text-xs text-[var(--text-secondary)]">Download all your prompts, folders, and contexts</div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExportData} icon={<Download size={14} />}>
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
            <div>
              <div className="font-medium text-sm">Import Data</div>
              <div className="text-xs text-[var(--text-secondary)]">Restore from a previous backup</div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleImportData} icon={<Upload size={14} />}>
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-red-200 dark:border-red-900 p-6">
        <h3 className="font-semibold mb-4 text-[var(--danger)] flex items-center gap-2">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Delete Account</div>
              <div className="text-xs text-[var(--text-secondary)]">Permanently delete your account and all data</div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
            <p className="text-sm text-[var(--danger)] font-medium mb-3">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleDeleteAccount} icon={<Trash2 size={14} />}>
                Yes, Delete Everything
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
