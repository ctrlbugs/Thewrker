"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { hashText, type HashAlgorithm } from "@/lib/tools/hash";

const ALGORITHMS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export default function HashTool() {
  const task = useAsyncTask();
  const [input, setInput] = useState("TheWrker");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const generate = async () => {
    await task.run(`Generating ${algorithm} hash...`, async (update) => {
      update(30, "Computing hash...");
      const result = await hashText(input, algorithm);
      if (!result.ok) throw new Error(result.error ?? "Hash generation failed.");
      setOutput(result.data ?? "");
      setMessage(`${algorithm} hash generated.`);
      update(100, "Hash ready.");
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

      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Algorithm</span>
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}
            className="pd-input w-auto min-w-[160px]"
          >
            {ALGORITHMS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <ActionButton loading={task.active} onClick={generate}>
          Generate Hash
        </ActionButton>
      </div>

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Input</span>
        <textarea
          className="pd-textarea min-h-[160px]"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Hash Output</span>
        <textarea readOnly className="pd-textarea min-h-[120px] break-all" value={output} />
      </label>
    </div>
  );
}
