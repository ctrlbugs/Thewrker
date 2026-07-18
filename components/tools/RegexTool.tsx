"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { replaceWithRegex, testRegex } from "@/lib/tools/regex";

export default function RegexTool() {
  const task = useAsyncTask();
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at hello@thewrker.com or support@thewrker.com");
  const [replacement, setReplacement] = useState("[redacted]");
  const [matches, setMatches] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const runTest = async () => {
    await task.run("Testing regex pattern...", async (update) => {
      update(40, "Running pattern...");
      const result = testRegex(pattern, flags, text);
      if (!result.ok) throw new Error(result.error ?? "Regex test failed.");
      setMatches(result.data?.matches ?? []);
      setOutput(result.data?.highlighted ?? "");
      setMessage(`Found ${result.data?.matches.length ?? 0} match(es).`);
      update(100, "Test complete.");
    });
  };

  const runReplace = async () => {
    await task.run("Applying replacement...", async (update) => {
      update(40, "Replacing matches...");
      const result = replaceWithRegex(pattern, flags, text, replacement);
      if (!result.ok) throw new Error(result.error ?? "Replace failed.");
      setOutput(result.data ?? "");
      setMessage("Replacement applied.");
      update(100, "Replace complete.");
    });
  };

  return (
    <div className="space-y-5">
      <OperationStatus
        active={task.active}
        progress={task.progress}
        message={task.message}
        error={task.error}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Pattern</span>
          <input
            className="pd-input font-mono text-sm"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Flags</span>
          <input
            className="pd-input font-mono text-sm"
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton loading={task.active} onClick={runTest}>
          Test Regex
        </ActionButton>
        <ActionButton loading={task.active} variant="secondary" onClick={runReplace}>
          Replace
        </ActionButton>
      </div>

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Replacement</span>
        <input
          className="pd-input font-mono text-sm"
          value={replacement}
          onChange={(event) => setReplacement(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Test Text</span>
        <textarea
          className="pd-textarea min-h-[120px]"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>

      {matches.length > 0 && (
        <div className="rounded-2xl bg-page-bg p-4">
          <p className="body-emphasized-14pt mb-2">Matches</p>
          <ul className="space-y-1 font-mono text-sm">
            {matches.map((match) => (
              <li key={match}>{match}</li>
            ))}
          </ul>
        </div>
      )}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Output</span>
        <textarea readOnly className="pd-textarea min-h-[120px]" value={output} />
      </label>
    </div>
  );
}
