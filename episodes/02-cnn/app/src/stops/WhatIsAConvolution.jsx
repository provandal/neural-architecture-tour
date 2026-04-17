import { useMemo, useState } from 'react';
import ConvolutionMachine, { INPUT_IMAGE, FILTERS } from '../components/ConvolutionMachine';
import { convolveValid, extractPatch, elementwiseProduct } from '../lib/conv';
import { divergentColor, maxAbsOf } from '../lib/viz';

const MINI_CELL = 28;
const BIG_CELL = 52;

function MiniGrid({ matrix, maxAbs }) {
  const m = maxAbs ?? maxAbsOf(matrix);
  const rows = matrix.length;
  const cols = matrix[0].length;
  return (
    <svg width={cols * MINI_CELL} height={rows * MINI_CELL} className="rounded border border-[var(--color-border)]">
      {matrix.map((row, r) =>
        row.map((v, c) => (
          <g key={`${r}-${c}`}>
            <rect
              x={c * MINI_CELL}
              y={r * MINI_CELL}
              width={MINI_CELL}
              height={MINI_CELL}
              fill={divergentColor(v, m || 1)}
              stroke="var(--color-border-light)"
            />
            <text
              x={c * MINI_CELL + MINI_CELL / 2}
              y={r * MINI_CELL + MINI_CELL / 2 + 4}
              textAnchor="middle"
              fontSize={10}
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

// Shows the vertical-edge filter with column background tints and labels.
// Used in the anatomy section before the learner meets the full interactive.
function AnnotatedVerticalEdgeFilter() {
  const rows = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ];
  const colTints = ['rgba(226, 75, 74, 0.15)', 'transparent', 'rgba(29, 158, 117, 0.15)'];
  const colLabels = ['Subtract', 'Ignore', 'Add'];
  const height = rows.length * BIG_CELL;
  const width = rows[0].length * BIG_CELL;

  return (
    <div className="inline-block">
      <div className="flex" style={{ width }}>
        {colLabels.map((label, i) => (
          <div
            key={i}
            className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] text-center pb-1"
            style={{ width: BIG_CELL }}
          >
            {label}
          </div>
        ))}
      </div>
      <svg width={width} height={height} className="rounded border border-[var(--color-border)]">
        {rows.map((row, r) =>
          row.map((v, c) => (
            <g key={`${r}-${c}`}>
              <rect
                x={c * BIG_CELL}
                y={r * BIG_CELL}
                width={BIG_CELL}
                height={BIG_CELL}
                fill={colTints[c]}
                stroke="var(--color-border-light)"
              />
              <text
                x={c * BIG_CELL + BIG_CELL / 2}
                y={r * BIG_CELL + BIG_CELL / 2 + 6}
                textAnchor="middle"
                fontSize={18}
                fontFamily="var(--font-mono)"
                fill="var(--color-text)"
                fontWeight={500}
              >
                {v > 0 ? `+${v}` : v}
              </text>
            </g>
          ))
        )}
      </svg>
    </div>
  );
}

// One worked example of the vertical-edge filter applied to a specific patch.
// Shows patch ⊙ filter = products → sum, with a plain-language interpretation.
function WorkedExample({ patch, label, interpretation, tone }) {
  const filter = FILTERS['vertical-edge'].kernel;
  const products = elementwiseProduct(patch, filter);
  const sum = products.flat().reduce((a, b) => a + b, 0);
  const toneColor = {
    positive: 'var(--color-teal)',
    negative: 'var(--color-red)',
    neutral: 'var(--color-text-muted)',
  }[tone || 'neutral'];

  return (
    <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)]">
      <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
        {label}
      </div>
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <MiniGrid matrix={patch} maxAbs={1} />
        <span className="text-xl font-mono text-[var(--color-text-muted)]">⊙</span>
        <MiniGrid matrix={filter} />
        <span className="text-xl font-mono text-[var(--color-text-muted)]">=</span>
        <MiniGrid matrix={products} />
        <span className="text-xl font-mono text-[var(--color-text-muted)]">→ sum</span>
        <span style={{ color: toneColor }} className="text-3xl font-mono font-semibold">
          {formatValue(sum)}
        </span>
      </div>
      <div style={{ color: toneColor }} className="text-[13px]">
        {interpretation}
      </div>
    </div>
  );
}

function formatValue(v) {
  if (v === 0) return '0';
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 0.005) return '0';
  if (Math.abs(v) < 0.01) return v.toFixed(3);
  return v.toFixed(2);
}

function Verdict({ sum, outputMaxAbs }) {
  const t = outputMaxAbs === 0 ? 0 : sum / outputMaxAbs;
  let label, color;
  if (t > 0.5) {
    label = 'Strong positive. This filter responded here.';
    color = 'var(--color-teal)';
  } else if (t < -0.5) {
    label = 'Strong negative. The filter saw the opposite of what it detects.';
    color = 'var(--color-red)';
  } else if (Math.abs(t) < 0.15) {
    label = 'Near zero. No pattern for this filter at this position.';
    color = 'var(--color-text-muted)';
  } else {
    label = 'Partial response.';
    color = 'var(--color-amber)';
  }
  return (
    <div className="flex items-baseline gap-3">
      <div style={{ color }} className="text-4xl font-mono font-semibold">
        {formatValue(sum)}
      </div>
      <div style={{ color }} className="text-[13px]">
        {label}
      </div>
    </div>
  );
}

export default function WhatIsAConvolution() {
  const [filterName, setFilterName] = useState('vertical-edge');
  const [selected, setSelected] = useState({ row: 1, col: 0 });

  const filter = FILTERS[filterName];
  const output = useMemo(() => convolveValid(INPUT_IMAGE, filter.kernel), [filter]);
  const outputMaxAbs = maxAbsOf(output);

  const patch = extractPatch(INPUT_IMAGE, selected.row, selected.col, 3);
  const products = elementwiseProduct(patch, filter.kernel);
  const sum = products.flat().reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-10">
      {/* Opening bridge */}
      <section>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary-light)] mb-2">
          Stop 1 of 3 · What is a convolution
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          A small filter. A multiply-and-sum. That is the whole operation.
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          A multilayer perceptron treats every pixel in a 28 by 28 image as an
          independent input: 784 numbers going into a wall of neurons, each with
          its own weight to every pixel. That works, but it throws away something
          obvious about pictures. Nearby pixels are related. A stroke of ink at
          (row 4, col 7) and a stroke at (row 4, col 8) are almost certainly part
          of the same thing. The MLP has no built-in way to know that; it has to
          learn the relationship separately for every pair of positions.
        </p>
        <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] mt-3">
          A convolution is the move that encodes this knowledge into the
          architecture. You make a small template (a 3 by 3 grid of numbers),
          slide it across the image, and at every position you multiply the
          template by the pixels under it and add up the nine products. That
          one sum becomes one pixel in a new, smaller image. The template is
          shared across every position, so you learn one local pattern detector
          and apply it everywhere.
        </p>
      </section>

      {/* Historical aside */}
      <section className="border-l-2 border-[var(--color-border)] pl-4 text-[13px] text-[var(--color-text-secondary)]">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          A short origin
        </div>
        <p>
          In 1959, David Hubel and Torsten Wiesel put electrodes into the visual
          cortex of a cat and found cells that fired only when a bar of light at
          a specific orientation crossed the cat's field of view. Different cells,
          different orientations. Cells one layer up pooled over several
          oriented-edge cells and fired for the edge regardless of where it
          appeared. Twenty years later, Kunihiko Fukushima built a machine that
          did the same thing in silicon (the Neocognitron). Yann LeCun, at Bell
          Labs in 1989, wired it up with backpropagation so the detectors could
          learn themselves, and pointed it at envelopes of handwritten zip codes.
          The filter you are about to play with is a direct descendant of that
          1959 electrode spike.
        </p>
      </section>

      {/* Anatomy of a filter */}
      <section className="space-y-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary-light)] mb-2">
            Anatomy of a filter
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-3">
            Nine numbers and a rule.
          </h3>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            A filter is a small grid of numbers. Nine of them, arranged in a 3
            by 3 pattern. Each number is a weight. When the filter lands on an
            image patch, the weight at position (r, c) multiplies the pixel at
            position (r, c) of the patch. All nine products are summed into a
            single output number. The numbers in the filter are what define
            what pattern it detects.
          </p>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] mt-3">
            Look at one. This is the vertical-edge filter, laid out with its
            three columns labelled by what each one does:
          </p>
        </div>

        <div className="flex justify-center">
          <AnnotatedVerticalEdgeFilter />
        </div>

        <div>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Read the filter column by column. The left column is all
            <span className="font-mono"> -1</span>: the three pixels that land
            under this column get subtracted. The middle column is all
            <span className="font-mono"> 0</span>: whatever pixels land under
            this column contribute nothing. The right column is all
            <span className="font-mono"> +1</span>: those three pixels get
            added.
          </p>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] mt-3">
            The rule that falls out: if the right side of the patch is brighter
            than the left, the sum is positive. If the left is brighter, the sum
            is negative. If the two sides are equal, the sum is zero. The filter
            is asking one question: "Is the image getting brighter as you move
            rightward?" The nine numbers are how the question is spelled.
          </p>
        </div>

        <div>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] mb-4">
            Here is the same filter applied to two 3 by 3 patches. Same nine
            numbers. Opposite inputs.
          </p>
          <div className="space-y-4">
            <WorkedExample
              patch={[
                [0, 0, 1],
                [0, 0, 1],
                [0, 0, 1],
              ]}
              label="Patch A · dark on left, bright on right"
              interpretation="Positive result. The filter is telling you yes, the right side is brighter than the left. A vertical edge, going dark-to-light rightward, lives here."
              tone="positive"
            />
            <WorkedExample
              patch={[
                [1, 0, 0],
                [1, 0, 0],
                [1, 0, 0],
              ]}
              label="Patch B · bright on left, dark on right"
              interpretation="Negative result. Same filter, opposite answer. The filter cares about direction, not just whether an edge is present. A light-to-dark transition gives a negative sum."
              tone="negative"
            />
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] mt-4">
            The other three presets in the machine below work the same way: nine
            numbers, a rule that those numbers encode. Click each one to see what
            it is built to detect.
          </p>
        </div>
      </section>

      {/* Interactive: two-column */}
      <section className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10">
        <div>
          <ConvolutionMachine
            image={INPUT_IMAGE}
            filter={filter}
            filterName={filterName}
            output={output}
            selected={selected}
            onSelect={setSelected}
            onFilterChange={setFilterName}
          />
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
              How to use this
            </div>
            <p className="text-[14px] text-[var(--color-text-secondary)]">
              Pick a filter from the four buttons. The output grid already shows
              what that filter produces everywhere on the input. To see how any
              single output cell was computed, either click the output cell
              directly, or click anywhere on the input image to move the yellow
              window. The verdict box updates live.
            </p>
          </div>

          <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-surface-alt)]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Output cell ({selected.row}, {selected.col}) · how it was computed
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <MiniGrid matrix={patch} maxAbs={1} />
              <span className="text-xl font-mono text-[var(--color-text-muted)]">⊙</span>
              <MiniGrid matrix={filter.kernel} />
              <span className="text-xl font-mono text-[var(--color-text-muted)]">=</span>
              <MiniGrid matrix={products} />
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Sum of the nine products
            </div>
            <Verdict sum={sum} outputMaxAbs={outputMaxAbs} />

            <div className="text-[12px] text-[var(--color-text-muted)] mt-4 italic">
              {filter.description}
            </div>
          </div>
        </div>
      </section>

      {/* Visceral consequence */}
      <section>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          What the pattern in the output means
        </div>
        <p className="text-[14px] text-[var(--color-text-secondary)]">
          With the vertical-edge filter on the vertical-stroke input, look at the
          output column by column. The leftmost column is bright positive (the
          filter's +1 side lines up with the stroke). The middle column is near
          zero (the stroke sits under the filter's zeros). The rightmost column
          is bright negative (the filter's −1 side lines up with the stroke). One
          stroke, but the filter reports two edges with opposite signs. That is
          exactly what an oriented edge detector in a cat's visual cortex does.
          Try the horizontal-edge filter on the same input: the output is all
          zeros, because there is no horizontal transition anywhere in the image.
          The architecture only sees what its filter is built to see.
        </p>
      </section>

      {/* Theory section */}
      <section>
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
          The notation, earned
        </div>
        <p className="text-[14px] text-[var(--color-text-secondary)]">
          You have now done every operation in the standard 2D convolution
          formula. Textbooks write it like this:
        </p>
        <pre className="my-3 px-4 py-3 rounded bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[14px] font-mono overflow-x-auto text-[var(--color-text)]">{`(I * K)[i, j] = sum over m, n of  I[i + m, j + n] · K[m, n]`}</pre>
        <p className="text-[14px] text-[var(--color-text-secondary)]">
          Read in English: the output pixel at (i, j) is the sum of
          element-wise products between the image patch starting at (i, j) and
          the kernel K. That is the thing you just clicked. The symbol earns
          its place because you already know what it does.
        </p>
      </section>

      {/* Hand-off question */}
      <section className="border-t border-[var(--color-border)] pt-6">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary-light)] mb-2">
          Next stop
        </div>
        <p className="text-[15px] text-[var(--color-text)] leading-relaxed">
          This one filter detects one specific pattern. A handwritten digit has
          curves, corners, diagonals, and loops. You would need many filters,
          and nobody knows in advance which patterns to detect. So who designs
          them?
        </p>
        <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
          Stop 2 shows what the network did when it had to figure that out on its
          own.
        </p>
      </section>
    </div>
  );
}
