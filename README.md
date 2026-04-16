# Neural Architecture Tour

A hands-on series for building intuition about neural network architectures from the ground up.

Each episode pairs three things:

- **A Colab notebook** — learn the mechanics in the tools practitioners actually use (PyTorch, scikit-learn, Hugging Face).
- **A browser app** — play with a trained model, develop intuition, run inference live in your browser.
- **A curriculum doc** — a narrative tying both together.

## Episodes

| # | Topic | Status |
|---|---|---|
| 1 | MLP — the single perceptron and its stacked cousin | See [Binary Digit Trainer](https://github.com/provandal/binarydigittrainer) (standalone, will be reimagined here later) |
| 2 | CNN — spatial inductive bias | Coming soon |
| 3 | RNN / LSTM — temporal state | Coming soon |
| 4 | Transformer — attention is all you need (to click) | Coming soon |
| 5 | Classical ML — trees, forests, boosting | Coming soon |

## Stack

- React 19 + Vite + Tailwind v4 + Zustand (per episode app)
- pnpm workspaces (monorepo)
- GitHub Pages deployment, one site with subpaths per episode
- Colab + ONNX + `@huggingface/transformers` for the browser-inference bridge

## Layout

```
neural-architecture-tour/
├── landing/                     static landing page with episode cards
├── episodes/
│   ├── 01-mlp/                  MLP (built last — port of Binary Digit Trainer)
│   ├── 02-cnn/                  CNN (first episode built — proves the pipeline)
│   ├── 03-rnn/
│   ├── 04-transformer/
│   └── 05-classical-ml/
└── packages/                    shared primitives (extracted later, not upfront)
```

Each episode directory has:

```
episodes/NN-slug/
├── app/           Vite app
├── notebook/      Jupyter / Colab notebook
├── curriculum/    narrative markdown
└── artifacts/     JSON contract between Colab and app
```

## License

MIT (matches Binary Digit Trainer).
