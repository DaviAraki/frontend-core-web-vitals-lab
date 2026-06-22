# frontend-core-web-vitals-lab

A standalone lab that demonstrates **Core Web Vitals** as a practical frontend architecture
and performance pattern. It renders the **same product landing page twice** — an
intentionally poor `/bad` version and an `/optimized` version — and shows you how to measure
the difference with **Lighthouse via Chrome DevTools**. Full documentation included.

> ⚠️ The `/bad` route is deliberately slow. Its anti-patterns are labelled in the code with
> `// Intentionally bad:` comments. Do **not** copy them into production.

---

## What are Core Web Vitals?

Core Web Vitals (CWV) are Google’s user-experience signals for the web. This lab focuses on
the three **core** metrics, and collects two **supporting** ones:

| Metric | Measures | Good | Needs improvement | Poor |
| --- | --- | --- | --- | --- |
| **LCP** — Largest Contentful Paint | Loading speed | ≤ 2500 ms | ≤ 4000 ms | > 4000 ms |
| **INP** — Interaction to Next Paint | Responsiveness | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| **CLS** — Cumulative Layout Shift | Visual stability | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| FCP — First Contentful Paint *(supporting)* | First paint | ≤ 1800 ms | ≤ 3000 ms | > 3000 ms |
| TTFB — Time to First Byte *(supporting)* | Server responsiveness | ≤ 800 ms | ≤ 1800 ms | > 1800 ms |

## What this repo demonstrates

- A small ecommerce/product landing page built with **React + TypeScript + Vite**.
- Two routes (`/bad`, `/optimized`) showing the **same conceptual UI** but with opposite
  performance characteristics.
- **Lighthouse via Chrome DevTools** is the measurement tool — run it on each route (Mobile
  preset) to see the contrast in LCP, CLS, and INP.
- A **Web Worker** offloads the expensive cart work on `/optimized`, demonstrating the INP
  fix at the code level (vs. a synchronous blocking handler on `/bad`).
- **Vitest** unit tests for the core logic.
- No JavaScript source files — **TypeScript everywhere**. No heavy UI framework.

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Home — explains the project and links to the demos. |
| `/bad` | The intentionally poor implementation. |
| `/optimized` | The optimized implementation. |
| `/notes` | Explainer, pros/cons, pitfalls, and “when not to obsess over scores”. |

---

## How to run locally

Requires **Node ≥ 20** and **pnpm**.

```bash
pnpm install
pnpm dev
```

`pnpm install` also generates the demo images (via a `sharp` `postinstall` script); you can
regenerate them anytime with `pnpm assets`. Then open the URL Vite prints
(http://localhost:5173).

> **Tip for a fair comparison:** use Lighthouse's **Mobile** preset on each route (see below).
> Desktop / no-throttle hides the `/bad` route's problems, because even a 1.5 MB image loads
> fast on localhost.

## How to build

```bash
pnpm build      # type-checks with tsc, then bundles with Vite into dist/
pnpm preview    # serves the production build on http://localhost:4173
```

## How to run tests

```bash
pnpm test        # single run (CI-friendly)
pnpm test:watch  # watch mode
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
```

## Measuring Core Web Vitals (Lighthouse via DevTools)

There is no in-app metrics widget by design — measure with the real tool:

1. Run the app (`pnpm dev`) and open `/optimized` or `/bad`.
2. Open **Chrome DevTools → Lighthouse**.
3. Choose **Mobile** device + the **Performance** category, then **Analyze page load**. The
   Mobile preset (Slow 4G + slowed CPU) is what makes the bad-vs-optimized contrast obvious:
   the 1.5 MB hero image tanks LCP/CLS under throttle, while the ~15 KB WebP on `/optimized`
   stays fast.
4. Note **LCP**, **CLS**, and **TBT** (the lab proxy for INP). Repeat on the other route and
   compare.

To see the **INP** problem directly: on `/bad`, open the **Performance** panel, record while
clicking “Add to cart”, then stop — you’ll see a long blocking task on the main thread. On
`/optimized` the same work runs in a Web Worker, so the main thread stays free.

> Use the **Mobile** preset. On Desktop (no throttling) a huge image still loads fast on
> localhost, which hides the very problems the `/bad` route is meant to demonstrate.

---

## Bad vs optimized

See [`docs/before-after.md`](docs/before-after.md) for the full table. Summary:

| Metric | `/bad` | `/optimized` |
| --- | --- | --- |
| **LCP** | Huge unoptimized JPEG, lazy-loaded, shown after a 1.6s artificial delay | Sized WebP, `loading="eager"` + `fetchPriority="high"`, dimensions reserved |
| **CLS** | Promo banner injected above content after load; unsized images; late font swap | Banner slot reserved up front; sized images/avatars; stable typography |
| **INP** | “Add to cart” runs a ~700ms synchronous busy-loop on the main thread | Same work offloaded to a **Web Worker**; the handler returns instantly |

## Pros, cons, and pitfalls avoided

See [`docs/pros-cons-pitfalls.md`](docs/pros-cons-pitfalls.md). In short:

- **Pros** — measures real UX, catches regressions, shared vocabulary, drives better image/JS/font/layout decisions.
- **Cons** — lab ≠ field, device/network variance, third-party distortion, score-chasing.
- **Pitfalls avoided** — unoptimized heroes, silent layout shift, main-thread blocking, performance as a last-step task, bundle-size tunnel vision.

## Production checklist

- [ ] Hero image is properly sized, modern format (WebP/AVIF), with `width`/`height`, and `fetchPriority="high"` for the LCP element.
- [ ] No content injected above existing elements after first paint; reserve space for late content.
- [ ] Every `<img>`/`<iframe>`/ad slot has reserved dimensions or `aspect-ratio`.
- [ ] Fonts use `font-display: swap` (or optional) with a matching metric fallback; no late font swaps.
- [ ] No long synchronous tasks on the main thread during interaction — offload to a worker or chunk with `scheduler.yield()`/`setTimeout`.
- [ ] LCP / CLS / INP measured (e.g. via Lighthouse) and tracked on the **optimized** experience.
- [ ] Field data (CrUX / RUM) tracked alongside lab scores.
- [ ] Third-party scripts audited and lazy-loaded where possible.

---

## Tech stack

React 19 · TypeScript · Vite · pnpm · React Router · Vitest · plain CSS · `sharp` (image
generation). Core Web Vitals are measured with **Lighthouse via Chrome DevTools** (Mobile
preset).

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — folder map, data flow, metrics lifecycle, SPA caveat.
- [`docs/before-after.md`](docs/before-after.md) — full bad-vs-optimized comparison table.

## License

MIT © Davi Araki.

---

## 🔗 LinkedIn post

> **[TODO: add the LinkedIn post link here]**
