// Shared visualization helpers (divergent heatmap, small grid rendering).
// Used by any stop that wants to render a small matrix as color.

export function divergentColor(value, maxAbs) {
  if (maxAbs === 0) return 'rgb(255, 255, 255)';
  const t = Math.max(-1, Math.min(1, value / maxAbs));
  if (t >= 0) {
    const g = Math.round(255 - 200 * t);
    const b = Math.round(255 - 200 * t);
    return `rgb(255, ${g}, ${b})`;
  }
  const r = Math.round(255 + 200 * t);
  const g = Math.round(255 + 150 * t);
  return `rgb(${r}, ${g}, 255)`;
}

export function grayscaleColor(value, maxValue = 1) {
  const t = Math.max(0, Math.min(1, value / maxValue));
  const shade = Math.round(40 + 200 * t);
  return `rgb(${shade}, ${shade}, ${shade})`;
}

export function maxAbsOf(matrix) {
  let m = 0;
  for (const row of matrix) {
    for (const v of row) {
      if (Math.abs(v) > m) m = Math.abs(v);
    }
  }
  return m;
}
