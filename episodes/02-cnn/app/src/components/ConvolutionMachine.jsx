import { divergentColor, grayscaleColor, maxAbsOf } from '../lib/viz';

const INPUT_CELL = 40;
const OUTPUT_CELL = 44;
const FILTER_CELL = 38;

// Input pattern: a vertical stroke in the middle column. Deliberately chosen
// because an edge filter produces a readable output (positive on one side,
// negative on the other, zero where there is no edge).
export const INPUT_IMAGE = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

export const FILTERS = {
  'vertical-edge': {
    name: 'Vertical edge',
    description: 'Fires positive where the image goes dark-to-light moving right, negative where it goes light-to-dark.',
    kernel: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
  },
  'horizontal-edge': {
    name: 'Horizontal edge',
    description: 'The same idea rotated. Fires on horizontal transitions.',
    kernel: [
      [-1, -1, -1],
      [ 0,  0,  0],
      [ 1,  1,  1],
    ],
  },
  center: {
    name: 'Center only',
    description: 'Only the middle weight is nonzero. The output copies whatever pixel sits under the center.',
    kernel: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
  blur: {
    name: 'Mean blur',
    description: 'All nine weights equal. The output is the average of the patch.',
    kernel: [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ],
  },
};

function InputGrid({ image, window, onCellClick }) {
  const rows = image.length;
  const cols = image[0].length;
  const W = cols * INPUT_CELL;
  const H = rows * INPUT_CELL;
  const maxTopLeftRow = rows - 3;
  const maxTopLeftCol = cols - 3;

  return (
    <svg width={W} height={H} className="rounded border border-[var(--color-border)]">
      {image.map((row, r) =>
        row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * INPUT_CELL}
            y={r * INPUT_CELL}
            width={INPUT_CELL}
            height={INPUT_CELL}
            fill={grayscaleColor(v)}
            stroke="var(--color-border-light)"
            strokeWidth={1}
            className="cursor-pointer"
            onClick={() => {
              // Clicking anywhere on the input sets the window top-left to the
              // clicked cell, clamped so the 3x3 window always fits.
              const clampedRow = Math.max(0, Math.min(r, maxTopLeftRow));
              const clampedCol = Math.max(0, Math.min(c, maxTopLeftCol));
              onCellClick({ row: clampedRow, col: clampedCol });
            }}
          />
        ))
      )}
      {window && (
        <rect
          x={window.col * INPUT_CELL}
          y={window.row * INPUT_CELL}
          width={3 * INPUT_CELL}
          height={3 * INPUT_CELL}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth={3}
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

function FilterDisplay({ kernel }) {
  const maxAbs = maxAbsOf(kernel);
  return (
    <svg
      width={kernel[0].length * FILTER_CELL}
      height={kernel.length * FILTER_CELL}
      className="rounded border border-[var(--color-border)]"
    >
      {kernel.map((row, r) =>
        row.map((v, c) => (
          <g key={`${r}-${c}`}>
            <rect
              x={c * FILTER_CELL}
              y={r * FILTER_CELL}
              width={FILTER_CELL}
              height={FILTER_CELL}
              fill={divergentColor(v, maxAbs)}
              stroke="var(--color-border-light)"
            />
            <text
              x={c * FILTER_CELL + FILTER_CELL / 2}
              y={r * FILTER_CELL + FILTER_CELL / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-mono)"
              fill="#111"
            >
              {formatValue(v)}
            </text>
          </g>
        ))
      )}
    </svg>
  );
}

function OutputGrid({ output, selected, onSelect }) {
  const maxAbs = maxAbsOf(output);
  const rows = output.length;
  const cols = output[0].length;

  return (
    <svg
      width={cols * OUTPUT_CELL}
      height={rows * OUTPUT_CELL}
      className="rounded border border-[var(--color-border)]"
    >
      {output.map((row, r) =>
        row.map((v, c) => {
          const isSelected = selected && selected.row === r && selected.col === c;
          return (
            <g key={`${r}-${c}`} onClick={() => onSelect({ row: r, col: c })} className="cursor-pointer">
              <rect
                x={c * OUTPUT_CELL}
                y={r * OUTPUT_CELL}
                width={OUTPUT_CELL}
                height={OUTPUT_CELL}
                fill={divergentColor(v, maxAbs)}
                stroke={isSelected ? 'var(--color-amber)' : 'var(--color-border-light)'}
                strokeWidth={isSelected ? 3 : 1}
              />
              <text
                x={c * OUTPUT_CELL + OUTPUT_CELL / 2}
                y={r * OUTPUT_CELL + OUTPUT_CELL / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontFamily="var(--font-mono)"
                fill="#111"
                pointerEvents="none"
              >
                {formatValue(v)}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}

function formatValue(v) {
  if (v === 0) return '0';
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 0.01) return v.toFixed(3);
  return v.toFixed(2);
}

export default function ConvolutionMachine({
  image,
  filter,
  filterName,
  output,
  selected,
  onSelect,
  onFilterChange,
}) {
  const window = selected ? { row: selected.row, col: selected.col } : null;

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Input image (5 × 5) — click anywhere to move the yellow window
        </div>
        <InputGrid image={image} window={window} onCellClick={onSelect} />
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Filter (3 × 3)
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(FILTERS).map(([key, f]) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
                filterName === key
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <FilterDisplay kernel={filter.kernel} />
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          Output (3 × 3) — click a cell to see how it was computed
        </div>
        <OutputGrid output={output} selected={selected} onSelect={onSelect} />
      </div>
    </div>
  );
}
