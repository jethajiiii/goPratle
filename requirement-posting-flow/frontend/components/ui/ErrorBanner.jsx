const ErrorBanner = ({ message, onDismiss }) => (
  <div className="error-banner" role="alert">
    <span className="error-banner__icon" aria-hidden="true">⚠️</span>
    <p className="error-banner__message">{message}</p>
    {onDismiss && (
      <button
        className="error-banner__dismiss"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    )}
  </div>
);

export default ErrorBanner;
