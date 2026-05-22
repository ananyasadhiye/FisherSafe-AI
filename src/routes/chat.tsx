import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SOS_COMM } from "@/lib/fishersafe-data";
import { useStore } from "@/lib/fishersafe-store";
import { Card, Row, PrimaryButton, Spinner } from "@/components/fs/UI";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Boat Chat · FisherSafe AI" }] }),
});

function ChatPage() {
  const { town, chatMsgs, addChatMsg } = useStore();
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const ai = useServerFn(askAI);

  async function send() {
    if (!input.trim() || busy) return;
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    addChatMsg({ r: "user", t: input, ts });
    const userMsg = input; setInput(""); setBusy(true);
    const { reply } = await ai({ data: {
      prompt: userMsg,
      system: `You are a radio relay AI for Karnataka fishermen near ${town}. Reply under 60 words. Mix Kannada. Simulate 1-2 nearby boats (KAR-XXXX). Use emoji.`,
      maxTokens: 240,
    }});
    addChatMsg({ r: "ai", t: reply, ts: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) });
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <Card title={<>🚨 Community SOS Alerts</>} tag="LIVE" tagKind="hot" className="border-coral-2/20">
        {SOS_COMM.map((s,i) => (
          <Row key={i}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.status === "active" ? "🚨" : "✅"}</span>
              <div>
                <div className="font-semibold text-sm">{s.id} — {s.msg}</div>
                <div className="text-xs opacity-70">{s.loc} · {s.time}</div>
              </div>
            </div>
            <span className="text-[.65rem] font-bold tracking-wider" style={{ color: s.status === "active" ? "var(--coral-2)" : "var(--sage)" }}>{s.status.toUpperCase()}</span>
          </Row>
        ))}
      </Card>

      <Card title={<>💬 Boat Radio Chat — Channel 16</>}>
        <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto p-2 fs-scroll">
          {chatMsgs.slice(-14).map((m, i) => (
            <div key={i} className={`fs-bub ${m.r === "user" ? "fs-bub-user" : "fs-bub-ai"}`}>
              {m.t}
              <div className="fs-bub-meta" style={{ textAlign: m.r === "user" ? "right" : "left" }}>{m.ts}</div>
            </div>
          ))}
          {busy && <div className="fs-typing"><span /><span /><span /></div>}
        </div>
        <div className="flex gap-2 mt-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type / ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ" className="flex-1 px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }} />
          <PrimaryButton onClick={send} disabled={busy}>{busy ? <Spinner /> : "📡 Send"}</PrimaryButton>
        </div>
        <div className="text-xs opacity-70 mt-2">📡 AI relay · Channel 16 · 20km range</div>
      </Card>
    </div>
  );
}
