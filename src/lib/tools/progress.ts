export type ProgressReporter = (progress: number, message?: string) => void;

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function createStageReporter(
  stages: Array<{ until: number; message: string }>,
  report: ProgressReporter,
): ProgressReporter {
  let stageIndex = 0;

  return (progress, message) => {
    while (
      stageIndex < stages.length - 1 &&
      progress > stages[stageIndex].until
    ) {
      stageIndex += 1;
    }

    report(
      clampProgress(progress),
      message ?? stages[stageIndex]?.message ?? "Processing...",
    );
  };
}

export async function runWithProgress<T>(
  report: ProgressReporter,
  task: (update: ProgressReporter) => Promise<T>,
  labels: { start: string; done: string },
): Promise<T> {
  report(0, labels.start);

  const result = await task((progress, message) => {
    report(clampProgress(progress), message);
  });

  report(100, labels.done);
  return result;
}

export function startIndeterminateProgress(
  report: ProgressReporter,
  message: string,
): () => void {
  let progress = 8;
  report(progress, message);

  const timer = window.setInterval(() => {
    progress = Math.min(progress + Math.random() * 8, 92);
    report(progress, message);
  }, 280);

  return () => window.clearInterval(timer);
}
