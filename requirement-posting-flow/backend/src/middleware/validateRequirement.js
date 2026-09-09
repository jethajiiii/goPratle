import Joi from 'joi';

const VALID_CATEGORIES = ['planner', 'performer', 'crew'];

const requirementSchema = Joi.object({
  eventName: Joi.string().trim().max(150).required().messages({
    'string.empty': 'Event name is required',
    'string.max': 'Event name must be 150 characters or fewer',
    'any.required': 'Event name is required',
  }),

  eventType: Joi.string().trim().required().messages({
    'string.empty': 'Event type is required',
    'any.required': 'Event type is required',
  }),

  eventDate: Joi.date().required().messages({
    'date.base': 'A valid event date is required',
    'any.required': 'Event date is required',
  }),

  eventEndDate: Joi.date().greater(Joi.ref('eventDate')).allow(null, '').optional().messages({
    'date.greater': 'End date must be after the start date',
  }),

  location: Joi.string().trim().required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required',
  }),

  venue: Joi.string().trim().allow('').optional(),

  category: Joi.string().valid(...VALID_CATEGORIES).required().messages({
    'any.only': `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    'any.required': 'Category is required',
  }),

  // The categoryFields map accepts any string key → string value.
  // Field-level validation is handled on the frontend; the backend trusts it.
  categoryFields: Joi.object().pattern(Joi.string(), Joi.string().allow('')).default({}),
});

const validateRequirement = (req, res, next) => {
  const { error, value } = requirementSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return res.status(400).json({ success: false, errors });
  }

  req.body = value;
  next();
};

export default validateRequirement;
