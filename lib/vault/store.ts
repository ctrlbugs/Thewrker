"use client";

import type { VaultInvite, VaultItem, VaultState } from "./types";

const KEY = "thewrker.vault.v1";
const MAX_FILE_BYTES = 4 * 1024 * 1024; // keep localStorage sane

function uid(prefix = "v") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function read(): VaultState {
  if (typeof window === "undefined") return { items: [], invites: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { items: [], invites: [] };
    const parsed = JSON.parse(raw) as VaultState;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      invites: Array.isArray(parsed.invites) ? parsed.invites : [],
    };
  } catch {
    return { items: [], invites: [] };
  }
}

function write(state: VaultState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function listVaultItems(): VaultItem[] {
  return read().items;
}

export function saveVaultItems(items: VaultItem[]) {
  const state = read();
  write({ ...state, items });
}

export function listVaultInvites(): VaultInvite[] {
  return read().invites ?? [];
}

export function inviteVaultMember(email: string): VaultInvite | null {
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes("@")) return null;
  const state = read();
  const invites = state.invites ?? [];
  if (invites.some((i) => i.email === clean)) {
    return invites.find((i) => i.email === clean) ?? null;
  }
  const invite: VaultInvite = {
    id: uid("inv"),
    email: clean,
    createdAt: new Date().toISOString(),
  };
  write({ ...state, invites: [invite, ...invites] });
  return invite;
}

/** Ensure a share token exists and return a shareable URL */
export function createVaultShareLink(itemId: string): string | null {
  const state = read();
  const item = state.items.find((i) => i.id === itemId && i.type === "file");
  if (!item || item.deletedAt) return null;
  const token = item.shareToken || uid("share");
  if (!item.shareToken) {
    write({
      ...state,
      items: state.items.map((i) =>
        i.id === itemId
          ? { ...i, shareToken: token, modifiedAt: new Date().toISOString() }
          : i
      ),
    });
  }
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/dashboard/files/share/${token}`;
}

export function getVaultItemByShareToken(token: string): VaultItem | null {
  return (
    listVaultItems().find(
      (i) => i.type === "file" && i.shareToken === token && !i.deletedAt
    ) ?? null
  );
}

export function createVaultFolder(name: string, parentId: string | null = null): VaultItem {
  const now = new Date().toISOString();
  const folder: VaultItem = {
    id: uid(),
    name: name.trim() || "Untitled folder",
    type: "folder",
    size: 0,
    parentId,
    createdAt: now,
    modifiedAt: now,
    starred: false,
    deletedAt: null,
  };
  const items = listVaultItems();
  items.push(folder);
  saveVaultItems(items);
  return folder;
}

export async function uploadVaultFiles(
  files: File[],
  parentId: string | null = null
): Promise<{ ok: VaultItem[]; skipped: string[] }> {
  const items = listVaultItems();
  const ok: VaultItem[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      skipped.push(`${file.name} (over 4 MB staging limit)`);
      continue;
    }
    const dataUrl = await fileToDataUrl(file);
    const now = new Date().toISOString();
    const item: VaultItem = {
      id: uid(),
      name: file.name,
      type: "file",
      mime: file.type || "application/octet-stream",
      size: file.size,
      parentId,
      createdAt: now,
      modifiedAt: now,
      starred: false,
      deletedAt: null,
      dataUrl,
    };
    items.push(item);
    ok.push(item);
  }

  saveVaultItems(items);
  return { ok, skipped };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function toggleVaultStar(id: string) {
  const items = listVaultItems().map((item) =>
    item.id === id
      ? { ...item, starred: !item.starred, modifiedAt: new Date().toISOString() }
      : item
  );
  saveVaultItems(items);
}

export function softDeleteVaultItems(ids: string[]) {
  const now = new Date().toISOString();
  const items = listVaultItems().map((item) =>
    ids.includes(item.id) ? { ...item, deletedAt: now } : item
  );
  saveVaultItems(items);
}

export function restoreVaultItems(ids: string[]) {
  const items = listVaultItems().map((item) =>
    ids.includes(item.id) ? { ...item, deletedAt: null } : item
  );
  saveVaultItems(items);
}

export function purgeVaultItems(ids: string[]) {
  saveVaultItems(listVaultItems().filter((item) => !ids.includes(item.id)));
}

export function renameVaultItem(id: string, name: string) {
  const next = name.trim();
  if (!next) return;
  const items = listVaultItems().map((item) =>
    item.id === id
      ? { ...item, name: next, modifiedAt: new Date().toISOString() }
      : item
  );
  saveVaultItems(items);
}

export function downloadVaultItem(item: VaultItem) {
  if (!item.dataUrl) return;
  const link = document.createElement("a");
  link.href = item.dataUrl;
  link.download = item.name;
  link.click();
}

export function vaultUsedBytes(items: VaultItem[] = listVaultItems()) {
  return items
    .filter((i) => i.type === "file" && !i.deletedAt)
    .reduce((sum, i) => sum + i.size, 0);
}

export const VAULT_QUOTA_BYTES = 200 * 1024 * 1024;
