"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useAuth } from "@/contexts/AuthContext";

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();

  const upload = async (file: File): Promise<boolean> => {
    if (!user) {
      setError("Not authenticated");
      return false;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return false;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return false;
    }

    setIsUploading(true);
    setError(null);

    try {
      const ext = file.name.split(".").pop() || "png";
      const filePath = `${user.id}/avatar.${ext}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add cache-busting param
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
