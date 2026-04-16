# Episode 2 — CNN

**Status:** First episode to build. This is where we prove the whole pipeline works.

## Triad

| Artifact | Content |
|---|---|
| `notebook/02_cnn.ipynb` | Train a small CNN on MNIST in Colab. Export weights, loss curves, sample activations to `precomputed.json` + ONNX. |
| `app/` | Vite app. Guided tour: "what is a convolution" → "watch filters learn" → "feature maps across layers" → "live inference on your drawing". |
| `curriculum/ep2_curriculum.md` | Narrative — spatial inductive bias, translation invariance, why pixels-as-independent-features fails. |
| `artifacts/schema.md` | JSON contract between notebook output and app input. |

## Why CNN first (not MLP)

Episode 1 (BDT port) is deferred until after the 2026-04-23 talk. Episode 2 establishes the shared patterns (tour framework, Colab→app artifact bridge, client-side ONNX inference) that later episodes will inherit.

## Core concept

**Architecture encodes assumptions about data.** A CNN assumes pixels near each other are related. That's it. That single assumption — implemented as convolution + pooling + weight sharing — is why CNNs beat MLPs on images by orders of magnitude.

## Build order

1. Scaffold the Vite app (copy `ui.jsx`, `TourView.jsx` patterns from KVCache-Explorer)
2. Notebook: train CNN, export artifacts
3. Interactive stops: filter animation, feature map viewer, drawable digit → ONNX inference
4. Ship via GH Pages subpath
