const FormField = ({ label, error, required = false, children }) => (
  <div className="form-field">
    {label && (
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
    )}
    {children}
    {error && <p className="form-field__error" role="alert">{error}</p>}
  </div>
);

export default FormField;
