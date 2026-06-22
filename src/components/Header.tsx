import { NavLink } from 'react-router';

interface NavItem {
  readonly to: string;
  readonly label: string;
}

const NAV: readonly NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/notes', label: 'Notes' },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden="true">⚡</span>
          <span>CWV&nbsp;Lab</span>
        </NavLink>
        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
