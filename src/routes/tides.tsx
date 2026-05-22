import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/fishersafe-store";
import { TOWNS, genTides, moonPhase } from "@/lib/fishersafe-data";
import { Card, PrimaryButton, GhostButton } from "@/components/fs/UI";

export const Route = createFileRoute("/tides")({
  component: TidesPage,
  head: () => ({ meta: [{ title: "Tides · FisherSafe AI" }] }),
});

function TidesPage() {
  const { town, timer, setTimer } = useStore();
  const [lat] = TOWNS[town];
  const tides = genTides(lat);
  const moon = moonPhase();
  const nowH = new Date().getHours();
  const mx = Math.max(...tides.map(t => t.v)) || 1;
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(id); }, []);

  let timerDisp: { txt: string; sub: string; over: boolean } | null = null;
  if (timer.startMs) {
    const rt = timer.startMs + timer.hrs * 3600_000;
    const rem = rt - Date.now(); const over = rem < 0;
    const rs = Math.floor(Math.abs(rem) / 1000);
    timerDisp = {
      txt: `${String(Math.floor(rs/3600)).padStart(2,"0")}:${String(Math.floor((rs%3600)/60)).padStart(2,"0")}:${String(rs%60).padStart(2,"0")}`,
      sub: over ? "⚠️ Head back NOW! ಈಗಲೇ ಹಿಂದಿರುಗಿ!" : `Return by ${new Date(rt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      over,
    };
  }

  return (
    <div className="space-y-4">
      <Card title={<>🌊 24-Hour Tide Chart · {town}</>}>
        <div className="fs-tide-wrap">
          {tides.map((t, i) => {
            const h = Math.max(8, Math.floor(t.v / mx * 130));
            const isNow = Math.abs(t.h - nowH) < 2;
            return (
              <div key={i} className="fs-tide-col">
                <div className={`fs-tide-bar ${isNow ? "now" : ""}`} style={{ height: `${h}px` }} />
                <div className="fs-tide-lbl">{String(t.h).padStart(2,"0")}:00</div>
              </div>
            );
          })}
        </div>
        <div className="text-xs opacity-70 text-center mt-2">High tide ~{mx.toFixed(1)}m · Now {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })} highlighted</div>
      </Card>

      <Card className="text-center">
        <div className="fs-ct justify-center">🌙 Moon Phase</div>
        <div className="text-7xl animate-float">{moon.icon}</div>
        <div className="font-display text-2xl font-black mt-2">{moon.name}</div>
        <div className="opacity-70 mt-1 text-sm">{moon.tip}</div>
      </Card>

      <Card title={<>⏱️ Return-to-Port Timer</>}>
        <div className="grid md:grid-cols-[2fr_auto_auto] gap-3 items-end">
          <label className="block">
            <span className="text-xs opacity-70 block mb-1">Trip duration: {timer.hrs} hours</span>
            <input type="range" min={1} max={24} value={timer.hrs} onChange={e => setTimer({ ...timer, hrs: parseInt(e.target.value) })} className="w-full accent-primary" />
          </label>
          <PrimaryButton onClick={() => setTimer({ startMs: Date.now(), hrs: timer.hrs })}>▶ Start</PrimaryButton>
          {timer.startMs && <GhostButton onClick={() => setTimer({ ...timer, startMs: null })}>⏹ Stop</GhostButton>}
        </div>
        {timerDisp && (
          <div className="mt-4 text-center">
            <div className="font-display text-5xl font-black" style={{ color: timerDisp.over ? "var(--coral-2)" : "var(--sea)", animation: timerDisp.over ? "blink .8s ease-in-out infinite" : undefined }}>{timerDisp.txt}</div>
            <div className="opacity-70 mt-1">{timerDisp.sub}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
