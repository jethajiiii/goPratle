import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [150, 'Event name must be 150 characters or fewer'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventEndDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    // The category determines who this requirement is posted for.
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['planner', 'performer', 'crew'],
    },
    // Free-form map of all category-specific field values collected across steps 2 & 3.
    categoryFields: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

const Requirement = mongoose.model('Requirement', requirementSchema);

export default Requirement;
