'use client';

import { CATEGORIES, CATEGORY_FIELDS } from '../../lib/constants';

// ─── Sub-components ────────────────────────────────────────────────────────────

const ReviewSection = ({ title, children }) => (
  <div className="review-section">
    <h3 className="review-section__title">{title}</h3>
    <dl>{children}</dl>
  </div>
);

const ReviewRow = ({ label, value }) => (
  <div className="review-row">
    <dt className="review-row__label">{label}</dt>
    <dd className="review-row__value">{value || '—'}</dd>
  </div>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

const formatBudget = (val) =>
  val ? `₹${Number(val).toLocaleString('en-IN')}` : '—';

const formatFieldValue = (field, value) => {
  if (!value) return '—';
  if (field.name === 'budgetMin' || field.name === 'budgetMax') return formatBudget(value);
  return value;
};

// Merge budgetMin + budgetMax into a single "Budget Range" row for display.
const groupBudgetFields = (fields, categoryFields) => {
  const seen = new Set();
  const rows = [];

  fields.forEach((field) => {
    if (seen.has(field.name)) return;

    if (field.name === 'budgetMin') {
      const min = categoryFields.budgetMin;
      const max = categoryFields.budgetMax;
      rows.push({ label: 'Budget Range', value: `${formatBudget(min)} – ${formatBudget(max)}` });
      seen.add('budgetMin');
      seen.add('budgetMax');
    } else {
      rows.push({ label: field.label, value: formatFieldValue(field, categoryFields[field.name]) });
      seen.add(field.name);
    }
  });

  return rows;
};

// ─── Main component ────────────────────────────────────────────────────────────

const ReviewStep = ({ formData, isSubmitting }) => {
  const categoryMeta = CATEGORIES.find((c) => c.value === formData.category);
  const allCategoryFields = [
    ...(CATEGORY_FIELDS[formData.category]?.step2 ?? []),
    ...(CATEGORY_FIELDS[formData.category]?.step3 ?? []),
  ];
  const categoryRows = groupBudgetFields(allCategoryFields, formData.categoryFields);

  const dateDisplay =
    formData.isMultiDay === 'yes' && formData.eventEndDate
      ? `${formatDate(formData.eventDate)} – ${formatDate(formData.eventEndDate)}`
      : formatDate(formData.eventDate);

  return (
    <div className="step">
      <section className="bento-card step-card">
        <div className="step-card__header">
          <div className="step-card__title-row">
            <span className="step-card__dot" />
            <h2 className="step-card__title">Review & Submit</h2>
          </div>
        </div>
        <p className="step-card__sub">Check everything before submitting. Go back to make changes.</p>

        <div className="review-sections">
          <ReviewSection title="Event Basics">
            <ReviewRow label="Event Name"   value={formData.eventName} />
            <ReviewRow label="Event Type"   value={formData.eventType} />
            <ReviewRow label="Date"         value={dateDisplay} />
            <ReviewRow label="Location"     value={formData.location} />
            {formData.venue && <ReviewRow label="Venue" value={formData.venue} />}
            <ReviewRow
              label="Looking For"
              value={categoryMeta ? `${categoryMeta.emoji} ${categoryMeta.label}` : '—'}
            />
          </ReviewSection>

          <ReviewSection title={`${categoryMeta?.label ?? 'Category'} Details`}>
            {categoryRows.map(({ label, value }) => (
              <ReviewRow key={label} label={label} value={value} />
            ))}
          </ReviewSection>
        </div>

        {isSubmitting && (
          <p className="review-submitting">Submitting your requirement…</p>
        )}
      </section>
    </div>
  );
};

export default ReviewStep;
