interface ActionButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit";
}

export default function ActionButton({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  onClick,
  type = "button",
}: ActionButtonProps) {
  const className =
    variant === "primary" ? "pd-btn-primary" : "pd-btn-secondary";

  return (
    <button
      type={type}
      className={`${className} ${loading || disabled ? "pd-btn--disabled" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span className="pd-btn-spinner" aria-hidden />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
