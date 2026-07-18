"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/json";

export default function JsonFormatterTool() {
  const task = useAsyncTask();
  const [input, setInput] = useState('{"name":"TheWrker","modules":["editor","pdf","image"]}');
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const run = async (action: "format" | "minify" | "validate") => {
    const labels = {
      format: "Formatting JSON...",
      minify: "Minifying JSON...",
      validate: "Validating JSON...",
    };

    await task.run(labels[action], async (update) => {
      update(35, labels[action]);

      if (action === "format") {
        const result = formatJson(input);
        if (!result.ok) throw new Error(result.error ?? "Format failed.");
        setOutput(result.data ?? "");
        setMessage("JSON formatted successfully.");
        update(100, "JSON formatted.");
        return;
      }

      if (action === "minify") {
        const result = minifyJson(input);
        if (!result.ok) throw new Error(result.error ?? "Minify failed.");
        setOutput(result.data ?? "");
        setMessage("JSON minified successfully.");
        update(100, "JSON minified.");
        return;
      }

      const result = validateJson(input);
      if (!result.ok) throw new Error(result.error ?? "Invalid JSON.");
      setOutput(JSON.stringify(result.data, null, 2));
      setMessage("JSON is valid.");
      update(100, "Validation complete.");
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

      <div className="flex flex-wrap gap-3">
        <ActionButton loading={task.active} onClick={() => run("format")}>
          Format
        </ActionButton>
        <ActionButton loading={task.active} variant="secondary" onClick={() => run("minify")}>
          Minify
        </ActionButton>
        <ActionButton loading={task.active} variant="secondary" onClick={() => run("validate")}>
          Validate
        </ActionButton>
      </div>

      {message && !task.active && (
        <p
          className={`body-regular-14 ${
            message.includes("valid") || message.includes("success")
              ? "text-[#0bd984]"
              : "text-[#E5252A]"
          }`}
        >
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Input</span>
          <textarea
            className="pd-textarea min-h-[320px]"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Output</span>
          <textarea readOnly className="pd-textarea min-h-[320px]" value={output} />
        </label>
      </div>
    </div>
  );
}
