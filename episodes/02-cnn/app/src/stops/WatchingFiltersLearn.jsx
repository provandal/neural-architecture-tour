import { useState } from 'react';
import { Panel, PanelHeader, InfoBox, Callout, SectionLabel } from '../components/ui';
import FilterGrid from '../components/FilterGrid';
import { useStore } from '../store';
import { getFilterSnapshots, getHistory } from '../data/loadArtifacts';

function findAccuracyAtStep(history, step) {
  // history.step is monotonic; find closest <= step.
  let best = null;
  for (let i = 0; i < history.step.length; i++) {
    if (history.step[i] <= step) best = history.test_accuracy[i];
  }
  return best;
}

export default function WatchingFiltersLearn() {
  const artifacts = useStore((s) => s.artifacts);
  const artifactsError = useStore((s) => s.artifactsError);
  const [snapshotIdx, setSnapshotIdx] = useState(0);

  const snapshots = getFilterSnapshots(artifacts);
  const history = getHistory(artifacts);

  if (artifactsError) {
    return (
      <Callout type="warn">
        <strong>Couldn't load training artifacts.</strong> {artifactsError}
      </Callout>
    );
  }

  if (!artifacts || snapshots.length === 0) {
    return (
      <div className="space-y-6">
        <SectionLabel>Stop 2 · Training Dynamics</SectionLabel>
        <Callout type="note">Loading training artifacts…</Callout>
      </div>
    );
  }

  const safeIdx = Math.min(snapshotIdx, snapshots.length - 1);
  const current = snapshots[safeIdx];
  const initFilters = snapshots[0].filters;
  const finalFilters = snapshots[snapshots.length - 1].filters;
  const accAtStep = findAccuracyAtStep(history, current.step);

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Stop 2 · Training Dynamics</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          From noise to edge detectors
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Below are the 8 first-layer filters of the CNN, captured at different
          points during training. Drag the scrubber. You're watching the model
          invent edge detection — nobody told it to.
        </p>
      </div>

      <Panel>
        <PanelHeader>Filter evolution across training</PanelHeader>
        <div className="px-4 py-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
            <div className="font-mono text-[var(--color-text-secondary)]">
              Training step{' '}
              <span className="text-[var(--color-text)] font-medium">
                {current.step.toLocaleString()}
              </span>
              {' '}/ {snapshots[snapshots.length - 1].step.toLocaleString()}
            </div>
            {accAtStep !== null && (
              <div className="font-mono text-[var(--color-text-secondary)]">
                Test accuracy{' '}
                <span className="text-[var(--color-teal)] font-medium">
                  {(accAtStep * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <input
            type="range"
            min={0}
            max={snapshots.length - 1}
            step={1}
            value={safeIdx}
            onChange={(e) => setSnapshotIdx(Number(e.target.value))}
            className="anim-scrubber w-full"
          />

          <FilterGrid filters={current.filters} />
        </div>
      </Panel>

      <Panel>
        <PanelHeader>Before vs after — the whole journey</PanelHeader>
        <div className="px-4 py-5 space-y-4">
          <div>
            <div className="text-[11px] font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Step 0 · random init
            </div>
            <FilterGrid filters={initFilters} />
          </div>
          <div>
            <div className="text-[11px] font-mono text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Step {snapshots[snapshots.length - 1].step.toLocaleString()} · trained
            </div>
            <FilterGrid filters={finalFilters} />
          </div>
        </div>
      </Panel>

      <InfoBox>
        <strong className="text-[var(--color-text)]">Why this is surprising:</strong>{' '}
        nobody told the CNN to look for edges. Edge detection is emergent — the
        fastest way to reduce classification loss, discovered by gradient descent
        alone. Train the same architecture on cats instead of digits and you get
        different filters. The inductive bias (locality, weight sharing) is baked
        in; the features are learned.
      </InfoBox>
    </div>
  );
}
