import { CATEGORY_FIELDS } from './constants';

const hasValue = (val) => val !== undefined && val !== null && String(val).trim().length > 0;

const isPositiveNumber = (val) => {
  const n = Number(val);
  return !isNaN(n) && n >= 0;
};

export const validateEventBasics = (data) => {
  const errors = {};

  if (!hasValue(data.eventName)) errors.eventName = 'Event name is required';
  if (!hasValue(data.eventType)) errors.eventType = 'Please select an event type';
  if (!hasValue(data.eventDate)) {
    errors.eventDate = 'Event date is required';
  } else if (new Date(data.eventDate) < new Date(new Date().toDateString())) {
    errors.eventDate = 'Event date must be today or in the future';
  }

  if (data.isMultiDay === 'yes') {
    if (!hasValue(data.eventEndDate)) {
      errors.eventEndDate = 'End date is required for multi-day events';
    } else if (data.eventDate && new Date(data.eventEndDate) <= new Date(data.eventDate)) {
      errors.eventEndDate = 'End date must be after the start date';
    }
  }

  if (!hasValue(data.location)) errors.location = 'Location is required';
  if (!hasValue(data.category)) errors.category = 'Please select a category';

  return { isValid: Object.keys(errors).length === 0, errors };
};

const validateCategoryStep = (category, stepKey, categoryFields) => {
  const errors = {};
  const fields = CATEGORY_FIELDS[category]?.[stepKey] ?? [];

  fields.forEach((field) => {
    if (!field.required) return;
    const val = categoryFields[field.name];

    if (field.type === 'number') {
      if (!hasValue(val) || !isPositiveNumber(val)) {
        errors[field.name] = `${field.label} is required`;
      }
    } else if (!hasValue(val)) {
      errors[field.name] = `${field.label} is required`;
    }
  });

  // Budget cross-field: max must be >= min when both exist in the same step
  const min = Number(categoryFields.budgetMin);
  const max = Number(categoryFields.budgetMax);
  const stepFields = fields.map((f) => f.name);

  if (stepFields.includes('budgetMax') && hasValue(categoryFields.budgetMin) && hasValue(categoryFields.budgetMax)) {
    if (!isNaN(min) && !isNaN(max) && max < min) {
      errors.budgetMax = 'Max budget must be greater than or equal to min budget';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep2 = (data) =>
  validateCategoryStep(data.category, 'step2', data.categoryFields);

export const validateStep3 = (data) =>
  validateCategoryStep(data.category, 'step3', data.categoryFields);
