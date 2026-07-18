"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface AutoSaveProps {
  data: any;
  storageKey: string;
}

export function useAutoSave(data: any, storageKey: string) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && Object.keys(data).length > 0) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
          setLastSaved(new Date());
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [data, storageKey]);

  return { lastSaved };
}

export function AutoSaveIndicator({ lastSaved }: { lastSaved: Date | null }) {
  if (!lastSaved) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
      <CheckCircle className="h-3 w-3 text-green-500" />
      <span>Auto-saved</span>
    </div>
  );
}

