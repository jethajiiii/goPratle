import { useState, useCallback } from 'react';
import { STEPS } from '../lib/constants';

const useMultiStepForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1 — Event Basics
    eventName: '',
    eventType: '',
    eventDate: '',
    isMultiDay: 'no',
    eventEndDate: '',
    location: '',
    venue: '',
    category: '',
    // Steps 2 & 3 — category-specific fields (flat map keyed by field name)
    categoryFields: {},
  });
  const [errors, setErrors] = useState({});

  const goNext = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    setErrors({});
  }, []);

  const goBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    setErrors({});
  }, []);

  const updateFormData = useCallback((patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  }, []);

  return {
    currentStepIndex,
    currentStep: STEPS[currentStepIndex],
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === STEPS.length - 1,
    formData,
    errors,
    goNext,
    goBack,
    updateFormData,
    setErrors,
  };
};

export default useMultiStepForm;
