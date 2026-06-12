"use client";

import { useEffect, useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import {
  findAndReplace,
  getTextStats,
  loadSavedText,
  saveText,
} from "@/lib/tools/text-editor";

export default function TextEditorTool() {
  const task = useAsyncTask();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [replace, setReplace] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    setText(loadSavedText());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveText(text);
      setSavedAt(new Date().toLocaleTimeString());
    }, 500);
    return () => window.clearTimeout(timer);
  }, [text]);

  const stats = getTextStats(text);

  const replaceAll = async () => {
    await task.run("Replacing text...", async (update) => {
      update(40, "Applying replacements...");
      setText(findAndReplace(text, search, replace, matchCase));
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No Spaces" value={stats.charactersNoSpaces} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
        <input
          placeholder="Find"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pd-input"
        />
        <input
          placeholder="Replace with"
          value={replace}
          onChange={(event) => setReplace(event.target.value)}
          className="pd-input"
        />
        <label className="flex items-center gap-2 rounded-2xl bg-page-bg px-4 py-3">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(event) => setMatchCase(event.target.checked)}
          />
          <span className="body-regular-14">Match case</span>
        </label>
        <ActionButton loading={task.active} onClick={replaceAll}>
          Replace All
        </ActionButton>
      </div>

      {savedAt && (
        <p className="body-secondary-info-14pt">Auto-saved at {savedAt}</p>
      )}

      <textarea
        className="pd-textarea min-h-[420px]"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Start writing..."
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-page-bg p-4 text-center">
      <p className="text-22-bold">{value}</p>
      <p className="body-secondary-info-14pt">{label}</p>
    </div>
  );
}
