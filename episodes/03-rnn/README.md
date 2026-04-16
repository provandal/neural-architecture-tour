# Episode 3 — RNN / LSTM

**Status:** Coming soon.

## Planned triad

| Artifact | Content |
|---|---|
| `notebook/03_rnn.ipynb` | Train an RNN (and an LSTM for comparison) on a sequence task in Colab. |
| `app/` | Watch hidden state evolve token-by-token. Compare RNN vs LSTM on long-range dependencies. |
| `curriculum/ep3_curriculum.md` | Narrative — why sequences are hard, why recurrence helps, why recurrence still fails. |

## Core concept

**Memory over time.** An RNN is a neural net with a loop — a hidden state that carries information forward as it reads a sequence. Watching that state evolve is where intuition clicks. The failure modes (vanishing gradients, forgetting long context) set up why attention had to be invented.

## This is the pedagogical bridge to Transformers

The whole point of Episode 3 is to *feel* the problem Transformers solved. Without the RNN pain, attention is arbitrary magic.

## Milestone marker

This episode triggers M4 — extract `packages/tour-kit` from what's now clearly shared between Ep 2 and Ep 3 starting points.
