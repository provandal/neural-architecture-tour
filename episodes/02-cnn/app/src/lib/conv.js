// Tiny 2D convolution helpers used by the Stop 1 machine.
// Valid padding only (output shrinks): for H x W input and K x K filter,
// output is (H - K + 1) x (W - K + 1).

export function extractPatch(image, row, col, size) {
  const patch = [];
  for (let r = 0; r < size; r++) {
    const line = [];
    for (let c = 0; c < size; c++) {
      line.push(image[row + r][col + c]);
    }
    patch.push(line);
  }
  return patch;
}

export function elementwiseProduct(a, b) {
  return a.map((row, r) => row.map((v, c) => v * b[r][c]));
}

export function sumMatrix(matrix) {
  let total = 0;
  for (const row of matrix) for (const v of row) total += v;
  return total;
}

export function convolveValid(image, filter) {
  const H = image.length;
  const W = image[0].length;
  const K = filter.length;
  const outH = H - K + 1;
  const outW = W - K + 1;
  const out = [];
  for (let r = 0; r < outH; r++) {
    const line = [];
    for (let c = 0; c < outW; c++) {
      const patch = extractPatch(image, r, c, K);
      line.push(sumMatrix(elementwiseProduct(patch, filter)));
    }
    out.push(line);
  }
  return out;
}
