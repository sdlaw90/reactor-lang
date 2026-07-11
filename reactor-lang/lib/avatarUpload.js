import { supabase } from "./supabaseClient";

export const AVATAR_EMOJIS = ["🦊", "🐙", "🌟", "🚀", "🍕", "🐢", "🦄", "🎸", "🌈", "🔥", "🎯", "🐼", "🦁", "🌺", "⚡", "🎮"];

export async function uploadAvatarPhoto(userId, file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, cacheControl: "3600" });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Cache-bust so a re-uploaded photo shows immediately even at the same path.
  return `${data.publicUrl}?t=${Date.now()}`;
}
