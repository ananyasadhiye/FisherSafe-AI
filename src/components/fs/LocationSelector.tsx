import { useStore } from "@/lib/fishersafe-store";
import { TOWNS } from "@/lib/fishersafe-data";

export function LocationSelector() {
  const { town, setTown } = useStore();
  return (
    <div className="fs-loc">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sea)" }}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <select value={town} onChange={(e) => setTown(e.target.value)}>
        {Object.keys(TOWNS).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}
