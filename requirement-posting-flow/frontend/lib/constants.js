export const EVENT_TYPES = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Concert / Music Event',
  'Festival',
  'Conference / Summit',
  'Graduation Ceremony',
  'Anniversary',
  'Product Launch',
  'Charity / Fundraiser',
  'Other',
];

export const CATEGORIES = [
  { value: 'planner', label: 'Event Planner', emoji: '📋' },
  { value: 'performer', label: 'Performer', emoji: '🎤' },
  { value: 'crew', label: 'Crew', emoji: '🎬' },
];

// Fields are split into step2 and step3 per category so each step stays focused.
export const CATEGORY_FIELDS = {
  planner: {
    step2: [
      {
        name: 'guestCount',
        label: 'Expected Guest Count',
        type: 'number',
        required: true,
        placeholder: 'e.g. 150',
      },
      {
        name: 'planningScope',
        label: 'Planning Scope',
        type: 'select',
        required: true,
        options: [
          'Full Event Planning',
          'Day-of Coordination Only',
          'Partial Planning (select services)',
          'Vendor Management Only',
          'Décor & Styling Only',
        ],
      },
      {
        name: 'eventTheme',
        label: 'Event Theme / Style',
        type: 'text',
        required: false,
        placeholder: 'e.g. Rustic Garden, Luxury Black & Gold, Minimalist',
      },
      {
        name: 'budgetMin',
        label: 'Min Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 100000',
      },
      {
        name: 'budgetMax',
        label: 'Max Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 500000',
      },
    ],
    step3: [
      {
        name: 'plannerExperience',
        label: 'Planner Experience Required',
        type: 'select',
        required: true,
        options: ['1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'],
      },
      {
        name: 'languagesPreferred',
        label: 'Languages Preferred',
        type: 'text',
        required: false,
        placeholder: 'e.g. Hindi, English, Marathi',
      },
      {
        name: 'requiresSameTypeExp',
        label: 'Must have experience with this event type?',
        type: 'radio',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        name: 'additionalNotes',
        label: 'Additional Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Specific vendors to include/avoid, accessibility needs, etc.',
      },
    ],
  },

  performer: {
    step2: [
      {
        name: 'performanceType',
        label: 'Performance Type',
        type: 'select',
        required: true,
        options: [
          'DJ',
          'Live Band',
          'Solo Singer / Vocalist',
          'Comedian / Stand-up',
          'Dancer / Dance Group',
          'Magician / Illusionist',
          'Emcee / Host',
          'Classical Musician',
          'Other',
        ],
      },
      {
        name: 'genreStyle',
        label: 'Genre / Style',
        type: 'text',
        required: false,
        placeholder: 'e.g. Bollywood, EDM, Classical, Jazz, Hip-hop',
      },
      {
        name: 'setDuration',
        label: 'Performance Duration',
        type: 'select',
        required: true,
        options: ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours', '4+ hours'],
      },
      {
        name: 'performerCount',
        label: 'Number of Performers',
        type: 'number',
        required: true,
        placeholder: 'e.g. 1 (solo), 4 (band)',
      },
    ],
    step3: [
      {
        name: 'budgetMin',
        label: 'Min Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 20000',
      },
      {
        name: 'budgetMax',
        label: 'Max Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 80000',
      },
      {
        name: 'soundSystemAvailable',
        label: 'Sound System Provided at Venue',
        type: 'radio',
        required: true,
        options: ['Yes', 'No', 'Partially'],
      },
      {
        name: 'accommodationNeeded',
        label: 'Accommodation Required',
        type: 'radio',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        name: 'additionalNotes',
        label: 'Stage / Technical Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Stage size, backline, lighting rig, sound system specs, etc.',
      },
    ],
  },

  crew: {
    step2: [
      {
        name: 'crewType',
        label: 'Crew Type Needed',
        type: 'select',
        required: true,
        options: [
          'Photographer',
          'Videographer',
          'Sound Engineer',
          'Lighting Technician',
          'Stage Manager',
          'Event Coordinator (On-ground)',
          'Security Personnel',
          'Catering Staff',
          'Other',
        ],
      },
      {
        name: 'crewSize',
        label: 'Number of Crew Members',
        type: 'number',
        required: true,
        placeholder: 'e.g. 3',
      },
      {
        name: 'setupDuration',
        label: 'Setup Time Required',
        type: 'select',
        required: true,
        options: ['1 hour', '2 hours', '4 hours', 'Half day', 'Full day'],
      },
      {
        name: 'equipmentProvided',
        label: 'Equipment Provided by Client / Venue',
        type: 'radio',
        required: true,
        options: ['Yes', 'No', 'Partially'],
      },
    ],
    step3: [
      {
        name: 'budgetMin',
        label: 'Min Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 15000',
      },
      {
        name: 'budgetMax',
        label: 'Max Budget (₹)',
        type: 'number',
        required: true,
        placeholder: 'e.g. 60000',
      },
      {
        name: 'seniorityLevel',
        label: 'Experience Level Required',
        type: 'select',
        required: true,
        options: ['Junior (1-2 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5+ yrs)'],
      },
      {
        name: 'specificEquipment',
        label: 'Specific Equipment / Gear Needed',
        type: 'textarea',
        required: false,
        placeholder: 'e.g. Canon R5, DJI Gimbal, 4K video setup, LED rig...',
      },
      {
        name: 'additionalNotes',
        label: 'Additional Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Any other requirements for the crew...',
      },
    ],
  },
};

export const STEPS = [
  { id: 'event-basics',    label: 'Event Basics' },
  { id: 'specific-details', label: 'Specific Details' },
  { id: 'more-details',    label: 'More Details' },
  { id: 'review',          label: 'Review & Submit' },
];
