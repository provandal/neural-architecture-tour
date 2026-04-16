# Episode 2 Curriculum — CNN: Watching Filters See

This is the authoring document for Episode 2. It's where narrative is drafted before (or alongside) interactive implementation. Claude.AI drafts; Claude Code implements. Narration below is the first pass — expect revision.

## Core claim

**Architecture encodes assumptions about data.** An MLP assumes every pixel is equally meaningful and independent of every other pixel. A CNN assumes nearby pixels are related. That single assumption — implemented as convolution + pooling + weight sharing — is why CNNs beat MLPs on images by orders of magnitude.

By the end of Episode 2, the learner should be able to say:
1. What a convolution does, concretely, in math terms (not metaphor).
2. Why weight sharing is the heart of the CNN — the same filter applied at every position.
3. How filters go from random noise to edge detectors during training, without anyone telling them to.
4. What happens in layer 2, 3 onward — how feature complexity grows with depth.
5. Why an MLP cannot do this as efficiently.

## Narrative arc

### Stop 1 — What is a convolution?

**Hook:** Start with the window-sliding metaphor, then immediately puncture it. The metaphor is fine but obscures the actual operation.

**Body:** A convolution is multiplication-and-sum. Take a 3×3 patch of the input image. Take the 3×3 filter. Multiply them element-wise. Add the nine products together. That sum is one pixel in the output. Do it for every possible patch position.

**Interaction:** A drag-handle lets the user slide a 3×3 window over a sample MNIST digit. As they move the window, show:
- The 9 pixel values under the window
- The 9 filter values
- The 9 products
- The sum (which becomes one output pixel)
- The progressively built output feature map

**Takeaway:** The filter is a template. Where the template matches the image's local pattern, the output is bright. Where it doesn't, the output is dark. Everything else in CNNs is built on this.

### Stop 2 — Weight sharing is the trick

**Hook:** "Here's what an MLP would do." Show an MLP-shaped diagram where every output pixel has its own 784 parameters. For a 28×28 image, that's 28 × 28 × 784 = 614,656 parameters per output pixel. Absurd.

**Body:** A convolution uses the same 9 parameters for every output pixel. One 3×3 filter is 9 weights. Eight filters is 72 weights. That's the entire first layer of our CNN. 72 parameters instead of millions.

**Why this is powerful:** Weight sharing enforces *translation invariance* — a pattern that matters at position (5, 10) in the image should matter at (15, 20) too. Weight sharing says "use the same detector everywhere." The MLP has to re-learn every position independently.

**Interaction:** Two side-by-side: an MLP-style mapping with all weights exposed (visually overwhelming) and a CNN-style mapping with the single reused filter. Let the user move an input pattern and see:
- In the MLP, completely different parameters activate.
- In the CNN, the same filter slides and activates on the new position.

### Stop 3 — Watching filters learn

**Hook:** At step 0, the 8 first-layer filters are pure random noise. They detect nothing. A few thousand training steps later, they're recognizable — horizontals, verticals, diagonals.

**Body:** Nobody told the network to look for edges. Gradient descent did. The loss function wanted the network to classify digits; edge detection happened to be the fastest path to lower loss; so gradient descent pushed the random filters toward edge detectors.

**Interaction:** Scrubber across training steps. Show the 8 filters at each snapshot. User drags the scrubber and watches the transformation in real time. Use `filter_snapshots` from `precomputed.json`.

**Takeaway:** Features are learned, not designed. The inductive bias (locality, weight sharing) is baked in by the architect; the specific features emerge from the data. Train the same architecture on cats and you get cat-part detectors; on faces, face-part detectors.

### Stop 4 — Feature maps (what does it see?)

**Hook:** A filter alone doesn't mean much. A filter applied to an image produces a feature map — a picture of "where in the image does this filter fire."

**Body:** Pick a test digit. Show the 8 feature maps from the first conv layer. Each bright region in a feature map is where that filter matched. Some will fire on horizontal strokes, some on verticals, some on curves. The network combines these into a classification.

**Interaction:** Digit picker (a few MNIST samples). For each, display the input and the 8 feature maps side by side. Label filters with what they appear to detect (if recognizable).

**Takeaway:** Each layer produces a stack of feature maps — one per filter. Deeper layers take those stacks as input and build higher-level features. This is how complexity grows with depth.

### Stop 5 — Pooling and depth

**Hook:** Why does MaxPool exist? Why halve the spatial size between layers?

**Body:** MaxPool does two things:
1. **Shrinks the image.** Halving H and W means 4x fewer positions for the next layer to process.
2. **Expands the receptive field.** A neuron in layer 2 sees a 6×6 patch of the original image (through its 3×3 filter applied to layer 1's 3×3-derived output). A neuron in layer 3 sees even more. This is how deep CNNs build hierarchical features — small patches → local features → bigger patches → shapes → digits.

**Interaction:** Diagram of how a single layer-3 neuron's receptive field maps back through the layers to a patch of the input image. Highlight the expansion.

**Takeaway:** Depth isn't just for capacity — it's how the network learns to compose local features into global meaning.

### Stop 6 — Live inference

**Hook:** "You've seen how it learns. Now meet your trained model."

**Body:** A 28×28 canvas. The user draws a digit. On every stroke, `@huggingface/transformers` runs the ONNX model in the browser, returning the 10-class probability distribution. Show:
- The drawing
- The bar chart of probabilities
- The predicted digit
- (Bonus) A toggle to show the first-layer feature maps for whatever the user just drew

**Takeaway:** This model lives in your browser tab. No server. No API call. A ~220KB ONNX file running fully client-side. The same model that came out of the Colab notebook above.

## What to leave out (vs. earlier drafts)

- **No tensor-shape notation in stop bodies.** Push dimensions into the curriculum sidebar; narration is prose.
- **No explicit tensor indexing math.** Show it graphically; the numbers are interchangeable.
- **No comparisons to GANs or diffusion models.** Those are Episode 5+ territory, not here.
- **No claims about ResNet/VGG/etc.** Stays architecture-agnostic within "CNN."

## Open questions for next revision

- Should Stop 2 (weight sharing) come *before* Stop 1, so the learner arrives at convolution already expecting why it's cheap?
- Is the drag-the-window interaction clearer as a "stepper" (click to advance) than a true drag?
- How much of the backprop story belongs here vs. in the MLP episode (when ported)?
- Do we want a "what MLP gets wrong on MNIST" comparison stop, or does that belong in Episode 1?
