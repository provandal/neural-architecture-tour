import { Panel, PanelHeader, InfoBox, Callout, SectionLabel } from '../components/ui';

export default function WhatIsAConvolution() {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Stop 1 · The Core Operation</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          A small window that multiplies and sums
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          A convolution is simpler than its name suggests. A small window — usually
          3×3 or 5×5 pixels — slides across an image. At every position, it multiplies
          each pixel it sees by a fixed number, then adds those products together.
          That single sum becomes one pixel in a new, smaller image.
        </p>
      </div>

      <Panel>
        <PanelHeader>The intuition</PanelHeader>
        <InfoBox>
          If the window's pattern of numbers happens to match the pattern of pixels
          beneath it, the sum is large. If it doesn't match, the sum is small. That's
          the whole idea. Each window is a <em>template</em>; its output is a map of
          "how well does the template match here?"
        </InfoBox>
      </Panel>

      <Callout type="note">
        <strong>Placeholder stop.</strong> The interactive convolution visualizer —
        drag the window, watch the output update — lands in M3 once the Colab
        notebook produces real filter data.
      </Callout>
    </div>
  );
}
