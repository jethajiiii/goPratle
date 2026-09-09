'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useMultiStepForm from '../../hooks/useMultiStepForm';
import { postRequirement } from '../../lib/api';
import { validateEventBasics, validateStep2, validateStep3 } from '../../lib/validation';
import { STEPS, CATEGORIES } from '../../lib/constants';

import BasicInfoStep from '../../components/steps/BasicInfoStep';
import CategoryFieldsStep from '../../components/steps/CategoryFieldsStep';
import ReviewStep from '../../components/steps/ReviewStep';
import ErrorBanner from '../../components/ui/ErrorBanner';

// Each entry declares which component to render, how to validate it,
// and any extra props to forward (e.g. stepKey for the shared category step).
const STEPS_CONFIG = [
  { Component: BasicInfoStep,    validate: validateEventBasics,                extra: {} },
  { Component: CategoryFieldsStep, validate: validateStep2, extra: { stepKey: 'step2' } },
  { Component: CategoryFieldsStep, validate: validateStep3, extra: { stepKey: 'step3' } },
  { Component: ReviewStep,       validate: () => ({ isValid: true, errors: {} }), extra: {} },
];

const buildPayload = (formData) => ({
  eventName: formData.eventName,
  eventType: formData.eventType,
  eventDate: formData.eventDate,
  eventEndDate: formData.isMultiDay === 'yes' ? formData.eventEndDate : null,
  location: formData.location,
  venue: formData.venue,
  category: formData.category,
  categoryFields: formData.categoryFields,
});

// ─── Sidebar data ──────────────────────────────────────────────────────────────

const SIDEBAR_VENDORS = [
  { abbr: 'EV', name: 'Eventique Studios',  rating: '4.9 ★', tag: 'TOP 1%',  color: '#7c3aed', online: true  },
  { abbr: 'CP', name: 'CelebPro Events',   rating: '5.0 ★', tag: 'VERIFIED', color: '#2563eb', online: true  },
  { abbr: 'SL', name: 'StarLight Crew',    rating: '4.8 ★', tag: null,       color: '#d97706', online: false },
];

// ─── Page component ────────────────────────────────────────────────────────────

