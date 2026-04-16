# Episode 5 — Classical ML

**Status:** Coming soon. Positioned as a capstone counterpoint to the neural-net arc.

## Planned triad

| Artifact | Content |
|---|---|
| `notebook/05_classical_ml.ipynb` | Train a decision tree, a random forest, and an XGBoost model on tabular data. Compare to a small neural net on the same dataset. |
| `app/` | Visualize a decision tree node-by-node. Feature importance charts. "When does XGBoost beat a neural net?" interactive. |
| `curriculum/ep5_curriculum.md` | Narrative — bias/variance, ensembles, bagging vs boosting, why trees still win on tabular data. |

## Core concept

**Not every problem needs a neural net.** After four episodes of increasingly elaborate neural architectures, Episode 5 circles back to the workhorse of real-world ML: gradient-boosted trees. This episode is the one that teaches *tool selection*.

## Why it lands last

Only after feeling the complexity of CNN, RNN, and Transformer can you appreciate why a 20-tree forest still wins most tabular problems. Ordering matters pedagogically.

## Reference

FineTuningDemo's `Traditional_ML_Comparison.ipynb` is a direct starting point for the notebook side.
