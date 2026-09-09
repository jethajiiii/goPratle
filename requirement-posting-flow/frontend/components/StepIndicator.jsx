import { STEPS } from '../lib/constants';

const StepIndicator = ({ currentStepIndex }) => (
  <nav className="step-indicator" aria-label="Form progress">
    {STEPS.map((step, index) => {
      const isCompleted = index < currentStepIndex;
      const isActive    = index === currentStepIndex;

      return (
        <div
          key={step.id}
          className={[
            'step-indicator__step',
            isCompleted ? 'step-indicator__step--completed' : '',
            isActive    ? 'step-indicator__step--active'    : '',
          ].join(' ').trim()}
        >
          <div className="step-indicator__circle" aria-hidden="true">
            {isCompleted ? '✓' : index + 1}
          </div>
          <span className="step-indicator__label">{step.label}</span>

          {/* Connector line between steps */}
          {index < STEPS.length - 1 && (
            <div
              className={[
                'step-indicator__connector',
                isCompleted ? 'step-indicator__connector--filled' : '',
              ].join(' ').trim()}
              aria-hidden="true"
            />
          )}
        </div>
      );
    })}
  </nav>
);

export default StepIndicator;
