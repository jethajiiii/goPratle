'use client';

import FormField from '../FormField';
import { CATEGORIES, EVENT_TYPES } from '../../lib/constants';

const today = new Date().toISOString().split('T')[0];

const BasicInfoStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => updateFormData({ [e.target.name]: e.target.value });

  const isMultiDay = formData.isMultiDay === 'yes';

  return (
    <div className="step">
      {/* Event Name */}
      <section className="bento-card step-card">
        <div className="step-card__header">
          <div className="step-card__title-row">
            <span className="step-card__dot" />
            <h2 className="step-card__title">Event Name</h2>
            <span className="step-card__required">*</span>
          </div>
          <span className="step-card__hint">Clear & Specific</span>
        </div>
        <p className="step-card__sub">Give your event a clear, recognisable name.</p>
        <FormField error={errors.eventName}>
          <input
            id="eventName"
            name="eventName"
            type="text"
            className={`input ${errors.eventName ? 'input--error' : ''}`}
            value={formData.eventName}
            onChange={handleChange}
            placeholder="e.g. Sharma Wedding Reception, TechCorp Annual Meet 2026"
            maxLength={150}
          />
        </FormField>
      </section>

      {/* Event Type & Category */}
      <section className="bento-card step-card">
        <div className="step-card__header">
          <div className="step-card__title-row">
            <span className="step-card__dot" />
            <h2 className="step-card__title">Event Type & Category</h2>
            <span className="step-card__required">*</span>
          </div>
        </div>
        <p className="step-card__sub">Tell us what kind of event this is and who you are looking for.</p>

        <FormField label="Event Type" error={errors.eventType} required>
          <select
            id="eventType"
            name="eventType"
            className={`input input--select ${errors.eventType ? 'input--error' : ''}`}
            value={formData.eventType}
            onChange={handleChange}
          >
            <option value="">Select event type…</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </FormField>

        <FormField label="I am looking for a…" error={errors.category} required>
          <div className="category-tiles">
            {CATEGORIES.map(({ value, label, emoji }) => (
              <label
                key={value}
                className={`category-tile ${formData.category === value ? 'category-tile--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={formData.category === value}
                  onChange={handleChange}
                />
                <span className="category-tile__emoji">{emoji}</span>
                <span className="category-tile__label">{label}</span>
              </label>
            ))}
          </div>
        </FormField>
      </section>

      {/* Date & Location */}
      <section className="bento-card step-card">
        <div className="step-card__header">
          <div className="step-card__title-row">
            <span className="step-card__dot" />
            <h2 className="step-card__title">Date & Location</h2>
            <span className="step-card__required">*</span>
          </div>
        </div>
        <p className="step-card__sub">When and where is the event happening?</p>

        <div className="date-row">
          <FormField label="Event Date" error={errors.eventDate} required>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className={`input ${errors.eventDate ? 'input--error' : ''}`}
              value={formData.eventDate}
              onChange={handleChange}
              min={today}
            />
          </FormField>

          <FormField label="Multi-day Event?" error={null}>
            <div className="radio-group">
              {[{ value: 'no', label: 'Single Day' }, { value: 'yes', label: 'Multi-day' }].map(({ value, label }) => (
                <label
                  key={value}
                  className={`radio-option ${formData.isMultiDay === value ? 'radio-option--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="isMultiDay"
                    value={value}
                    checked={formData.isMultiDay === value}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {isMultiDay && (
          <FormField label="Event End Date" error={errors.eventEndDate} required>
            <input
              id="eventEndDate"
              name="eventEndDate"
              type="date"
              className={`input ${errors.eventEndDate ? 'input--error' : ''}`}
              value={formData.eventEndDate}
              onChange={handleChange}
              min={formData.eventDate || today}
            />
          </FormField>
        )}

        <FormField label="Location / City" error={errors.location} required>
          <input
            id="location"
            name="location"
            type="text"
            className={`input ${errors.location ? 'input--error' : ''}`}
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Mumbai, Bandra West"
          />
        </FormField>

        <FormField label="Venue Name (optional)" error={null}>
          <input
            id="venue"
            name="venue"
            type="text"
            className="input"
            value={formData.venue}
            onChange={handleChange}
            placeholder="e.g. The Leela Palace, Brigade Millennium Banquet"
          />
        </FormField>
      </section>
    </div>
  );
};

export default BasicInfoStep;
