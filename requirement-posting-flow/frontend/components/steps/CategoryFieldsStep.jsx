'use client';

import FormField from '../FormField';
import { CATEGORIES, CATEGORY_FIELDS } from '../../lib/constants';

const STEP_META = {
  step2: { title: 'Specific Details', sub: 'Tell us more about what you need for this role.' },
  step3: { title: 'Final Details',    sub: 'A few more specifics to help us find the perfect match.' },
};

const CategoryFieldsStep = ({ formData, updateFormData, errors, stepKey }) => {
  const fields = CATEGORY_FIELDS[formData.category]?.[stepKey] ?? [];
  const categoryLabel = CATEGORIES.find((c) => c.value === formData.category)?.label ?? '';
  const meta = STEP_META[stepKey];

  const handleFieldChange = (name, value) => {
    updateFormData({
      categoryFields: { ...formData.categoryFields, [name]: value },
    });
  };

  return (
    <div className="step">
      <section className="bento-card step-card">
        <div className="step-card__header">
          <div className="step-card__title-row">
            <span className="step-card__dot" />
            <h2 className="step-card__title">{meta.title}</h2>
          </div>
          <span className="step-card__hint">{categoryLabel}</span>
        </div>
        <p className="step-card__sub">{meta.sub}</p>

        {fields.map((field) =>
          renderField(field, formData.categoryFields[field.name] ?? '', handleFieldChange, errors[field.name])
        )}
      </section>
    </div>
  );
};

const renderField = (field, value, onChange, error) => {
  const baseClass = `input${error ? ' input--error' : ''}`;

  const renderers = {
    select: () => (
      <FormField key={field.name} label={field.label} error={error} required={field.required}>
        <select
          id={field.name}
          className={`${baseClass} input--select`}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </FormField>
    ),

    radio: () => (
      <FormField key={field.name} label={field.label} error={error} required={field.required}>
        <div className="radio-group">
          {field.options.map((opt) => (
            <label
              key={opt}
              className={`radio-option ${value === opt ? 'radio-option--selected' : ''}`}
            >
              <input
                type="radio"
                name={field.name}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      </FormField>
    ),

    textarea: () => (
      <FormField key={field.name} label={field.label} error={error} required={field.required}>
        <textarea
          id={field.name}
          className={`${baseClass} input--textarea`}
          value={value}
          placeholder={field.placeholder}
          rows={3}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </FormField>
    ),

    number: () => (
      <FormField key={field.name} label={field.label} error={error} required={field.required}>
        <input
          id={field.name}
          type="number"
          className={baseClass}
          value={value}
          placeholder={field.placeholder}
          min={0}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </FormField>
    ),

    text: () => (
      <FormField key={field.name} label={field.label} error={error} required={field.required}>
        <input
          id={field.name}
          type="text"
          className={baseClass}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </FormField>
    ),
  };

  return (renderers[field.type] ?? renderers.text)();
};

export default CategoryFieldsStep;
