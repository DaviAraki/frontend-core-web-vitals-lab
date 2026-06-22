export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          <strong>Core Web Vitals Lab</strong> — an educational demo. The <code>/bad</code> route is
          intentionally slow; do not copy its patterns into production.
        </p>
        <p className="site-footer__meta">
          Built with React, TypeScript, Vite &amp; Lighthouse CI.
        </p>
      </div>
    </footer>
  );
}
