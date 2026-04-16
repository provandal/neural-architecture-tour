// Render the 8 first-layer conv filters as small heatmaps.
// Input: filters shaped [8, 1, 3, 3] as a nested number array.

function filterColor(value, maxAbs) {
  // Blue (negative) → near-white (zero) → red (positive).
  const t = maxAbs === 0 ? 0 : value / maxAbs;        // -1..1
  if (t >= 0) {
    const r = 255;
    const g = Math.round(255 - 200 * t);
    const b = Math.round(255 - 200 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const r = Math.round(255 + 200 * t);                // t is negative
  const g = Math.round(255 + 150 * t);
  const b = 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function SingleFilter({ filter, label }) {
  // filter shape: [1, 3, 3] → grab channel 0
  const grid = filter[0];
  let maxAbs = 0;
  for (const row of grid) {
    for (const v of row) {
      if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v);
    }
  }

  const cell = 26;
  const size = cell * 3;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="rounded border border-[var(--color-border)]">
        {grid.map((row, ry) =>
          row.map((value, rx) => (
            <rect
              key={`${ry}-${rx}`}
              x={rx * cell}
              y={ry * cell}
              width={cell}
              height={cell}
              fill={filterColor(value, maxAbs)}
            />
          ))
        )}
      </svg>
      <div className="text-[10px] font-mono text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

export default function FilterGrid({ filters }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((f, i) => (
        <SingleFilter key={i} filter={f} label={`F${i}`} />
      ))}
    </div>
  );
}
