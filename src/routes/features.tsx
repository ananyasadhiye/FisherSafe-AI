import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/fs/UI";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({ meta: [{ title: "Features · FisherSafe AI" }] }),
});

const FEATS: { section: string; cards: { icon: string; name: string; desc: string; target: string }[] }[] = [
  { section: "HIGH IMPACT — LIVE", cards: [
    { icon:"📡", name:"Live GPS Tracker", desc:"Coordinates, heading, depth, satellite count.", target:"/vessels" },
    { icon:"🎤", name:"Voice Mode",       desc:"Speak Kannada/Hindi/Tamil/English — get TTS reply.", target:"/voice" },
    { icon:"🌀", name:"Cyclone Alerts",   desc:"IMD-style animated cyclone advisory feed.", target:"/weather" },
    { icon:"🌡️", name:"Sea Surface Temp", desc:"SST per zone predicts fish schooling.", target:"/zones" },
    { icon:"📅", name:"Seasonal Calendar",desc:"12-month peak/good/low/ban indicator.", target:"/zones" },
    { icon:"📲", name:"WhatsApp Share",   desc:"One-tap safety status to family.", target:"/market" },
  ]},
  { section: "AI — POWERED BY GROQ", cards: [
    { icon:"🤖", name:"Daily Briefing",    desc:"Personalised morning safety report.", target:"/" },
    { icon:"💬", name:"Boat Radio Chat",   desc:"AI relay on Channel 16 with KAR IDs.", target:"/chat" },
    { icon:"📊", name:"Market Price AI",   desc:"Predicts sell-today-or-wait.", target:"/market" },
    { icon:"🎣", name:"Zone Strategy",     desc:"Best zone + timing + species advice.", target:"/zones" },
    { icon:"🎭", name:"Interview Simulator",desc:"Practice Q&A with AI interviewer.", target:"/ai" },
    { icon:"🔮", name:"Corner Chatbot",    desc:"Floating 🐟 chat — every page, no reload.", target:"" },
  ]},
  { section: "SAFETY & DATA", cards: [
    { icon:"⏱️", name:"Return Timer",  desc:"Countdown with overdue alert.", target:"/tides" },
    { icon:"🌊", name:"Tide Chart",    desc:"24-hour tide with current hour highlight.", target:"/tides" },
    { icon:"📋", name:"Catch Log",     desc:"Auto gross/fuel/net earnings.", target:"/market" },
    { icon:"🚨", name:"SOS Network",   desc:"Community distress + WhatsApp SOS.", target:"/sos" },
    { icon:"⛵", name:"Vessel Tracker",desc:"5 vessels with filter by status.", target:"/vessels" },
    { icon:"🌐", name:"7-Day Forecast",desc:"Wind + temp + icon per day.", target:"/weather" },
  ]},
];

function FeaturesPage() {
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      <Card className="text-center">
        <div className="text-5xl animate-hero-float inline-block mb-2">🚀</div>
        <h2 className="font-display text-2xl font-black">FisherSafe AI — Feature Showcase</h2>
        <p className="opacity-70 text-sm mt-2">Built for Karnataka's 350,000+ fishing community. Every feature live & working.</p>
      </Card>

      {FEATS.map(s => (
        <div key={s.section}>
          <div className="text-xs font-bold tracking-[.14em] opacity-60 font-mono-brand mb-3">{s.section}</div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {s.cards.map((c, i) => (
              <button
                key={c.name}
                onClick={() => c.target && nav({ to: c.target })}
                disabled={!c.target}
                className="fs-card text-left disabled:cursor-default"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <span className="text-3xl block mb-2 animate-float">{c.icon}</span>
                <h4 className="font-display font-bold text-base">{c.name}</h4>
                <p className="text-xs opacity-70 mt-1">{c.desc}</p>
                <span className="fs-tag fs-tag-live mt-3 inline-block">✅ LIVE</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
