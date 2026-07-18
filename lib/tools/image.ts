export type ImageOutputFormat = "image/png" | "image/jpeg" | "image/webp";

export interface ImageDimensions {
  width: number;
  height: number;
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image."));
    };

    image.src = url;
  });
}

export function getImageDimensions(
  image: HTMLImageElement,
  maxWidth?: number,
  maxHeight?: number,
): ImageDimensions {
  let { width, height } = image;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  return { width, height };
}

export function renderImageToCanvas(
  image: HTMLImageElement,
  dimensions: ImageDimensions,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ImageOutputFormat,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to export image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function processImageFile(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    format: ImageOutputFormat;
    quality?: number;
  },
): Promise<Blob> {
  const image = await loadImageFromFile(file);
  const dimensions = getImageDimensions(
    image,
    options.maxWidth,
    options.maxHeight,
  );
  const canvas = renderImageToCanvas(image, dimensions);
  return canvasToBlob(canvas, options.format, options.quality ?? 0.92);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getCompressionStats(originalSize: number, compressedSize: number) {
  const savedBytes = Math.max(0, originalSize - compressedSize);
  const savedPercent =
    originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  return { originalSize, compressedSize, savedBytes, savedPercent };
}

export async function compressImageFile(
  file: File,
  options: {
    quality: number;
    format: ImageOutputFormat;
    maxWidth?: number;
  },
): Promise<Blob> {
  const image = await loadImageFromFile(file);
  const dimensions = getImageDimensions(image, options.maxWidth);
  const canvas = renderImageToCanvas(image, dimensions);
  return canvasToBlob(canvas, options.format, options.quality);
}
