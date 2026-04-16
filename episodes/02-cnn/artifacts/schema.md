# Episode 2 Artifact Schema

The Colab notebook (`../notebook/02_cnn.ipynb`) produces two files that the browser app consumes. This document is the contract between them.

## Files

| File | Purpose | Placed at |
|---|---|---|
| `precomputed.json` | Training history, filter snapshots, sample predictions | `../app/public/data/precomputed.json` |
| `model.onnx` | Trained model for client-side inference | `../app/public/data/model.onnx` |

The app loads `precomputed.json` on mount and references `model.onnx` only when the user enters the live-inference stop.

## `precomputed.json` shape

```ts
{
  version: "1",
  episode: "02-cnn",

  model: {
    name: "SmallCNN",
    input_shape: [1, 1, 28, 28],    // [batch, channels, H, W]
    num_classes: 10,
    parameters: number,              // total trainable parameters
    architecture: string,            // human-readable summary
  },

  training: {
    dataset: "MNIST",
    optimizer: "Adam",
    learning_rate: number,
    batch_size: number,
    epochs: number,
    final_test_accuracy: number,     // 0.0 - 1.0
    total_steps: number,
    wall_clock_seconds: number,
  },

  history: {
    step: number[],                  // parallel arrays, same length
    train_loss: number[],
    test_accuracy: number[],
  },

  filter_snapshots: Array<{
    step: number,                    // training step when captured
    filters: number[8][1][3][3],     // first-layer conv weights
                                     // shape: [out_channels, in_channels, H, W]
                                     // for SmallCNN: 8 filters, 1 input channel, 3x3
  }>,

  samples: Array<{
    index: number,                   // index in MNIST test set
    image: number[28][28],           // normalized pixel values
    true_label: number,              // 0-9
    pred_label: number,              // 0-9
    probabilities: number[10],       // softmax across classes, sums to 1
    conv1_feature_maps: number[8][28][28],  // post-ReLU conv1 output
  }>,

  onnx_model_url: "./model.onnx",    // relative to precomputed.json's location
}
```

## `model.onnx` interface

- **Input:** tensor `input`, shape `[batch, 1, 28, 28]`, float32, normalized (mean 0.1307, std 0.3081)
- **Output:** tensor `logits`, shape `[batch, 10]`, float32. The app applies softmax client-side.
- **Opset:** 17
- **Dynamic axes:** batch dimension (the app passes one drawing at a time)

## Fallback behavior

The app ships a **hand-written fallback artifact** at `app/src/data/fallback.js` so that all visualization logic can be developed and tested before real artifacts exist. Fallback data uses the same schema with a short synthetic history and 2 snapshot steps. The app prefers `public/data/precomputed.json` if present and falls back otherwise. This keeps the two workstreams (notebook + app) unblocked from each other.

## Versioning

Bump `version` when the schema changes in a breaking way. The app reads `version` on load and refuses to render if it doesn't match. For additive changes (new optional fields), keep the version and handle the old shape gracefully.
