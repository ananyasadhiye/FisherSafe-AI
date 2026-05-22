import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useStore } from "@/lib/fishersafe-store";
import { TOWNS, ZONES_DATA, assess, windDir, moonPhase } from "@/lib/fishersafe-data";
import { Card, Stat, StatGrid, SafetyCard, AIBox, PrimaryButton, Spinner } from "@/components/fs/UI";
import { Ticker } from "@/components/fs/Ticker";
import { Hero } from "@/components/fs/Hero";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const { town, weather, weatherLoading } = useStore();
  const [lat, lon] = TOWNS[town];
  const moon = moonPhase();
  const c = weather?.current;
  const s = c ? assess(c.windspeed_10m, c.precipitation, c.weathercode, c.visibility ?? 10000) : "safe";
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const ai = useServerFn(askAI);

  async function genBrief() {
    setBusy(true);
    const ctx = c ? `Wind ${c.windspeed_10m.toFixed(0)}km/h, Temp ${c.temperature_2m.toFixed(0)}°C, Safety:${s.toUpperCase()}, Moon:${moon.name}` : "";
    const { reply } = await ai({ data: {
      prompt: `Morning safety briefing for fisherman near ${town}. ${ctx}. 4-5 sentences. Mix Kannada naturally. Practical tips.`,
      system: "You are FisherSafe AI, a warm Karnataka maritime expert.",
      maxTokens: 350,
    }});
    setBrief(reply); setBusy(false);
  }

  return (
    <>
      <Hero />

      <div className="mt-20 space-y-6">
        <div className="flex items-end justify-between mb-2 gap-4 flex-wrap">
          <div>
            <div className="fs-eyebrow mb-3">Live dashboard</div>
            <h2 className="fs-section-title">
              Today on the <span className="fs-hero-grad">water</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[.72rem]" style={{ color: "var(--lt)" }}>
            <span className="fs-dlive" />
            <span className="font-mono-brand uppercase tracking-wider">Streaming · auto-refresh 30s</span>
          </div>
        </div>

        <SafetyCard s={s} />
        <Ticker />

        {weatherLoading && <Card>Loading sea conditions…</Card>}
        {c && (
          <Card title={<>Live sea conditions</>} tag="LIVE">
            <StatGrid>
              <Stat label="Wind" value={c.windspeed_10m.toFixed(0)} unit={` km/h ${windDir(c.winddirection_10m)}`} icon="💨" color="oklch(0.55 0.14 220)" delay={0} />
              <Stat label="Temperature" value={c.temperature_2m.toFixed(0)} unit=" °C" icon="🌡️" color="var(--coral)" delay={80} />
              <Stat label="Humidity" value={(c.relative_humidity_2m ?? 60).toFixed(0)} unit="%" icon="💧" color="var(--sea-2)" delay={160} />
              <Stat label="Clouds" value={(c.cloudcover ?? 30).toFixed(0)} unit="%" icon="☁️" color="var(--lt)" delay={240} />
              <Stat label="Moon" value={moon.name} icon="🌕" color="var(--amber-brand)" delay={320} />
              <Stat label="Visibility" value={((c.visibility ?? 10000) / 1000).toFixed(1)} unit=" km" icon="🌊" color="var(--sea)" delay={400} />
            </StatGrid>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <Card title={<>Live GPS tracker</>} tag="LIVE">
            <div className="fs-gps">
              <div className="text-xs mb-3 opacity-60 tracking-widest">GPS LIVE · KAR-{1000 + Math.floor(lat * 10)}</div>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {[
                  ["Latitude", `${lat.toFixed(4)}°N`],
                  ["Longitude", `${lon.toFixed(4)}°E`],
                  ["Speed", "7.4 km/h"],
                  ["Heading", "NW 315°"],
                  ["Depth", "18 m"],
                  ["Updated", now],
                ].map(([l, v]) => (
                  <div key={l}><div className="text-[.6rem] opacity-60 uppercase tracking-wider">{l}</div><div className="text-base font-bold">{v}</div></div>
                ))}
              </div>
            </div>
          </Card>
          <Card title={<>Cyclone & alert feed</>} tag="IMD" tagKind="n">
            <div className="rounded-2xl p-4 mb-3" style={{ background: "oklch(0.62 0.09 155 / .1)", border: "1px solid oklch(0.62 0.09 155 / .25)" }}>
              <strong style={{ color: "var(--sage)" }}>✅ No cyclone warnings</strong>
              <div className="text-xs opacity-70 mt-1">IMD bulletin · Next update 18:00 IST</div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "oklch(0.78 0.13 75 / .1)", border: "1px solid oklch(0.78 0.13 75 / .25)" }}>
              <strong style={{ color: "oklch(0.50 0.14 75)" }}>⚠️ Low pressure</strong> forming in Bay of Bengal.
              <div className="text-xs opacity-70 mt-1">Possible impact 5–7 days</div>
            </div>
          </Card>
        </div>

        <Card title={<>Top fishing zones today</>}>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {ZONES_DATA.map((z, i) => {
              const icon = z.level === "hot" ? "🔥" : z.level === "warm" ? "⚡" : "💧";
              return (
                <div key={z.name} className={`fs-zone fs-zone-${z.level}`} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="font-semibold text-base flex items-center gap-2">{icon} {z.name}</div>
                  <div className="text-xs mt-1.5 opacity-80">🐟 {z.fish.join(", ")}</div>
                  <div className="text-xs mt-3">🌡️ SST: <span className="font-semibold">{z.sst}°C</span></div>
                  <div className="fs-bar-track mt-2"><div className={`fs-bar-fill fs-bar-${z.level}`} style={{ width: `${z.pct}%` }} /></div>
                  <div className="text-[.65rem] opacity-70 mt-1.5 font-mono-brand">Yield: {z.pct}%</div>
                </div>
              );
            })}
          </div>
        </Card>

        <section className="fs-briefing-dark">
          <span className="fs-briefing-badge">Auto</span>
          <h3 className="fs-briefing-title">AI daily briefing</h3>
          <p className="fs-briefing-sub">
            Personalised morning safety report — tides, wind, mandi prices, and safe sailing windows.
            Available in Kannada, Telugu, Hindi and English.
          </p>
          <div className="fs-briefing-langs">
            <span className="fs-briefing-lang">ಕನ್ನಡ</span>
            <span className="fs-briefing-lang">తెలుగు</span>
            <span className="fs-briefing-lang">हिन्दी</span>
            <span className="fs-briefing-lang">English</span>
          </div>
          <button type="button" onClick={genBrief} disabled={busy} className="fs-briefing-cta">
            {busy ? <><Spinner /> &nbsp;Generating your briefing…</> : "Generate briefing"}
          </button>
          {brief && <div className="fs-briefing-ai-box">{brief}</div>}
        </section>
      </div>
    </>
  );
}
