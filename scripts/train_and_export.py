"""Train the Episode 2 CNN and export artifacts for the browser app.

This script mirrors episodes/02-cnn/notebook/02_cnn.ipynb. The notebook is
the primary pedagogical artifact (Colab-friendly, narrative-rich); this
script is the reproducible build step that drops `precomputed.json` and
`model.onnx` into the app's public/data directory so the deployed site
can demo the trained model without anyone running the notebook first.

Run from the monorepo root:

    python scripts/train_and_export.py
"""
from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

REPO_ROOT = Path(__file__).resolve().parent.parent
EP_ROOT = REPO_ROOT / "episodes" / "02-cnn"
APP_DATA = EP_ROOT / "app" / "public" / "data"
APP_DATA.mkdir(parents=True, exist_ok=True)

# Keep the MNIST cache outside OneDrive to avoid sync lock contention.
DATA_ROOT = Path.home() / ".cache" / "nat-mnist"
DATA_ROOT.mkdir(parents=True, exist_ok=True)


class SmallCNN(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.conv1 = nn.Conv2d(1, 8, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(8, 16, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2)
        self.fc1 = nn.Linear(16 * 7 * 7, 64)
        self.fc2 = nn.Linear(64, 10)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.flatten(1)
        x = F.relu(self.fc1(x))
        return self.fc2(x)


def main() -> None:
    torch.manual_seed(42)
    np.random.seed(42)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"torch {torch.__version__}  |  device: {device}")

    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,)),
    ])
    train_data = datasets.MNIST(root=str(DATA_ROOT), train=True, download=True, transform=transform)
    test_data = datasets.MNIST(root=str(DATA_ROOT), train=False, download=True, transform=transform)
    train_loader = DataLoader(train_data, batch_size=128, shuffle=True)
    test_loader = DataLoader(test_data, batch_size=256, shuffle=False)
    print(f"MNIST: {len(train_data):,} train / {len(test_data):,} test")

    model = SmallCNN().to(device)
    n_params = sum(p.numel() for p in model.parameters())
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()

    snapshot_steps = {0, 50, 100, 200, 500, 1000, 2000}
    history = {"step": [], "train_loss": [], "test_accuracy": []}
    filter_snapshots: list[dict] = []

    def snapshot_conv1() -> list:
        return model.conv1.weight.detach().cpu().numpy().copy().tolist()

    def evaluate() -> float:
        model.eval()
        correct = total = 0
        with torch.no_grad():
            for x, y in test_loader:
                x, y = x.to(device), y.to(device)
                preds = model(x).argmax(dim=1)
                correct += (preds == y).sum().item()
                total += y.size(0)
        model.train()
        return correct / total

    filter_snapshots.append({"step": 0, "filters": snapshot_conv1()})

    model.train()
    step = 0
    loss_value = 0.0
    start = time.time()
    for _ in range(5):
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            loss = criterion(model(x), y)
            loss.backward()
            optimizer.step()
            loss_value = loss.item()
            step += 1
            if step in snapshot_steps:
                acc = evaluate()
                history["step"].append(step)
                history["train_loss"].append(loss_value)
                history["test_accuracy"].append(acc)
                filter_snapshots.append({"step": step, "filters": snapshot_conv1()})
                print(f"  step {step:5d}  |  loss {loss_value:.4f}  |  test acc {acc:.4f}")

    final_acc = evaluate()
    history["step"].append(step)
    history["train_loss"].append(loss_value)
    history["test_accuracy"].append(final_acc)
    filter_snapshots.append({"step": step, "filters": snapshot_conv1()})
    elapsed = time.time() - start
    print(f"Training finished in {elapsed:.1f}s  |  final test acc {final_acc:.4f}")

    # Sample predictions + feature maps for a handful of test digits.
    samples = []
    model.eval()
    with torch.no_grad():
        for idx in [0, 1, 2, 5, 7, 11]:
            img, label = test_data[idx]
            x = img.unsqueeze(0).to(device)
            logits = model(x).cpu().numpy()[0]
            shifted = logits - logits.max()
            probs = np.exp(shifted)
            probs = probs / probs.sum()
            conv1_maps = F.relu(model.conv1(x)).squeeze(0).cpu().numpy()
            samples.append({
                "index": idx,
                "image": img.squeeze().cpu().numpy().tolist(),
                "true_label": int(label),
                "pred_label": int(logits.argmax()),
                "probabilities": probs.tolist(),
                "conv1_feature_maps": conv1_maps.tolist(),
            })

    artifact = {
        "version": "1",
        "episode": "02-cnn",
        "model": {
            "name": "SmallCNN",
            "input_shape": [1, 1, 28, 28],
            "num_classes": 10,
            "parameters": n_params,
            "architecture": "2xconv(8,16) + 2xfc(64,10)",
        },
        "training": {
            "dataset": "MNIST",
            "optimizer": "Adam",
            "learning_rate": 1e-3,
            "batch_size": 128,
            "epochs": 5,
            "final_test_accuracy": final_acc,
            "total_steps": step,
            "wall_clock_seconds": elapsed,
        },
        "history": history,
        "filter_snapshots": filter_snapshots,
        "samples": samples,
        "onnx_model_url": "./model.onnx",
    }

    precomputed_path = APP_DATA / "precomputed.json"
    with precomputed_path.open("w") as f:
        json.dump(artifact, f)
    print(f"Wrote {precomputed_path} ({precomputed_path.stat().st_size / 1024:.1f} KB)")

    # ONNX export + verification
    dummy = torch.randn(1, 1, 28, 28, device=device)
    onnx_path = APP_DATA / "model.onnx"
    torch.onnx.export(
        model,
        dummy,
        str(onnx_path),
        input_names=["input"],
        output_names=["logits"],
        dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
    )
    print(f"Wrote {onnx_path} ({onnx_path.stat().st_size / 1024:.1f} KB)")

    import onnx
    import onnxruntime as ort
    onnx.checker.check_model(onnx.load(str(onnx_path)))
    sess = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    test_img, _ = test_data[0]
    onnx_out = sess.run(None, {"input": test_img.unsqueeze(0).cpu().numpy()})[0]
    with torch.no_grad():
        torch_out = model(test_img.unsqueeze(0).to(device)).cpu().numpy()
    diff = float(np.abs(onnx_out - torch_out).max())
    print(f"ONNX vs PyTorch max output diff: {diff:.2e}")
    assert diff < 1e-4, "ONNX export does not match PyTorch!"
    print("ONNX verified.")


if __name__ == "__main__":
    main()
