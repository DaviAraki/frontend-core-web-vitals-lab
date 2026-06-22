# Before / after — bad vs optimized

Side-by-side comparison of every intentional problem on `/bad` and the corresponding
fix on `/optimized`. The “metric affected” column maps each change to the Core Web Vital
it most influences.

| Problem | Bad version | Optimized version | Metric affected | Why it matters |
| --- | --- | --- | --- | --- |
| Hero image | Large unoptimized JPEG (~MBs), `loading="lazy"`, no `width`/`height`, rendered after a 1.6s artificial delay | Sized WebP, `loading="eager"` + `fetchPriority="high"`, explicit `width`/`height`, no delay | **LCP** | The hero is usually the largest element; if it loads slowly, perceived load speed collapses. |
| Promo banner | Injected ~1.2s after load, **above** existing content | Banner slot **reserved** up front (fixed space), painted immediately | **CLS** | Content inserted above existing elements pushes everything down, causing visible jump. |
| Images & avatars | Rendered without `width`/`height`/`aspect-ratio` | Explicit dimensions (or aspect-ratio) everywhere | **CLS** | Without reserved space, the browser reflows when each image decodes. |
| Typography | A late font/style swap changes `line-height`/letter-spacing | Stable typography from first paint | **CLS** | Late font swaps make text reflow vertically. |
| Add to cart | Runs a ~700ms synchronous busy-loop on the main thread | Same computation offloaded to a **Web Worker**; handler returns instantly | **INP** | Long tasks on the main thread delay the next paint after a tap/click. |
| Bundle / boot | No prioritization hints | Eager hero, `decoding="async"`, lean dependencies | **LCP / TTFB** | Less main-thread contention during load means the LCP element paints sooner. |

## Thresholds used for ratings

| Metric | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| LCP | ≤ 2500 ms | ≤ 4000 ms | > 4000 ms |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

FCP and TTFB are collected and displayed as **supporting metrics** (good ≤ 1800 ms /
≤ 800 ms respectively), but the primary focus of this lab is LCP, INP, and CLS.
