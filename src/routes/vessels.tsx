import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VESSELS_DATA, TOWNS, type VesselStatus } from "@/lib/fishersafe-data";
import { useStore } from "@/lib/fishersafe-store";
import { Card, Row } from "@/components/fs/UI";

export const Route = createFileRoute("/vessels")({
  component: VesselsPage,
  head: () => ({ meta: [{ title: "Vessels · FisherSafe AI" }] }),
});

function VesselRows({ list }: { list: typeof VESSELS_DATA }) {
  return <>
    {list.map(v => {
      const spd = v.s === "active" ? `${v.spd} km/h ${v.dir}` : "Stationary";
      const sCol = v.s === "active" ? "var(--sea)" : v.s === "anchored" ? "var(--amber-brand)" : "var(--lt)";
      return (
        <Row key={v.id}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${v.s === "active" ? "animate-boat-rock" : ""}`}>{v.e}</span>
            <div>
              <div className="font-semibold text-sm">{v.n} <span className="text-xs opacity-60 font-mono-brand">{v.id}</span></div>
              <div className="text-xs opacity-70">{v.t} · {spd}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono-brand font-bold" style={{ color: "var(--sea)" }}>{v.d}km</div>
            <span className="text-[.65rem] font-bold tracking-wider" style={{ color: sCol }}>{v.s.toUpperCase()}</span>
          </div>
        </Row>
      );
    })}
  </>;
}

function VesselsPage() {
  const { town } = useStore();
  const [lat, lon] = TOWNS[town];
  const [filt, setFilt] = useState<"All" | VesselStatus>("All");
  const fv = filt === "All" ? VESSELS_DATA : VESSELS_DATA.filter(v => v.s === filt);
  const ac = VESSELS_DATA.filter(v => v.s === "active").length;

  return (
    <div className="space-y-4">
      <Card title={<>📡 Live GPS Tracker</>} tag="LIVE">
        <div className="fs-gps relative">
          <div className="text-xs mb-3 opacity-60 tracking-widest">📡 GPS LIVE · KAR-{1000 + Math.floor(lat * 10)}</div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {[
              ["Latitude", `${lat.toFixed(4)}°N`],["Longitude", `${lon.toFixed(4)}°E`],
              ["Speed", "7.4 km/h"],["Heading", "NW 315°"],
              ["Depth", "18 m"],["Updated", new Date().toLocaleTimeString("en-IN", { hour12: false })],
            ].map(([l, v]) => <div key={l}><div className="text-[.6rem] opacity-60 uppercase tracking-wider">{l}</div><div className="text-base font-bold">{v}</div></div>)}
          </div>
        </div>
      </Card>

      <Card title={<>⛵ Nearby Vessels — {VESSELS_DATA.length} Detected</>} tag="LIVE">
        <div className="text-xs opacity-70 mb-3 flex items-center gap-2"><span className="fs-dlive" /> {ac} at sea · Updated {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
        <VesselRows list={VESSELS_DATA} />
      </Card>

      <Card title={<>🔍 Filter Vessels</>}>
        <select value={filt} onChange={e=>setFilt(e.target.value as any)} className="w-full md:w-64 px-3 py-2 rounded-lg border bg-card mb-3" style={{ borderColor: "var(--border)" }}>
          {["All","active","anchored","docked"].map(o => <option key={o}>{o}</option>)}
        </select>
        {fv.length ? <VesselRows list={fv} /> : <div className="opacity-70 text-sm">No vessels match.</div>}
      </Card>
    </div>
  );
}
