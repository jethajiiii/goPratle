const Button = ({
  children,
  variant = 'primary',
  loading = false,
  type = 'button',
  disabled = false,
  onClick,
}) => (
  <button
    type={type}
    className={`btn btn--${variant}`}
    disabled={disabled || loading}
    onClick={onClick}
    aria-busy={loading}
  >
    {loading ? (
      <span className="btn__spinner" aria-label="Loading…" />
    ) : (
      children
    )}
  </button>
);

export default Button;
