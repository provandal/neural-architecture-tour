# Episode 4 — Transformer

**Status:** Coming soon.

## Planned triad

| Artifact | Content |
|---|---|
| `notebook/04_transformer.ipynb` | Fine-tune a small Transformer on a focused task using HF Transformers + PEFT. Export to HF Hub as ONNX. |
| `app/` | Live inference via `@huggingface/transformers`. Interactive attention-weight viewer. Compare head behavior. |
| `curriculum/ep4_curriculum.md` | Narrative — attention from first principles, self-attention, multi-head, why position embeddings, scaling. |

## Core concept

**Attention = learned lookup.** Each position in a sequence looks at every other position and decides what to attend to. No recurrence. No sequential bottleneck. Parallelizable. The single idea behind every LLM.

## This is the capstone

Episode 4 is the hardest, most complex episode — full HF Hub + transformers.js + ONNX pipeline. If this ships, the whole series has proven its full range.

## Reference

FineTuningDemo's `app/src/services/inference.js` is the starting point for the browser inference layer. Its `Post_Training_Pipeline.ipynb` is the pattern for narrative-rich notebook pedagogy.
