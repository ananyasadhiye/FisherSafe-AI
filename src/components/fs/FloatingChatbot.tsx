import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAI } from "@/lib/ai.functions";
import { useStore } from "@/lib/fishersafe-store";

type M = { r: "ai" | "user"; t: string };

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([
    { r: "ai", t: "👋 ನಮಸ್ಕಾರ! I'm FisherSafe AI. Ask me about safety, weather, fish prices, zones — anything! 🐟" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ai = useServerFn(askAI);
  const { town } = useStore();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function send() {
    const txt = input.trim();
    if (!txt || busy) return;
    setInput("");
    setMsgs(p => [...p, { r: "user", t: txt }]);
    setBusy(true);
    try {
      const { reply } = await ai({
        data: {
          prompt: txt,
          system: `You are FisherSafe AI 🐟, warm maritime safety assistant for Karnataka fishermen near ${town}. Reply under 80 words. Mix Kannada naturally. Practical and caring.`,
          maxTokens: 280,
        },
      });
      setMsgs(p => [...p, { r: "ai", t: reply }]);
    } catch {
      setMsgs(p => [...p, { r: "ai", t: "🐟 Network issue — try the AI Console tab!" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fs-cc-panel" role="dialog" aria-label="FisherSafe AI Chat">
          <div className="flex items-center gap-3 px-4 py-3 text-primary-foreground" style={{ background: "var(--gradient-sea)" }}>
            <div className="w-9 h-9 rounded-full grid place-items-center text-lg" style={{ background: "oklch(1 0 0 / .2)" }}>🐟</div>
            <div className="flex-1">
              <div className="font-bold text-sm">FisherSafe AI</div>
              <div className="text-[.7rem] opacity-85">ಮೀನುಗಾರ ಸಹಾಯಕ · Always online</div>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full grid place-items-center text-sm" style={{ background: "oklch(1 0 0 / .18)", color: "white" }} aria-label="Close">✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 fs-scroll" style={{ background: "color-mix(in oklch, var(--sea-3) 18%, var(--card))" }}>
            {msgs.map((m, i) => (
              <div key={i} className={`fs-bub ${m.r === "user" ? "fs-bub-user" : "fs-bub-ai"} max-w-[85%] text-sm`} style={{ alignSelf: m.r === "user" ? "flex-end" : "flex-start" }}>
                {m.t}
              </div>
            ))}
            {busy && <div className="fs-typing"><span /><span /><span /></div>}
          </div>
          <div className="flex gap-2 p-3 border-t bg-card" style={{ borderColor: "var(--border)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything… ಕೇಳಿ"
              className="flex-1 px-3 py-2 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-ring/40"
              style={{ borderColor: "var(--border)" }}
            />
            <button onClick={send} disabled={busy} className="px-4 py-2 rounded-xl text-primary-foreground font-bold text-sm disabled:opacity-50" style={{ background: "var(--gradient-sea)" }}>Send ↑</button>
          </div>
        </div>
      )}
      <button className="fs-cc-btn" onClick={() => setOpen(o => !o)} aria-label="Toggle FisherSafe AI Chat">
        {open ? "✕" : "🐟"}
      </button>
    </>
  );
}
