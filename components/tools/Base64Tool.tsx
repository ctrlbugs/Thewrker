"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { decodeBase64, encodeBase64 } from "@/lib/tools/base64";

export default function Base64Tool() {
  const task = useAsyncTask();
  const [input, setInput] = useState("TheWrker — One workspace. Every file.");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const run = async (action: "encode" | "decode") => {
    await task.run(action === "encode" ? "Encoding to Base64..." : "Decoding from Base64...", async (update) => {
      update(40, action === "encode" ? "Encoding..." : "Decoding...");
      const result = action === "encode" ? encodeBase64(input) : decodeBase64(input);
      if (!result.ok) throw new Error(result.error ?? "Operation failed.");
      setOutput(result.data ?? "");
      setMessage(action === "encode" ? "Encoded to Base64." : "Decoded from Base64.");
      update(100, "Complete.");
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
        <ActionButton loading={task.active} onClick={() => run("encode")}>
          Encode
        </ActionButton>
        <ActionButton loading={task.active} variant="secondary" onClick={() => run("decode")}>
          Decode
        </ActionButton>
      </div>

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Input</span>
          <textarea
            className="pd-textarea min-h-[280px]"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="body-emphasized-14pt mb-2 block">Output</span>
          <textarea readOnly className="pd-textarea min-h-[280px]" value={output} />
        </label>
      </div>
    </div>
  );
}
