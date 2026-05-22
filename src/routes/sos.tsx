import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/fishersafe-store";
import { TOWNS } from "@/lib/fishersafe-data";
import { Card, Row, PrimaryButton, GhostButton } from "@/components/fs/UI";

export const Route = createFileRoute("/sos")({
  component: SOSPage,
  head: () => ({ meta: [{ title: "SOS · FisherSafe AI" }] }),
});

function SOSPage() {
  const { town, sosSent, setSosSent } = useStore();
  const [lat, lon] = TOWNS[town];
  const contacts: [string, string][] = [
    ["🚑 Ambulance", "108"],
    ["⛵ Coast Guard", "1554"],
    ["👮 Police", "100"],
    ["🐟 Fisheries Dept (KA)", "0824-2424285"],
  ];
  const waSos = `https://wa.me/?text=${encodeURIComponent(`🚨 SOS - ${town} - Location: ${lat.toFixed(4)},${lon.toFixed(4)} - Time: ${new Date().toLocaleTimeString("en-IN")}`)}`;

  return (
    <div className="space-y-4">
      <Card className="text-center fs-safety fs-safety-danger">
        <div className="text-6xl animate-blink">🚨</div>
        <div className="font-display text-3xl font-black mt-2" style={{ color: "oklch(0.34 0.16 35)" }}>EMERGENCY SOS</div>
        <div className="opacity-80 mt-1 text-sm">ತುರ್ತು ಸಹಾಯ · Tap below to alert Coast Guard & family</div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <PrimaryButton full onClick={() => setSosSent(true)}>🚨 SEND SOS ALERT</PrimaryButton>
        <GhostButton full onClick={() => setSosSent(false)}>✅ Cancel / Resolved</GhostButton>
      </div>

      {sosSent && (
        <Card className="text-center">
          <div className="text-base font-bold animate-blink" style={{ color: "var(--coral-2)" }}>🚨 SOS BROADCASTING…</div>
          <div className="text-xs opacity-70 mt-2">Location: {lat.toFixed(4)}°N, {lon.toFixed(4)}°E · Time: {new Date().toLocaleTimeString("en-IN")}</div>
        </Card>
      )}

      <Card title={<>📞 Emergency Contacts</>}>
        {contacts.map(([name, num]) => (
          <Row key={num}>
            <span className="font-semibold text-sm">{name}</span>
            <a href={`tel:${num}`} className="font-mono-brand font-bold no-underline" style={{ color: "var(--sea)" }}>{num} 📞</a>
          </Row>
        ))}
        <div className="text-center font-mono-brand text-2xl font-black mt-4" style={{ color: "var(--sea)" }}>{lat.toFixed(4)}°N · {lon.toFixed(4)}°E</div>
        <div className="text-center text-xs opacity-70">📍 Your live GPS position</div>
      </Card>

      <Card title={<>📲 WhatsApp SOS</>}>
        <p className="text-xs opacity-70 mb-3">Send GPS + SOS to family/Coast Guard.</p>
        <a className="fs-wabtn" href={waSos} target="_blank" rel="noopener noreferrer">📱 Send SOS via WhatsApp</a>
      </Card>
    </div>
  );
}
