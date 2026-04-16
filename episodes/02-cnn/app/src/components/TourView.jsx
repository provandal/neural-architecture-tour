import { useEffect } from 'react';
import { useStore } from '../store';
import { tourSteps } from '../data/tourSteps';
import WhatIsAConvolution from '../stops/WhatIsAConvolution';
import WatchingFiltersLearn from '../stops/WatchingFiltersLearn';
import LiveInferenceComingSoon from '../stops/LiveInferenceComingSoon';

const STOP_COMPONENTS = {
  WhatIsAConvolution,
  WatchingFiltersLearn,
  LiveInferenceComingSoon,
};

export default function TourView() {
  const currentStep = useStore((s) => s.currentStep);
  const nextStep = useStore((s) => s.nextStep);
  const prevStep = useStore((s) => s.prevStep);
  const setMode = useStore((s) => s.setMode);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  const step = tourSteps[currentStep];
  const StopComponent = STOP_COMPONENTS[step.component];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setMode('landing')}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            title="Back to home"
          >
            ← Home
          </button>

          <h1 className="text-sm font-medium flex-1 min-w-0 truncate">
            {step.title}
          </h1>

          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  background:
                    i === currentStep
                      ? 'var(--color-primary)'
                      : i < currentStep
                        ? 'var(--color-teal)'
                        : 'var(--color-border)',
                }}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {currentStep + 1}/{tourSteps.length}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-3 py-1 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Prev
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === tourSteps.length - 1}
              className="px-3 py-1 text-xs rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next →
            </button>
          </div>

          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 flex items-center justify-center rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer text-sm"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {StopComponent && <StopComponent />}
        </div>
      </main>
    </div>
  );
}
