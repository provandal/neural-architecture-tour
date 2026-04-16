import { Panel, PanelHeader, InfoBox, Callout, SectionLabel } from '../components/ui';

export default function LiveInferenceComingSoon() {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Stop 3 · The Capstone</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Draw a digit. The model runs in your browser.
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          The CNN you just watched train lives here as an ONNX model, loaded
          client-side through <code className="text-[13px] font-mono px-1 py-0.5 bg-[var(--color-surface-alt)] rounded">@huggingface/transformers</code>.
          No server. No API calls. Your drawing goes in, a prediction comes out,
          the feature maps from each layer animate alongside.
        </p>
      </div>

      <Panel>
        <PanelHeader>What you'll see here in M3</PanelHeader>
        <InfoBox>
          A 28×28 canvas you can paint on, plus a live readout of the CNN's
          confidence across all 10 digits. Click a layer to see what that layer
          is "noticing" in your drawing — the feature maps that later layers
          compose into a classification.
        </InfoBox>
      </Panel>

      <Callout type="good">
        <strong>End of the placeholder tour.</strong> This is the shape of Episode 2.
        The rest is content.
      </Callout>
    </div>
  );
}
