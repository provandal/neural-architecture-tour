import { Panel, PanelHeader, InfoBox, Callout, SectionLabel } from '../components/ui';

export default function WatchingFiltersLearn() {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Stop 2 · Training Dynamics</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          From noise to edge detectors
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Nothing is built in. The filters start as random pixel patterns. Training
          nudges them, one tiny step at a time, toward patterns that help the network
          classify digits correctly. Watch early filters: horizontal edges, vertical
          edges, diagonal strokes. Watch later filters: curves, junctions,
          loop-tops. The architecture invented what it needed to see.
        </p>
      </div>

      <Panel>
        <PanelHeader>Why this is surprising</PanelHeader>
        <InfoBox>
          Nobody told the CNN to look for edges. Edge detection is
          <em> emergent </em> — the fastest way to reduce training loss, discovered
          by gradient descent alone. The same architecture trained on cats instead
          of digits produces different filters. The inductive bias ("things that are
          close matter together") is baked in; the features are learned.
        </InfoBox>
      </Panel>

      <Callout type="note">
        <strong>Placeholder stop.</strong> The animation showing filter weights
        evolving across training steps arrives with the Colab output in M2/M3.
      </Callout>
    </div>
  );
}
