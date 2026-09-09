'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getRequirement } from '../../lib/api';

const CATEGORY_LABELS = {
  planner:   '📋 Event Planner',
  performer: '🎤 Performer',
  crew:      '🎬 Crew',
};

// ─── Content (needs Suspense because of useSearchParams) ───────────────────────

const SuccessContent = () => {
  const router = useRouter();
  const requirementId = useSearchParams().get('id');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requirementId) return setLoading(false);
    getRequirement(requirementId)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [requirementId]);

  if (loading) return <LoadingState />;

  return (
    <main className="success-page">
      <div className="success-card">
        <span className="success-card__icon" aria-hidden="true">🎉</span>
        <h1 className="success-card__title">Requirement Posted!</h1>

        <p className="success-card__message">
          {event?.eventName ? (
            <><strong>"{event.eventName}"</strong> has been posted successfully. </>
          ) : (
            'Your requirement has been posted successfully. '
          )}
          Verified event professionals will submit proposals shortly.
        </p>

        {event && (
          <div className="success-meta">
            {event.eventType && <span className="success-tag">{event.eventType}</span>}
            {event.category && <span className="success-tag">{CATEGORY_LABELS[event.category] ?? event.category}</span>}
            {event.location  && <span className="success-tag">📍 {event.location}</span>}
          </div>
        )}

        {requirementId && (
          <p className="success-card__id">
            Reference ID: <strong>{requirementId}</strong>
          </p>
        )}

        <button className="btn btn--primary" onClick={() => router.push('/post')}>
          Post Another Requirement →
        </button>
      </div>
    </main>
  );
};

const LoadingState = () => (
  <div className="success-page">
    <div className="loading-spinner">
      <div className="loading-spinner__ring" />
      <span className="loading-spinner__label">Loading…</span>
    </div>
  </div>
);

// ─── Page wrapper ──────────────────────────────────────────────────────────────

const SuccessPage = () => (
  <Suspense fallback={<LoadingState />}>
    <SuccessContent />
  </Suspense>
);

export default SuccessPage;
