"use client";

import { useCallback, useRef, useState } from "react";

export interface AsyncTaskState {
  active: boolean;
  progress: number;
  message: string;
  error: string | null;
}

const INITIAL_STATE: AsyncTaskState = {
  active: false,
  progress: 0,
  message: "",
  error: null,
};

export function useAsyncTask() {
  const [state, setState] = useState<AsyncTaskState>(INITIAL_STATE);
  const resetTimer = useRef<number | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  }, []);

  const report = useCallback((progress: number, message?: string) => {
    setState((current) => ({
      ...current,
      active: true,
      progress: Math.min(100, Math.max(0, Math.round(progress))),
      message: message ?? current.message,
      error: null,
    }));
  }, []);

  const run = useCallback(
    async <T,>(
      startMessage: string,
      task: (
        update: (progress: number, message?: string) => void,
      ) => Promise<T>,
    ): Promise<T | null> => {
      clearResetTimer();
      setState({
        active: true,
        progress: 0,
        message: startMessage,
        error: null,
      });

      try {
        const result = await task((progress, message) => {
          report(progress, message);
        });

        setState((current) => ({
          ...current,
          active: true,
          progress: 100,
          message: "Complete",
          error: null,
        }));

        resetTimer.current = window.setTimeout(() => {
          setState(INITIAL_STATE);
        }, 1200);

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setState({
          active: false,
          progress: 0,
          message: "",
          error: message,
        });
        return null;
      }
    },
    [clearResetTimer, report],
  );

  const reset = useCallback(() => {
    clearResetTimer();
    setState(INITIAL_STATE);
  }, [clearResetTimer]);

  return { ...state, run, report, reset };
}
