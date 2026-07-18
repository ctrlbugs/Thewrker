export interface BackgroundRemovalProgress {
  stage: "loading" | "fetch" | "compute" | "done";
  progress: number;
  message: string;
}

type RemoveBackgroundConfig = {
  output?: { format?: string };
  progress?: (key: string, current: number, total: number) => void;
};

type RemoveBackgroundFn = (
  image: Blob | File | string,
  configuration?: RemoveBackgroundConfig
) => Promise<Blob>;

let removeBackgroundFn: RemoveBackgroundFn | null = null;

async function getRemoveBackground(): Promise<RemoveBackgroundFn> {
  if (typeof window === "undefined") {
    throw new Error("Background removal is only available in the browser.");
  }
  if (removeBackgroundFn) return removeBackgroundFn;

  // Runtime import so Next/webpack never parses the WASM package at build time
  const mod = (await new Function(
    'return import("@imgly/background-removal")'
  )()) as { removeBackground: RemoveBackgroundFn };

  removeBackgroundFn = mod.removeBackground;
  return removeBackgroundFn;
}

export async function removeImageBackground(
  file: File,
  onProgress?: (update: BackgroundRemovalProgress) => void
): Promise<Blob> {
  onProgress?.({
    stage: "loading",
    progress: 5,
    message: "Loading background removal engine...",
  });

  const removeBackground = await getRemoveBackground();

  onProgress?.({
    stage: "fetch",
    progress: 12,
    message: "Preparing AI model (first run downloads ~40MB)...",
  });

  const config: RemoveBackgroundConfig = {
    output: { format: "image/png" },
    progress: (key, current, total) => {
      if (total <= 0) return;

      const ratio = Math.min(1, Math.max(0, current / total));
      const percent = Math.round(ratio * 100);

      if (key === "fetch" || key.includes("fetch")) {
        onProgress?.({
          stage: "fetch",
          progress: Math.min(45, 12 + Math.round(ratio * 33)),
          message: `Downloading model... ${percent}%`,
        });
        return;
      }

      onProgress?.({
        stage: "compute",
        progress: Math.min(98, 45 + Math.round(ratio * 53)),
        message: `Removing background... ${percent}%`,
      });
    },
  };

  const blob = await removeBackground(file, config);

  onProgress?.({
    stage: "done",
    progress: 100,
    message: "Background removed.",
  });

  return blob;
}
