import { FISH_PRICES } from "@/lib/fishersafe-data";

export function Ticker() {
  const items = FISH_PRICES.map(f =>
    `${f.e} ${f.n} ₹${f.p}/kg ${f.t === "up" ? "▲" : f.t === "down" ? "▼" : "—"}`
  ).join("   ·   ");
  const doubled = items + "   ·   " + items;
  return (
    <div className="fs-ticker-wrap mb-4">
      <div className="fs-ticker-inner">&nbsp;&nbsp;&nbsp;{doubled}&nbsp;&nbsp;&nbsp;</div>
    </div>
  );
}
