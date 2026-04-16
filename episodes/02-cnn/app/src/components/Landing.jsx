import { useStore } from '../store';

export default function Landing() {
  const startTour = useStore((s) => s.startTour);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  // Use the series landing URL when available (GH Pages), otherwise relative up.
  const seriesHref =
    typeof window !== 'undefined' && window.location.pathname.includes('/neural-architecture-tour/')
      ? '/neural-architecture-tour/'
      : '../';

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border)]">
        <a
          href={seriesHref}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-mono"
        >
          ← Neural Architecture Tour
        </a>
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer text-sm"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--color-primary-light)] mb-3">
            Episode 02 · Work in progress
          </div>
          <h1 className="text-5xl font-semibold tracking-tight mb-4">
            CNN — Watching Filters See
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-2">
            Why architecture matters. When pixels-as-independent-features fails,
            and how convolution fixes it.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-10 max-w-lg mx-auto">
            This is the first built episode of the Neural Architecture Tour. Right
            now it's a structural scaffold — 3 placeholder stops wired through the
            tour framework. The interactive visualizations and live MNIST inference
            land in later milestones.
          </p>

          <button
            onClick={startTour}
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg text-base font-medium hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
          >
            Start the tour
          </button>

          <p className="text-xs text-[var(--color-text-muted)] mt-4 font-mono">
            3 stops · placeholder content · more soon
          </p>
        </div>
      </div>
    </div>
  );
}
