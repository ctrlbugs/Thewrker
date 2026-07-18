"use client";

import { SEED_PROFILES, CURRENT_USER_ID } from "@/lib/profile/seed";
import {
  normalizeUsername,
  type UserProfile,
} from "@/lib/profile/types";

const STORAGE_KEY = "thewrker.profiles.v1";

function cloneSeed(): UserProfile[] {
  return SEED_PROFILES.map((p) => ({
    ...p,
    followers: [...p.followers],
    following: [...p.following],
    social: { ...p.social },
  }));
}

export function loadProfiles(): UserProfile[] {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = cloneSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as UserProfile[];
    if (!Array.isArray(parsed) || parsed.length === 0) return cloneSeed();
    return parsed;
  } catch {
    return cloneSeed();
  }
}

export function saveProfiles(profiles: UserProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    /* ignore */
  }
}

export function getProfileByUsername(username: string): UserProfile | null {
  const key = normalizeUsername(username);
  return loadProfiles().find((p) => p.username === key) ?? null;
}

export function getCurrentProfile(): UserProfile {
  const profiles = loadProfiles();
  return profiles.find((p) => p.id === CURRENT_USER_ID) ?? profiles[0];
}

export function updateCurrentProfile(
  updates: Partial<UserProfile>
): UserProfile {
  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.id === CURRENT_USER_ID);
  if (idx < 0) return getCurrentProfile();
  const next: UserProfile = {
    ...profiles[idx],
    ...updates,
    username: updates.username
      ? normalizeUsername(updates.username)
      : profiles[idx].username,
    social: { ...profiles[idx].social, ...updates.social },
  };
  if (updates.coverUrl === "") delete next.coverUrl;
  if (updates.avatarUrl === "") delete next.avatarUrl;
  profiles[idx] = next;
  saveProfiles(profiles);
  return next;
}

/** Search by username (and name) — ready for discover/follow */
export function searchProfiles(query: string): UserProfile[] {
  const q = query.trim().toLowerCase().replace(/^@/, "");
  if (!q) return loadProfiles().slice(0, 8);
  return loadProfiles()
    .filter(
      (p) =>
        p.username.includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    )
    .slice(0, 12);
}

export function isFollowing(viewerId: string, targetId: string): boolean {
  const viewer = loadProfiles().find((p) => p.id === viewerId);
  return Boolean(viewer?.following.includes(targetId));
}

export function toggleFollow(targetId: string): UserProfile[] {
  const profiles = loadProfiles();
  const meIdx = profiles.findIndex((p) => p.id === CURRENT_USER_ID);
  const targetIdx = profiles.findIndex((p) => p.id === targetId);
  if (meIdx < 0 || targetIdx < 0 || targetId === CURRENT_USER_ID) {
    return profiles;
  }

  const me = profiles[meIdx];
  const target = profiles[targetIdx];
  const already = me.following.includes(targetId);

  if (already) {
    me.following = me.following.filter((id) => id !== targetId);
    target.followers = target.followers.filter((id) => id !== CURRENT_USER_ID);
  } else {
    me.following = [...me.following, targetId];
    if (!target.followers.includes(CURRENT_USER_ID)) {
      target.followers = [...target.followers, CURRENT_USER_ID];
    }
  }

  profiles[meIdx] = { ...me };
  profiles[targetIdx] = { ...target };
  saveProfiles(profiles);
  return profiles;
}
