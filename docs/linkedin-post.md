# LinkedIn post

> Paste-ready draft. Replace `[TODO: GitHub link]` with the repository URL when published.

---

I built a small lab to make Core Web Vitals feel real instead of abstract. 🚀

Same product page, rendered twice:

- `/bad` — a hero image that’s megabytes large and loads lazily, a promo banner that
  shoves content down a second after paint, and an “Add to cart” button that freezes the
  UI for ~700ms.
- `/optimized` — a sized WebP hero with `fetchPriority="high"`, a banner slot reserved up
  front, and the expensive cart work moved to a Web Worker.

Same UI. Very different LCP, CLS, and INP — run Lighthouse (Mobile preset) on each route in
Chrome DevTools and the contrast is obvious.

A few things I wanted to demonstrate:

1. **Core Web Vitals are an architecture pattern, not a score.** Sizing your images,
   reserving layout space, and keeping the main thread free are decisions that pay off in
   every metric at once.
2. **Lab ≠ field.** Lighthouse is a great smoke alarm, but it’s not the fire. I added a
   note on when not to obsess over the score.
3. **The fix is often boring.** `width`/`height` attributes, `loading`/`fetchPriority`,
   and offloading work to a worker cover most real-world regressions.

Stack: React + TypeScript + Vite, Vitest, and `sharp` for the demo images. Measured with
Lighthouse (Mobile preset) in Chrome DevTools — the `/bad` route is allowed to be slow on
purpose.

Repo: [TODO: GitHub link]

#webperf #corewebvitals #react #typescript #frontend #lighthouse

---

<!--
When posting, attach a short screen capture or before/after Lighthouse screenshot for
better reach. The docs/before-after.md table makes a good image.
-->
