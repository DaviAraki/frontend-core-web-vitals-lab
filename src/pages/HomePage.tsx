import { Link } from 'react-router';

interface DemoCard {
  readonly to: string;
  readonly title: string;
  readonly tone: 'bad' | 'optimized';
  readonly blurb: string;
}

const DEMOS: readonly DemoCard[] = [
  {
    to: '/bad',
    title: '/bad',
    tone: 'bad',
    blurb: 'The same page, intentionally broken: huge image, layout shift, janky interactions.',
  },
  {
    to: '/optimized',
    title: '/optimized',
    tone: 'optimized',
    blurb: 'The fixes: sized image, stable layout, main-thread offloading. Same UI, better vitals.',
  },
];

interface Vital {
  readonly name: string;
  readonly good: string;
  readonly measures: string;
}

const VITALS: readonly Vital[] = [
  { name: 'LCP', good: '≤ 2500 ms', measures: 'Loading' },
  { name: 'INP', good: '≤ 200 ms', measures: 'Responsiveness' },
  { name: 'CLS', good: '≤ 0.1', measures: 'Visual stability' },
];

export function HomePage() {
  return (
    <main className="page page--home">
      <section className="hero hero--home">
        <div className="hero__content">
          <span className="eyebrow">Frontend performance lab</span>
          <h1>Core Web Vitals, made tangible</h1>
          <p className="hero__lede">
            The same product page, rendered twice. One is deliberately slow; the other applies the
            fixes. Open both, then run Lighthouse from Chrome DevTools to see the difference.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/bad">
              See the bad version
            </Link>
            <Link className="btn btn--ghost" to="/optimized">
              See the optimized version
            </Link>
          </div>
        </div>
      </section>

      <section className="home-demos">
        {DEMOS.map((demo) => (
          <Link key={demo.to} to={demo.to} className={`demo-card demo-card--${demo.tone}`}>
            <span className={`demo-card__tag demo-card__tag--${demo.tone}`}>
              {demo.tone === 'bad' ? '⚠ Warning' : '✓ Optimized'}
            </span>
            <h3>{demo.title}</h3>
            <p>{demo.blurb}</p>
            <span className="demo-card__cta">Open →</span>
          </Link>
        ))}
      </section>

      <section className="home-explainer">
        <h2>What are Core Web Vitals?</h2>
        <p>
          Core Web Vitals are Google’s user-experience signals for the web. This lab focuses on the
          three core metrics:
        </p>
        <ul className="metric-legend">
          {VITALS.map((v) => (
            <li key={v.name} className="metric-legend__item metric-legend__item--core">
              <strong>{v.name}</strong>
              <span>
                {v.measures} · good {v.good}
              </span>
            </li>
          ))}
        </ul>
        <p className="home-explainer__more">
          How to measure them? Use{' '}
          <strong>Chrome DevTools → Lighthouse</strong> (or the Performance panel) against each route.
          See the <Link to="/notes">notes</Link> for the full story.
        </p>
      </section>
    </main>
  );
}
