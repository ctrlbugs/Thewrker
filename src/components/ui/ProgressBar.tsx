interface ProgressBarProps {
  value: number;
  indeterminate?: boolean;
  size?: "sm" | "md";
}

export default function ProgressBar({
  value,
  indeterminate = false,
  size = "md",
}: ProgressBarProps) {
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div
      className={`pd-progress-track ${height}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`pd-progress-fill ${height} ${indeterminate ? "pd-progress-fill--indeterminate" : ""}`}
        style={indeterminate ? undefined : { width: `${value}%` }}
      />
    </div>
  );
}
