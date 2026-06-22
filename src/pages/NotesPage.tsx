import { Link } from 'react-router';

const CHANGES: readonly { readonly problem: string; readonly bad: string; readonly optimized: string }[] = [
  {
    problem: 'Hero image',
    bad: 'Huge unoptimized JPEG, lazy-loaded, no dimensions, shown after a 1.6s artificial delay.',
    optimized: 'Sized WebP, eager + fetchPriority="high", dimensions reserved, no delay.',
  },
  {
    problem: 'Layout stability',
    bad: 'Late banner injected above content; unsized images and avatars; late font swap.',
    optimized: 'Banner space reserved up front; explicit width/height everywhere; stable typography.',
  },
  {
    problem: 'Interaction responsiveness',
    bad: 'Add-to-cart runs a 700ms synchronous busy-loop on the main thread.',
    optimized: 'Same calculation offloaded to a Web Worker; the main thread stays free.',
  },
];

const PROS: readonly string[] = [
  'Measures user experience instead of relying only on developer intuition.',
  'Helps catch performance regressions before they ship.',
  'Gives shared vocabulary to engineering, design, SEO, and product.',
  'Encourages better decisions around images, JavaScript, fonts, and layout stability.',
];

const CONS: readonly string[] = [
  'Lab scores are not the same as field data.',
  'Scores vary by device and network.',
  'Third-party scripts can distort results.',
  'Teams can over-optimize scores instead of actual user journeys.',
];

const PITFALLS: readonly string[] = [
  'Shipping unoptimized hero images.',
  'Letting layout shift happen silently.',
  'Blocking the main thread during interactions.',
  'Treating performance as an end-of-project task.',
  'Optimizing only bundle size while ignoring user-perceived speed.',
];

export function NotesPage() {
  return (
    <main className="page page--notes">
      <header className="notes-head">
        <span className="eyebrow">Notes</span>
        <h1>Core Web Vitals, explained</h1>
      </header>

      <section className="prose">
        <h2>What are Core Web Vitals?</h2>
        <p>
          Core Web Vitals (CWV) are a small set of real-user experience metrics Google uses to
          evaluate page quality. They focus on three questions every user implicitly asks:
        </p>
        <ul>
          <li><strong>“Is it loaded?”</strong> — LCP (Largest Contentful Paint).</li>
          <li><strong>“Does it respond to me?”</strong> — INP (Interaction to Next Paint).</li>
          <li><strong>“Is it stable?”</strong> — CLS (Cumulative Layout Shift).</li>
        </ul>
        <p>
          FCP (First Contentful Paint) and TTFB (Time to First Byte) are tracked as supporting
          diagnostics. The primary focus of this lab is LCP, INP and CLS.
        </p>
      </section>

      <section className="prose">
        <h2>What changed between /bad and /optimized</h2>
        <div className="notes-changes">
          {CHANGES.map((c) => (
            <article key={c.problem} className="change-card">
              <h3>{c.problem}</h3>
              <p><span className="change-card__label change-card__label--bad">Bad</span> {c.bad}</p>
              <p><span className="change-card__label change-card__label--ok">Optimized</span> {c.optimized}</p>
            </article>
          ))}
        </div>
      </section>

      <NoteBlock id="pros" title="Pros of using Core Web Vitals as a pattern" items={PROS} tone="ok" />
      <NoteBlock id="cons" title="Cons and limitations" items={CONS} tone="warn" />
      <NoteBlock id="pitfalls" title="Pitfalls avoided in this lab" items={PITFALLS} tone="ok" />

      <section className="prose">
        <h2>How to measure with Lighthouse in DevTools</h2>
        <p>
          This lab measures Core Web Vitals the way you would in a real project — with Lighthouse,
          not an in-app widget.
        </p>
        <ol>
          <li>Run the app (<code>pnpm dev</code>) and open <code>/optimized</code>.</li>
          <li>Open Chrome DevTools → <strong>Lighthouse</strong> tab.</li>
          <li>
            Pick <strong>Mobile</strong> + the <em>Performance</em> category, then click
            <strong> Analyze page load</strong>. Mobile throttling (Slow 4G + slowed CPU) is what makes
            the contrast between the two routes obvious.
          </li>
          <li>Note LCP, CLS (and TBT, the lab proxy for INP).</li>
          <li>Repeat on <code>/bad</code> and compare.</li>
        </ol>
        <p>
          To see the INP problem directly: on <Link to="/bad">/bad</Link>, open the
          <strong> Performance</strong> panel, start a recording, click “Add to cart”, and stop. You’ll
          see a long blocking task on the main thread. On <Link to="/optimized">/optimized</Link> the
          same work runs in a Web Worker, so the main thread stays free.
        </p>
      </section>

      <section className="prose">
        <h2>When <em>not</em> to obsess over scores</h2>
        <ul>
          <li>When a metric improvement doesn’t change the actual user journey.</li>
          <li>When you optimize for the lab at the expense of real field data.</li>
          <li>When chasing a green score forces premature abstraction or hacky code.</li>
          <li>When the business outcome (conversion, retention) isn’t moving.</li>
        </ul>
        <p>
          See <Link to="/bad">/bad</Link> and <Link to="/optimized">/optimized</Link> side by side, and
          measure each with Lighthouse in DevTools.
        </p>
      </section>
    </main>
  );
}

function NoteBlock({
  id,
  title,
  items,
  tone,
}: {
  id: string;
  title: string;
  items: readonly string[];
  tone: 'ok' | 'warn';
}) {
  return (
    <section className={`prose prose--${tone}`} id={id}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
