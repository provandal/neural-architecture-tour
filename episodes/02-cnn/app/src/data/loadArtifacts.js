// Load the Colab-produced artifact bundle. The JSON lives in public/data/
// and is fetched relative to the app's base path at runtime.

const ARTIFACT_PATH = 'data/precomputed.json';

export async function loadArtifacts() {
  const url = `${import.meta.env.BASE_URL}${ARTIFACT_PATH}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load artifacts from ${url}: ${res.status}`);
  }
  const data = await res.json();
  if (data.version !== '1') {
    console.warn(`Artifact version ${data.version} — this app expects version 1.`);
  }
  return data;
}

// Accessor helpers so stops don't need to know the JSON shape.

export function getFilterSnapshots(artifacts) {
  return artifacts?.filter_snapshots ?? [];
}

export function getHistory(artifacts) {
  return artifacts?.history ?? { step: [], train_loss: [], test_accuracy: [] };
}

export function getSamples(artifacts) {
  return artifacts?.samples ?? [];
}

export function getTraining(artifacts) {
  return artifacts?.training ?? {};
}

export function getModel(artifacts) {
  return artifacts?.model ?? {};
}
