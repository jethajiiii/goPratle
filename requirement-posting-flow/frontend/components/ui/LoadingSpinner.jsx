const LoadingSpinner = ({ label = 'Loading…' }) => (
  <div className="loading-spinner" role="status" aria-label={label}>
    <div className="loading-spinner__ring" />
    <span className="loading-spinner__label">{label}</span>
  </div>
);

export default LoadingSpinner;
