import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useStore } from "@/lib/fishersafe-store";
import { assess, windDir, WMO_EMOJI } from "@/lib/fishersafe-data";
import { Card, Stat, StatGrid, SafetyCard, AIBox, PrimaryButton, Spinner } from "@/components/fs/UI";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/weather")({
  component: WeatherPage,
  head: () => ({ meta: [{ title: "Weather · FisherSafe AI" }] }),
});

function WeatherPage() {
  const { town, weather } = useStore();
  const c = weather?.current;
  const s = c ? assess(c.windspeed_10m, c.precipitation, c.weathercode, c.visibility ?? 10000) : "safe";
  const days = weather?.daily;
  const [adv, setAdv] = useState(""); const [busy, setBusy] = useState(false);
  const ai = useServerFn(askAI);

  async function getAdv() {
    setBusy(true);
    const ctx = c ? `Wind ${c.windspeed_10m.toFixed(0)}km/h, Temp ${c.temperature_2m.toFixed(0)}°C` : "";
    const { reply } = await ai({ data: {
      prompt: `Weather advice for fisherman in ${town}. ${ctx}. Recommend if/when to sail today. 4 sentences. Mix Kannada.`,
      system: "You are a Karnataka coastal weather expert.", maxTokens: 320,
    }});
    setAdv(reply); setBusy(false);
  }

  return (
    <div className="space-y-4">
      {c && <><SafetyCard s={s} />
      <Card title={<>🌤️ Current Conditions · {town}</>}>
        <StatGrid>
          <Stat label="💨 Wind" value={c.windspeed_10m.toFixed(0)} unit={` km/h ${windDir(c.winddirection_10m)}`} color="oklch(0.45 0.15 245)" delay={0} />
          <Stat label="🌡️ Temp" value={c.temperature_2m.toFixed(0)} unit=" °C" color="var(--coral)" delay={80} />
          <Stat label="🌧️ Rain" value={(c.precipitation ?? 0).toFixed(1)} unit=" mm" color="var(--sea-2)" delay={160} />
          <Stat label="👁️ Visibility" value={((c.visibility ?? 10000)/1000).toFixed(1)} unit=" km" color="var(--sea)" delay={240} />
        </StatGrid>
      </Card></>}

      {days && (
        <Card title={<>📅 7-Day Forecast</>}>
          <div className="flex gap-3 overflow-x-auto pb-2 fs-scroll">
            {days.time.slice(0,7).map((date, i) => {
              const dn = new Date(date).toLocaleDateString("en-IN", { weekday: "short" });
              const em = WMO_EMOJI[days.weathercode[i]] ?? "☀️";
              return (
                <div key={date} className="flex-shrink-0 min-w-[100px] text-center p-4 rounded-2xl border bg-card animate-card-in transition-all hover:-translate-y-2"
                  style={{ borderColor: "var(--border)", animationDelay: `${i*60}ms`, ...(i===0 && { background: "linear-gradient(160deg, oklch(0.92 0.07 175), oklch(0.86 0.1 170))", borderColor: "var(--sea-2)" }) }}>
                  <div className="text-xs opacity-70 font-mono-brand">{dn}</div>
                  <div className="text-3xl my-1">{em}</div>
                  <div className="text-sm font-bold">{days.temperature_2m_max[i].toFixed(0)}°/{days.temperature_2m_min[i].toFixed(0)}°</div>
                  <div className="text-xs opacity-70 mt-1">💨{days.windspeed_10m_max[i].toFixed(0)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card title={<>🤖 AI Weather Advisor</>}>
        <PrimaryButton onClick={getAdv} disabled={busy}>{busy ? <><Spinner /> Analysing…</> : "🌤️ Get Personalised Weather Advice"}</PrimaryButton>
        {adv && <div className="mt-3"><AIBox>{adv}</AIBox></div>}
      </Card>
    </div>
  );
}
