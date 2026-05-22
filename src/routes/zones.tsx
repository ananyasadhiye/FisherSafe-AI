import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ZONES_DATA, SEASONAL, moonPhase } from "@/lib/fishersafe-data";
import { useStore } from "@/lib/fishersafe-store";
import { Card, Chip, AIBox, PrimaryButton, Spinner } from "@/components/fs/UI";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/zones")({
  component: ZonesPage,
  head: () => ({ meta: [{ title: "Fish Zones · FisherSafe AI" }] }),
});

function ZonesPage() {
  const { town } = useStore();
  const moon = moonPhase();
  const [strat, setStrat] = useState(""); const [busy, setBusy] = useState(false);
  const ai = useServerFn(askAI);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const icons = { peak:"🔥", good:"✅", low:"📉", ban:"🚫" } as const;
  const cols = { peak:"oklch(0.52 0.18 40)", good:"var(--sage)", low:"var(--lt)", ban:"var(--ink)" } as const;
  const bgs = { peak:"oklch(0.92 0.08 40)", good:"oklch(0.92 0.07 175)", low:"oklch(0.93 0.01 220)", ban:"oklch(0.85 0.02 230)" } as const;

  async function getStrat() {
    setBusy(true);
    const { reply } = await ai({ data: {
      prompt: `Fishing strategy for ${town}. Zones:${JSON.stringify(ZONES_DATA.map(z=>[z.name,z.sst]))}. Moon:${moon.name}. 5-6 sentences. Best zone, timing, target species. Mix Kannada.`,
      system: "You are a Karnataka fishing expert.", maxTokens: 400,
    }});
    setStrat(reply); setBusy(false);
  }

  return (
    <div className="space-y-4">
      <Card title={<>🐟 Top Fishing Zones</>} tag="SST DATA" tagKind="n">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {ZONES_DATA.map((z, i) => {
            const icon = z.level === "hot" ? "🔥" : z.level === "warm" ? "⚡" : "💧";
            return (
              <div key={z.name} className={`fs-zone fs-zone-${z.level}`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="font-display font-bold text-base">{icon} {z.name}</div>
                <div className="text-xs mt-1 opacity-80">🐟 {z.fish.join(", ")}</div>
                <div className="text-xs mt-2">🌡️ SST: <span className="font-bold">{z.sst}°C</span></div>
                <div className="fs-bar-track mt-2"><div className={`fs-bar-fill fs-bar-${z.level}`} style={{ width: `${z.pct}%` }} /></div>
                <div className="text-[.65rem] opacity-70 mt-1 font-mono-brand">Yield: {z.pct}%</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title={<>📅 Seasonal Fish Calendar</>}>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }, (_, i) => {
            const m = i + 1; const r = SEASONAL[m].r;
            const isNow = m === new Date().getMonth() + 1;
            return (
              <div key={m} className="rounded-2xl p-2 text-center animate-card-in"
                style={{ background: bgs[r], color: cols[r], animationDelay: `${m*30}ms`, boxShadow: isNow ? "0 0 0 3px color-mix(in oklch, var(--sea) 40%, transparent)" : undefined }}>
                <div className="text-xs font-bold">{months[m-1]}</div>
                <div className="text-xl">{icons[r]}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {[["🔥","Peak"],["✅","Good"],["📉","Low"],["🚫","Ban"]].map(([ic,lb]) => <Chip key={lb}>{ic} {lb}</Chip>)}
        </div>
      </Card>

      <Card title={<>🎣 AI Fishing Strategy</>}>
        <PrimaryButton onClick={getStrat} disabled={busy}>{busy ? <><Spinner /> Analysing zones…</> : "🎯 Get AI Strategy"}</PrimaryButton>
        {strat && <div className="mt-3"><AIBox>{strat}</AIBox></div>}
      </Card>
    </div>
  );
}
