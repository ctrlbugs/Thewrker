"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Cloud, Download, Eye, FileText } from "lucide-react";
import { downloadVaultItem, getVaultItemByShareToken } from "@/lib/vault/store";
import type { VaultItem } from "@/lib/vault/types";
import VaultFileViewer from "@/components/vault/VaultFileViewer";
import "@/app/vault.css";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VaultSharePage() {
  const params = useParams();
  const token = String(params?.token ?? "");
  const [item, setItem] = useState<VaultItem | null>(null);
  const [ready, setReady] = useState(false);
  const [viewing, setViewing] = useState(false);

  useEffect(() => {
    setItem(token ? getVaultItemByShareToken(token) : null);
    setReady(true);
  }, [token]);

  return (
    <div className="mx-auto w-full max-w-[720px] px-1 py-6">
      <div className="vault-root" style={{ gridTemplateColumns: "1fr", minHeight: "auto" }}>
        <section className="vault-main" style={{ padding: "1.5rem" }}>
          <div className="vault-brand" style={{ padding: 0, marginBottom: "1.25rem" }}>
            <Cloud className="h-6 w-6 text-[#76bec5]" />
            <div>
              <strong>Vault</strong>
              <span>Shared file</span>
            </div>
          </div>

          {!ready ? (
            <p className="vault-meta">Loading share…</p>
          ) : !item ? (
            <div className="vault-empty" style={{ padding: "2rem 0" }}>
              <h2>Link unavailable</h2>
              <p>
                This share link is invalid, expired, or only available on the device that
                created it (browser staging).
              </p>
              <Link href="/dashboard/files" className="vault-btn">
                Open Vault
              </Link>
            </div>
          ) : (
            <div className="vault-name" style={{ alignItems: "flex-start", gap: "1rem" }}>
              <span className="vault-icon">
                <FileText className="h-5 w-5" />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    wordBreak: "break-word",
                  }}
                >
                  {item.name}
                </h1>
                <p className="vault-meta" style={{ marginTop: "0.35rem" }}>
                  {formatBytes(item.size)} · shared from Vault
                </p>
                <div style={{ display: "flex", gap: "0.55rem", marginTop: "1.15rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="vault-btn vault-btn--teal"
                    onClick={() => setViewing(true)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    className="vault-btn"
                    onClick={() => downloadVaultItem(item)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <Link href="/dashboard/files" className="vault-btn vault-btn--ghost">
                    Back to Vault
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {viewing && item ? (
        <VaultFileViewer item={item} onClose={() => setViewing(false)} />
      ) : null}
    </div>
  );
}
