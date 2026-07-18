"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { decodeJwt } from "@/lib/tools/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlBvd2VyRGVzayIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtTool() {
  const task = useAsyncTask();
  const [token, setToken] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  const decode = async () => {
    await task.run("Decoding JWT...", async (update) => {
      update(40, "Parsing token...");
      const result = decodeJwt(token);
      if (!result.ok) throw new Error(result.error ?? "Decode failed.");
      setOutput(JSON.stringify(result.data, null, 2));
      setMessage("JWT decoded successfully.");
      update(100, "Decode complete.");
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

      <ActionButton loading={task.active} onClick={decode}>
        Decode JWT
      </ActionButton>

      {message && !task.active && <p className="body-regular-14">{message}</p>}

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Token</span>
        <textarea
          className="pd-textarea min-h-[120px]"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </label>

      <label className="block">
        <span className="body-emphasized-14pt mb-2 block">Decoded Output</span>
        <textarea readOnly className="pd-textarea min-h-[280px]" value={output} />
      </label>
    </div>
  );
}
