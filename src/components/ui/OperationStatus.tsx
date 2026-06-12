import ProgressBar from "./ProgressBar";

interface OperationStatusProps {
  active: boolean;
  progress: number;
  message: string;
  error?: string | null;
}

export default function OperationStatus({
  active,
  progress,
  message,
  error,
}: OperationStatusProps) {
  if (error) {
    return (
      <div className="pd-operation pd-operation--error" role="alert">
        <p className="body-emphasized-14pt text-[#E5252A]">{error}</p>
      </div>
    );
  }

  if (!active) return null;

  return (
    <div className="pd-operation" aria-live="polite">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="body-emphasized-14pt">{message}</p>
        <span className="body-secondary-info-14pt tabular-nums">{progress}%</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
