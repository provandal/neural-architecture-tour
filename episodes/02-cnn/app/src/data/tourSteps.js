// Episode 2 tour definition. Each stop renders a component from
// TourView's STOP_COMPONENTS map. Placeholder stops for M1; real
// interactive content arrives in M3.

export const tourSteps = [
  {
    id: 'what-is-a-convolution',
    shortTitle: 'What is a convolution?',
    title: 'What is a convolution?',
    narration:
      'A small window slides across an image. At every position, it multiplies pixel values by a pattern and sums them up. That sum is one number. One filter. One feature detector.',
    component: 'WhatIsAConvolution',
  },
  {
    id: 'watching-filters-learn',
    shortTitle: 'Watching filters learn',
    title: 'Watching filters learn',
    narration:
      'A CNN doesn\'t start with edge detectors. It starts with random noise. Training gradually pushes those noisy filters into patterns — edges, curves, textures, parts of digits. This is what "learning" looks like from the model\'s perspective.',
    component: 'WatchingFiltersLearn',
  },
  {
    id: 'live-inference-coming-soon',
    shortTitle: 'Live inference',
    title: 'Live inference (coming soon)',
    narration:
      'Draw a digit with your finger or mouse. The trained CNN runs directly in your browser — no server — and tells you what it sees. This is the capstone stop for Episode 2.',
    component: 'LiveInferenceComingSoon',
  },
];
