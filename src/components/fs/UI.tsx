import { type ReactNode } from "react";

type Sentiment = "safe" | "caution" | "danger";

export function Card({ title, tag, tagKind = "live", children, className = "" }: {
  title?: ReactNode; tag?: string; tagKind?: "live"|"hot"|"n"; children: ReactNode; className?: string;
}) {
  return (
    <div className={`fs-card ${className}`}>
      {title && (
        <div className="fs-ct">
          <span className="flex items-center gap-2">{title}</span>
          {tag && <span className={`fs-tag fs-tag-${tagKind}`}>{tag}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({ label, value, unit = "", icon = "", color = "var(--sea)", delay = 0 }: {
  label: string; value: string; unit?: string; icon?: string; color?: string; delay?: number;
}) {
  return (
    <div className="fs-stat" style={{ animationDelay: `${delay}ms` }}>
      <div className="fs-stat-bar" style={{ background: `linear-gradient(90deg, ${color}, color-mix(in oklch, ${color} 40%, transparent))` }} />
      <div className="fs-stat-bg">{icon}</div>
      <div className="fs-stat-lbl">{label}</div>
      <div className="fs-stat-val">{value}<span className="fs-stat-unt">{unit}</span></div>
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>{children}</div>;
}

export function SafetyCard({ s }: { s: Sentiment }) {
  const icons = { safe: "⛵", caution: "⚠️", danger: "🚨" } as const;
  const labels = { safe: "Safe to sail", caution: "Use caution", danger: "Do not sail" } as const;
  const kn = { safe: "ಸಮುದ್ರಕ್ಕೆ ಹೋಗಬಹುದು", caution: "ಎಚ್ಚರಿಕೆಯಿಂದ ಇರಿ", danger: "ಸಮುದ್ರಕ್ಕೆ ಹೋಗಬೇಡಿ" } as const;
  const colors = { safe: "oklch(0.32 0.09 195)", caution: "oklch(0.40 0.13 70)", danger: "oklch(0.38 0.18 35)" } as const;
  return (
    <div className={`fs-safety fs-safety-${s}`}>
      <span className="text-7xl block mb-3 animate-float">{icons[s]}</span>
      <div className="font-display text-4xl md:text-5xl" style={{ color: colors[s], animation: s==="danger" ? "blink .85s ease-in-out infinite" : undefined, letterSpacing: "-.02em" }}>
        {labels[s]}
      </div>
      <div className="text-sm mt-2 opacity-75" style={{ color: "var(--ink-2)" }}>{kn[s]}</div>
    </div>
  );
}

export function AIBox({ children }: { children: ReactNode }) {
  return <div className="fs-ai-box">{children}</div>;
}

export function Chip({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button type="button" className="fs-chip" onClick={onClick}>{children}</button>;
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="fs-row">{children}</div>;
}

export function PrimaryButton({ children, onClick, disabled, full = false }: { children: ReactNode; onClick?: () => void; disabled?: boolean; full?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} fs-cta disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, full = false }: { children: ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} fs-cta fs-cta-ghost`}
    >
      {children}
    </button>
  );
}

export function Spinner() {
  return <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent" style={{ animation: "spin .9s linear infinite" }} />;
}
