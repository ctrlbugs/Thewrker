"use client";

import Link from "next/link";
import { useApiIntegrations } from "@/hooks/useApiIntegrations";
import { API_INTEGRATIONS } from "@/lib/api/integration-catalog";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        active
          ? "bg-[#01F0D0]/20 text-[#035a4d]"
          : "bg-page-bg text-secondary"
      }`}
    >
      {active ? "Configured" : "Not configured"}
    </span>
  );
}

export default function IntegrationsPanel() {
  const { status, loading } = useApiIntegrations();

  const isActive = (id: string): boolean => {
    if (id === "google-cse") return status["google-cse"];
    if (id === "serpapi") return status.serpapi;
    if (id === "ocr-space") return status["ocr-space"];
    if (id === "remove-bg") return status["remove-bg"];
    if (id === "openai") return status.openai;
    return false;
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white px-4 py-3">
        <p className="body-regular-14">
          Add free API keys in <code className="rounded bg-page-bg px-1.5 py-0.5 text-sm">.env.local</code>{" "}
          at the project root. Keys stay on the server and are never sent to the browser. Copy{" "}
          <code className="rounded bg-page-bg px-1.5 py-0.5 text-sm">.env.example</code> to get started,
          then restart <code className="rounded bg-page-bg px-1.5 py-0.5 text-sm">npm run dev</code>.
        </p>
      </div>

      {loading ? (
        <p className="body-secondary-info-14pt">Checking configured APIs...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {API_INTEGRATIONS.map((integration) => (
            <article
              key={integration.id}
              className="pd-workspace-card flex flex-col gap-3 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="inner-card-title-18pt">{integration.name}</h3>
                <StatusBadge active={isActive(integration.id)} />
              </div>

              <p className="body-regular-14">{integration.purpose}</p>

              <p className="body-secondary-info-14pt">
                Used by: {integration.usedBy.join(", ")}
              </p>

              <p className="body-secondary-info-14pt">
                Free tier: {integration.freeTier}
              </p>

              <div className="body-secondary-info-14pt space-y-1">
                <p className="body-emphasized-14pt">Environment variables</p>
                <ul className="list-disc pl-5">
                  {integration.envKeys.map((envKey) => (
                    <li key={envKey.key}>
                      <code className="text-sm">{envKey.key}</code> — {envKey.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <a
                  href={integration.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-emphasized-14pt text-primary underline-offset-2 hover:underline"
                >
                  Get free API key
                </a>
                <a
                  href={integration.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="body-secondary-info-14pt underline-offset-2 hover:underline"
                >
                  Documentation
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="body-secondary-info-14pt">
        Tools that work without any API keys: JSON Formatter, Base64, UUID, Hash, JWT, Regex,
        Text Editor, PDF merge/split, Archive ZIP, media converter/compressor, and browser-based
        background removal.{" "}
        <Link href="/studio/ai" className="font-semibold text-primary underline-offset-2 hover:underline">
          AI Studio
        </Link>{" "}
        and scanned documents benefit most from the APIs above.
      </p>
    </div>
  );
}