const PostPage = () => {
  const router = useRouter();
  const { currentStepIndex, isFirstStep, isLastStep, formData, errors, goNext, goBack, updateFormData, setErrors } =
    useMultiStepForm();

  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleNext = () => {
    const { validate } = STEPS_CONFIG[currentStepIndex];
    const { isValid, errors: validationErrors } = validate(formData);
    if (!isValid) return setErrors(validationErrors);
    goNext();
    scrollToTop();
  };

  const handleBack = () => {
    goBack();
    scrollToTop();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await postRequirement(buildPayload(formData));
      router.push(`/success?id=${response.data._id}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { Component: StepComponent, extra: stepProps } = STEPS_CONFIG[currentStepIndex];
  const categoryMeta = CATEGORIES.find((c) => c.value === formData.category);

  return (
    <div className="post-layout">
      <Header currentStepIndex={currentStepIndex} onExit={() => router.push('/')} />

      <main className="post-main">
        <Hero />

        <StepTiles steps={STEPS} currentStepIndex={currentStepIndex} />

        <div className="workspace">
          <div className="workspace__form">
            {submitError && (
              <ErrorBanner message={submitError} onDismiss={() => setSubmitError(null)} />
            )}

            <StepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              isSubmitting={isSubmitting}
              {...stepProps}
            />

            <FormNav
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>

          <aside className="workspace__sidebar">
            <LiveRadarCard categoryMeta={categoryMeta} />
            <TrustCard />
          </aside>
        </div>
      </main>

      <footer className="post-footer">
        <span>© 2026 EventBrief Ltd.</span>
        <div className="footer-status">
          <span className="status-dot status-dot--sm" />
          <span>All systems operational</span>
        </div>
      </footer>
    </div>
  );
};

// ─── Layout sub-components ─────────────────────────────────────────────────────

const Header = ({ currentStepIndex, onExit }) => (
  <header className="post-header">
    <div className="post-header__inner">
      <a className="post-header__logo" href="/">
        <div className="logo-icon">✦</div>
        <span>Event<span className="logo-accent">Brief</span></span>
      </a>
      <div className="post-header__status">
        <span className="status-dot" />
        <span>Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex].label}</span>
      </div>
      <div className="post-header__actions">
        <button className="header-btn header-btn--icon" title="Exit" onClick={onExit}>✕</button>
      </div>
    </div>
  </header>
);

const Hero = () => (
  <div className="post-hero">
    <div className="hero-badge">🎪 India's Event Professional Network</div>
    <h1 className="hero-title">Post Your Event Requirement</h1>
    <p className="hero-subtitle">
      Tell us what you need — verified planners, performers, and crew will submit tailored proposals.
    </p>
  </div>
);

const StepTiles = ({ steps, currentStepIndex }) => (
  <nav className="step-tiles" aria-label="Form progress">
    {steps.map((step, i) => {
      const isActive   = i === currentStepIndex;
      const isComplete = i < currentStepIndex;
      return (
        <div
          key={step.id}
          className={`step-tile ${isActive ? 'step-tile--active' : ''} ${isComplete ? 'step-tile--done' : ''}`}
        >
          <div className="step-tile__num">{isComplete ? '✓' : i + 1}</div>
          <div>
            <span className="step-tile__tag">
              {isActive ? 'Current' : isComplete ? 'Done' : 'Pending'}
            </span>
            <p className="step-tile__label">{step.label}</p>
          </div>
        </div>
      );
    })}
  </nav>
);

const FormNav = ({ isFirstStep, isLastStep, isSubmitting, onBack, onNext, onSubmit }) => (
  <div className="form-nav">
    <div className="form-nav__trust">
      <div className="trust-check">✓</div>
      <div>
        <p className="trust-check__title">Verified Professionals Only</p>
        <p className="trust-check__sub">Your contact details stay private until you shortlist.</p>
      </div>
    </div>
    <div className="form-nav__buttons">
      {!isFirstStep && (
        <button className="btn btn--secondary" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </button>
      )}
      {isLastStep ? (
        <button className="btn btn--primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? <span className="btn__spinner" /> : 'Submit Requirement →'}
        </button>
      ) : (
        <button className="btn btn--primary" onClick={onNext}>
          Continue →
        </button>
      )}
    </div>
  </div>
);

const LiveRadarCard = ({ categoryMeta }) => (
  <div className="bento-card sidebar-radar">
    <div className="sidebar-radar__header">
      <span className="radar-dot" />
      <h3 className="sidebar-radar__title">Live Talent Radar</h3>
      <span className="radar-badge">{categoryMeta ? categoryMeta.label.toUpperCase() : 'ALL ROLES'}</span>
    </div>
    <div className="radar-stats">
      <div className="radar-stat">
        <span className="radar-stat__label">Active Professionals</span>
        <p className="radar-stat__value">124</p>
        <span className="radar-stat__sub green">● 31 online now</span>
      </div>
      <div className="radar-stat">
        <span className="radar-stat__label">Avg. 1st Reply</span>
        <p className="radar-stat__value">22 min</p>
        <span className="radar-stat__sub purple">⚡ Highly responsive</span>
      </div>
    </div>
    <p className="radar-vendors-title">Top Matching Professionals</p>
    <div className="radar-vendors">
      {SIDEBAR_VENDORS.map((v) => (
        <div className="vendor-row" key={v.name}>
          <div className="vendor-avatar" style={{ background: v.color }}>{v.abbr}</div>
          <div className="vendor-info">
            <div className="vendor-name">
              {v.name}
              {v.tag && <span className="vendor-tag">{v.tag}</span>}
            </div>
            <p className="vendor-rating">{v.rating}</p>
          </div>
          <span className={`vendor-dot ${v.online ? 'vendor-dot--online' : ''}`} />
        </div>
      ))}
    </div>
    <div className="radar-footer">
      <span>Historical success rate</span>
      <span className="radar-footer__rate">94.1%</span>
    </div>
  </div>
);

const TrustCard = () => (
  <div className="bento-card sidebar-trust">
    <div className="trust-header">
      <div className="trust-icon">🛡️</div>
      <div>
        <h4 className="trust-header__title">EventBrief Protection</h4>
        <p className="trust-header__sub">Screened & Escrow Covered</p>
      </div>
    </div>
    <ul className="trust-list">
      <li>
        <span className="trust-check-icon">✔</span>
        <span><strong>NDA Enforced:</strong> All professionals sign a non-disclosure before scoping calls.</span>
      </li>
      <li>
        <span className="trust-check-icon">✔</span>
        <span><strong>Milestone Escrow:</strong> Funds released only after you sign off on deliverables.</span>
      </li>
      <li>
        <span className="trust-check-icon">✔</span>
        <span><strong>Zero spam:</strong> Max 5 top-ranked proposals per requirement.</span>
      </li>
    </ul>
  </div>
);

export default PostPage;
