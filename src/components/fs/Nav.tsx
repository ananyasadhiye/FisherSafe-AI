import { Link, useLocation } from "@tanstack/react-router";
import { SECTIONS } from "@/lib/fishersafe-data";

export function Nav() {
  const { pathname } = useLocation();
  // Group nav: primary visible, others scrollable
  const primary = SECTIONS.filter(s => !["/sos", "/ai"].includes(s.path));

  return (
    <nav className="fs-topnav max-w-[1240px]">
      <Link to="/" className="fs-logo">
        <span className="fs-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18M3 12h18" />
          </svg>
        </span>
        FisherSafe<em>AI</em>
      </Link>

      <div className="fs-nav-links">
        {primary.map(s => {
          const active = pathname === s.path;
          return (
            <Link key={s.path} to={s.path} className={`fs-nav-link ${active ? "active" : ""}`}>
              {s.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Link to="/sos" className="fs-nav-sos">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
          </svg>
          SOS
        </Link>
        <Link to="/ai" className="fs-cta">
          Open Assistant
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </nav>
  );
}
