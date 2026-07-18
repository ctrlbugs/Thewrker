"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Cloud,
  Download,
  FileText,
  Folder,
  FolderPlus,
  Eye,
  Link2,
  Pencil,
  RotateCcw,
  Search,
  Star,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import {
  createVaultFolder,
  createVaultShareLink,
  downloadVaultItem,
  inviteVaultMember,
  listVaultItems,
  purgeVaultItems,
  renameVaultItem,
  restoreVaultItems,
  softDeleteVaultItems,
  toggleVaultStar,
  uploadVaultFiles,
  VAULT_QUOTA_BYTES,
  vaultUsedBytes,
} from "@/lib/vault/store";
import type { VaultItem } from "@/lib/vault/types";
import { cn } from "@/lib/utils";
import VaultFileViewer from "@/components/vault/VaultFileViewer";
import "@/app/vault.css";

type View = "all" | "starred" | "recent" | "deleted";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function VaultApp() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [view, setView] = useState<View>("all");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [viewing, setViewing] = useState<VaultItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setItems(listVaultItems());

  useEffect(() => {
    refresh();
  }, []);

  const used = vaultUsedBytes(items);
  const usedPct = Math.min(100, Math.round((used / VAULT_QUOTA_BYTES) * 100));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items;

    if (view === "deleted") {
      list = list.filter((i) => Boolean(i.deletedAt));
    } else {
      list = list.filter((i) => !i.deletedAt);
      if (view === "starred") list = list.filter((i) => i.starred);
      if (view === "recent") {
        list = [...list]
          .filter((i) => i.type === "file")
          .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt))
          .slice(0, 40);
      } else if (view === "all") {
        list = list.filter((i) => i.parentId === folderId);
      }
    }

    if (q) list = list.filter((i) => i.name.toLowerCase().includes(q));

    return list.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [items, view, folderId, query]);

  const folderTrail = useMemo(() => {
    const trail: VaultItem[] = [];
    let cur = folderId;
    while (cur) {
      const folder = items.find((i) => i.id === cur && i.type === "folder");
      if (!folder) break;
      trail.unshift(folder);
      cur = folder.parentId;
    }
    return trail;
  }, [folderId, items]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const result = await uploadVaultFiles(Array.from(files), folderId);
    refresh();
    if (result.skipped.length) {
      setNotice(`Uploaded ${result.ok.length}. Skipped: ${result.skipped.join(", ")}`);
    } else {
      setNotice(`Uploaded ${result.ok.length} file(s) to Vault.`);
    }
  };

  const title =
    view === "starred"
      ? "Starred"
      : view === "recent"
        ? "Recents"
        : view === "deleted"
          ? "Deleted files"
          : folderTrail.length
            ? folderTrail[folderTrail.length - 1].name
            : "All files";

  return (
    <div className="vault-root">
      <aside className="vault-side">
        <div className="vault-brand">
          <Cloud className="h-6 w-6 text-[#76bec5]" />
          <div>
            <strong>Vault</strong>
            <span>TheWrker Drive</span>
          </div>
        </div>

        <nav className="vault-nav">
          {(
            [
              ["all", "All files"],
              ["recent", "Recents"],
              ["starred", "Starred"],
              ["deleted", "Deleted files"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={cn("vault-nav-btn", view === key && "is-active")}
              onClick={() => {
                setView(key);
                if (key !== "all") setFolderId(null);
              }}
            >
              {key === "starred" ? (
                <Star className="h-4 w-4" />
              ) : key === "deleted" ? (
                <Trash2 className="h-4 w-4" />
              ) : key === "recent" ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {label}
            </button>
          ))}
        </nav>

        <div className="vault-side-foot">
          <div className="vault-storage">
            <p>
              Using <strong>{formatBytes(used)}</strong> of{" "}
              {formatBytes(VAULT_QUOTA_BYTES)}
            </p>
            <div className="vault-bar" aria-hidden>
              <i style={{ width: `${usedPct}%` }} />
            </div>
            <p style={{ fontSize: "0.75rem" }}>
              Browser staging · files stay on this device
            </p>
          </div>
        </div>
      </aside>

      <section className="vault-main">
        <div className="vault-top">
          <label className="vault-search">
            <Search className="h-4 w-4 text-[var(--v-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Vault"
              aria-label="Search Vault"
            />
          </label>
          <div className="vault-top-actions">
            <button
              type="button"
              className="vault-invite-btn"
              data-tip="Invite a member"
              aria-label="Invite a member"
              onClick={() => {
                const email = window.prompt("Invite someone to your Vault (email)");
                if (!email) return;
                const invite = inviteVaultMember(email);
                if (!invite) {
                  setNotice("Enter a valid email address.");
                  return;
                }
                setNotice(`Invited ${invite.email} to your Vault.`);
              }}
            >
              <UserPlus className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="vault-btn vault-btn--ghost"
              onClick={() => {
                const name = window.prompt("Folder name");
                if (!name) return;
                createVaultFolder(name, view === "all" ? folderId : null);
                setView("all");
                refresh();
              }}
            >
              <FolderPlus className="h-4 w-4" />
              New folder
            </button>
            <button
              type="button"
              className="vault-btn vault-btn--teal"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              void onUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="vault-head">
          <div>
            <h1>{title}</h1>
            {view === "all" && folderTrail.length > 0 ? (
              <p className="vault-meta" style={{ marginTop: "0.35rem" }}>
                <button
                  type="button"
                  className="vault-icon-btn"
                  style={{ width: "auto", padding: "0 0.25rem", fontWeight: 600 }}
                  onClick={() => setFolderId(null)}
                >
                  All files
                </button>
                {folderTrail.map((f) => (
                  <span key={f.id}>
                    {" / "}
                    <button
                      type="button"
                      className="vault-icon-btn"
                      style={{ width: "auto", padding: "0 0.25rem", fontWeight: 600 }}
                      onClick={() => setFolderId(f.id)}
                    >
                      {f.name}
                    </button>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>

        <div className="vault-filters">
          <button
            type="button"
            className={cn("vault-chip", view === "recent" && "is-active")}
            onClick={() => setView("recent")}
          >
            Recents
          </button>
          <button
            type="button"
            className={cn("vault-chip", view === "starred" && "is-active")}
            onClick={() => setView("starred")}
          >
            Starred
          </button>
        </div>

        {notice ? (
          <p className="vault-meta" style={{ padding: "0 1.15rem 0.75rem" }}>
            {notice}
          </p>
        ) : null}

        <div className="vault-table-wrap">
          {visible.length === 0 ? (
            <div className="vault-empty">
              <Cloud className="mx-auto mb-3 h-10 w-10 text-[#76bec5]" />
              <h2>Nothing here yet</h2>
              <p>Upload files or create a folder — like Drive, OneDrive, or Dropbox.</p>
              <button
                type="button"
                className="vault-btn"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload to Vault
              </button>
            </div>
          ) : (
            <table className="vault-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last modified</th>
                  <th>Size</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className="vault-row">
                    <td>
                      <div className="vault-name">
                        <span
                          className={cn(
                            "vault-icon",
                            item.type === "folder" && "vault-icon--folder"
                          )}
                        >
                          {item.type === "folder" ? (
                            <Folder className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </span>
                        <button
                          type="button"
                          className={cn(item.type === "file" && "is-file")}
                          title={
                            item.type === "file"
                              ? "Open preview"
                              : "Open folder"
                          }
                          onClick={() => {
                            if (item.deletedAt) return;
                            if (item.type === "folder") {
                              setView("all");
                              setFolderId(item.id);
                              return;
                            }
                            setViewing(item);
                          }}
                        >
                          {item.name}
                        </button>
                      </div>
                    </td>
                    <td className="vault-meta">{formatDate(item.modifiedAt)}</td>
                    <td className="vault-meta">
                      {item.type === "folder" ? "—" : formatBytes(item.size)}
                    </td>
                    <td>
                      <div className="vault-actions">
                        {!item.deletedAt ? (
                          <>
                            <button
                              type="button"
                              className="vault-icon-btn"
                              title={item.starred ? "Unstar" : "Star"}
                              onClick={() => {
                                toggleVaultStar(item.id);
                                refresh();
                              }}
                            >
                              <Star
                                className={cn(
                                  "h-4 w-4",
                                  item.starred && "fill-[#76bec5] text-[#76bec5]"
                                )}
                              />
                            </button>
                            {item.type === "file" ? (
                              <>
                                <button
                                  type="button"
                                  className="vault-icon-btn"
                                  title="View"
                                  onClick={() => setViewing(item)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="vault-icon-btn"
                                  title="Share link"
                                  onClick={async () => {
                                    const link = createVaultShareLink(item.id);
                                    refresh();
                                    if (!link) {
                                      setNotice("Unable to create share link.");
                                      return;
                                    }
                                    try {
                                      await navigator.clipboard.writeText(link);
                                      setNotice("Share link copied to clipboard.");
                                    } catch {
                                      window.prompt("Copy share link", link);
                                      setNotice("Share link ready to copy.");
                                    }
                                  }}
                                >
                                  <Link2 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="vault-icon-btn"
                                  title="Download"
                                  onClick={() => downloadVaultItem(item)}
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </>
                            ) : null}
                            <button
                              type="button"
                              className="vault-icon-btn"
                              title="Rename"
                              onClick={() => {
                                const next = window.prompt("Rename", item.name);
                                if (!next) return;
                                renameVaultItem(item.id, next);
                                refresh();
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="vault-icon-btn"
                              title="Delete"
                              onClick={() => {
                                softDeleteVaultItems([item.id]);
                                refresh();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="vault-icon-btn"
                              title="Restore"
                              onClick={() => {
                                restoreVaultItems([item.id]);
                                refresh();
                              }}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="vault-icon-btn"
                              title="Delete forever"
                              onClick={() => {
                                purgeVaultItems([item.id]);
                                refresh();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {viewing ? (
        <VaultFileViewer item={viewing} onClose={() => setViewing(null)} />
      ) : null}
    </div>
  );
}
