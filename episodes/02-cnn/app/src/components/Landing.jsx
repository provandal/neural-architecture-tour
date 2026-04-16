import { useStore } from '../store';
import { getModel, getTraining } from '../data/loadArtifacts';

export default function Landing() {
  const startTour = useStore((s) => s.startTour);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const artifacts = useStore((s) => s.artifacts);
  const model = getModel(artifacts);
  const training = getTraining(artifacts);

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
          <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
            A small CNN trained on MNIST in PyTorch, exported to ONNX, and running
            in this browser. Stop 2 animates the actual filter evolution across
            training. Stops 1 and 3 are still placeholder.
          </p>

          {artifacts && (
            <div className="grid grid-cols-3 gap-3 mb-10 max-w-xl mx-auto text-[13px]">
              <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Test accuracy
                </div>
                <div className="font-mono text-[var(--color-teal)] font-medium">
                  {(training.final_test_accuracy * 100).toFixed(2)}%
                </div>
              </div>
              <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Parameters
                </div>
                <div className="font-mono text-[var(--color-text)] font-medium">
                  {model.parameters?.toLocaleString() ?? '—'}
                </div>
              </div>
              <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  Train time
                </div>
                <div className="font-mono text-[var(--color-text)] font-medium">
                  {training.wall_clock_seconds
                    ? `${training.wall_clock_seconds.toFixed(0)}s`
                    : '—'}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={startTour}
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg text-base font-medium hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
          >
            Start the tour
          </button>

          <p className="text-xs text-[var(--color-text-muted)] mt-4 font-mono">
            3 stops · scrubber animation in Stop 2
          </p>
        </div>
      </div>
    </div>
  );
}
