// Render the 8 first-layer conv filters as small heatmaps.
// Input: filters shaped [8, 1, 3, 3] as a nested number array.

import { divergentColor, maxAbsOf } from '../lib/viz';

function SingleFilter({ filter, label }) {
  const grid = filter[0];
  const maxAbs = maxAbsOf(grid);

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
              fill={divergentColor(value, maxAbs)}
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
