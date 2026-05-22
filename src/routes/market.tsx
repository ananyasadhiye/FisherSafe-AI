import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FISH_PRICES, PM } from "@/lib/fishersafe-data";
import { useStore } from "@/lib/fishersafe-store";
import { Card, Row, Stat, StatGrid, AIBox, PrimaryButton, Spinner } from "@/components/fs/UI";
import { Ticker } from "@/components/fs/Ticker";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/market")({
  component: MarketPage,
  head: () => ({ meta: [{ title: "Market · FisherSafe AI" }] }),
});

function MarketPage() {
  const { town, catchLog, addCatch, weather } = useStore();
  const c = weather?.current;
  const [calcFish, setCalcFish] = useState(FISH_PRICES[0].n);
  const [calcKg, setCalcKg] = useState(20);
  const [fn, setFn] = useState(""); const [fk, setFk] = useState(5);
  const [pred, setPred] = useState(""); const [busy, setBusy] = useState(false);
  const ai = useServerFn(askAI);

  const ppk = PM[calcFish] ?? 200;
  const gross = calcKg * ppk;
  const fuel = Math.max(50, calcKg * 8);
  const net = gross - fuel;

  const tk = catchLog.reduce((a, e) => a + e.kg, 0);
  const tr = catchLog.reduce((a, e) => a + e.kg * (PM[e.fish] ?? 200), 0);

  async function getPred() {
    setBusy(true);
    const { reply } = await ai({ data: {
      prompt: `Market prediction for ${calcFish} near ${town}. Current ₹${ppk}/kg. Sell today or wait? 3-4 sentences. Include Kannada.`,
      system: "You are a Karnataka fish market expert.", maxTokens: 280,
    }});
    setPred(reply); setBusy(false);
  }

  const waMsg = useMemo(() => `🐟 FisherSafe AI - ${town}\n💨 Wind: ${c?.windspeed_10m?.toFixed(0) ?? "—"}km/h\n🌡️ Temp: ${c?.temperature_2m?.toFixed(0) ?? "—"}°C\nಸುರಕ್ಷಿತವಾಗಿರಿ 🙏`, [town, c]);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="space-y-4">
      <Ticker />
      <Card title={<>💰 Today's Fish Prices</>} tag="LIVE">
        {FISH_PRICES.map(f => {
          const up = f.t === "up", dn = f.t === "down";
          const tc = up ? "var(--sea)" : dn ? "var(--coral-2)" : "var(--lt)";
          const ti = up ? "▲" : dn ? "▼" : "—";
          return (
            <Row key={f.n}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{f.e}</span>
                <div>
                  <div className="font-semibold text-sm">{f.n}</div>
                  {f.kn && <div className="text-xs opacity-70">{f.kn}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: tc }}>{ti}</span>
                <span className="font-mono-brand font-bold">₹{f.p}</span>
                <span className="text-xs opacity-70">/kg</span>
              </div>
            </Row>
          );
        })}
      </Card>

      <Card title={<>🧮 Catch Earnings Calculator</>}>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs opacity-70 block mb-1">Fish species</span>
            <select value={calcFish} onChange={e=>setCalcFish(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }}>
              {FISH_PRICES.map(f => <option key={f.n} value={f.n}>{f.n}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs opacity-70 block mb-1">Weight (kg)</span>
            <input type="number" min={0.5} step={0.5} value={calcKg} onChange={e=>setCalcKg(parseFloat(e.target.value)||0)} className="w-full px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }} />
          </label>
        </div>
        <div className="text-center rounded-2xl p-5 mt-4" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--sea-2) 12%, transparent), color-mix(in oklch, var(--foam) 30%, transparent))" }}>
          <div className="font-display text-4xl font-black" style={{ color: "var(--sea)" }}>₹{gross.toLocaleString()}</div>
          <div className="text-xs opacity-70">Gross · {calcKg}kg × ₹{ppk}/kg</div>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <span style={{ color: "var(--coral-2)" }}>⛽ Fuel: ₹{fuel.toLocaleString()}</span>
            <span className="font-bold" style={{ color: "var(--sea)" }}>✅ Net: ₹{net.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={getPred} disabled={busy}>{busy ? <><Spinner /> Analysing market…</> : "📊 Get AI Price Prediction"}</PrimaryButton>
        </div>
        {pred && <div className="mt-3"><AIBox>{pred}</AIBox></div>}
      </Card>

      <Card title={<>📋 Catch Log</>}>
        <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2 mb-3">
          <input placeholder="Fish name" value={fn} onChange={e=>setFn(e.target.value)} className="px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }} />
          <input type="number" placeholder="Weight (kg)" min={0.1} step={0.5} value={fk} onChange={e=>setFk(parseFloat(e.target.value)||0)} className="px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }} />
          <PrimaryButton onClick={()=>{ if(fn.trim()){ addCatch({ fish: fn, kg: fk, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), zone: "Oyster Rock Shoal" }); setFn(""); } }}>➕ Add</PrimaryButton>
        </div>
        <StatGrid>
          <Stat label="📦 Total" value={tk.toFixed(1)} unit=" kg" color="var(--sea)" delay={0} />
          <Stat label="💰 Revenue" value={`₹${tr.toLocaleString()}`} color="var(--amber-brand)" delay={80} />
          <Stat label="🐟 Trips" value={catchLog.length.toString()} color="var(--coral)" delay={160} />
        </StatGrid>
        <div className="mt-3">
          {catchLog.slice(0,8).map((e,i) => (
            <Row key={i}>
              <div>
                <span className="font-semibold">🐟 {e.fish}</span>
                <span className="text-xs opacity-70 ml-2">{e.date} · {e.zone}</span>
              </div>
              <div className="text-right">
                <span className="font-mono-brand font-bold" style={{ color: "var(--sea)" }}>{e.kg}kg</span>
                <span className="text-xs opacity-70 block">≈₹{(e.kg * (PM[e.fish] ?? 200)).toLocaleString()}</span>
              </div>
            </Row>
          ))}
        </div>
      </Card>

      <Card title={<>📲 Share Safety Status on WhatsApp</>}>
        <a className="fs-wabtn" href={waUrl} target="_blank" rel="noopener noreferrer">📱 Share on WhatsApp — ಕಳಿಸಿ</a>
      </Card>
    </div>
  );
}
