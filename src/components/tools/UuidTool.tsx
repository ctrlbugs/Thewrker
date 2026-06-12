"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import OperationStatus from "@/components/ui/OperationStatus";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { generateUuids } from "@/lib/tools/uuid";

export default function UuidTool() {
  const task = useAsyncTask();
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = async () => {
    await task.run("Generating UUIDs...", async (update) => {
      update(35, `Creating ${count} UUID(s)...`);
      setUuids(generateUuids(count));
      update(100, "UUIDs ready.");
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
          <span className="body-emphasized-14pt mb-2 block">Count</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="pd-input w-32"
          />
        </label>
        <ActionButton loading={task.active} onClick={generate}>
          Generate UUIDs
        </ActionButton>
      </div>

      <ul className="space-y-2">
        {uuids.map((uuid) => (
          <li
            key={uuid}
            className="flex flex-col gap-2 rounded-xl bg-page-bg px-4 py-3 font-mono text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="break-all">{uuid}</span>
            <ActionButton
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(uuid)}
            >
              Copy
            </ActionButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
