import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useStore } from "@/lib/fishersafe-store";
import { assess, moonPhase } from "@/lib/fishersafe-data";
import { Card, AIBox, Chip, PrimaryButton, GhostButton, Spinner } from "@/components/fs/UI";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/ai")({
  component: AIConsole,
  head: () => ({ meta: [{ title: "AI Console · FisherSafe AI" }] }),
});

function AIConsole() {
  const { town, weather, aiHist, setAiHist } = useStore();
  const c = weather?.current;
  const s = c ? assess(c.windspeed_10m, c.precipitation, c.weathercode, c.visibility ?? 10000) : "safe";
  const moon = moonPhase();
  const ctx = c ? `Wind ${c.windspeed_10m.toFixed(0)}km/h, Temp ${c.temperature_2m.toFixed(0)}°C, Safety:${s.toUpperCase()}, Moon:${moon.name}` : "";
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const [ivQ, setIvQ] = useState(""); const [ivAns, setIvAns] = useState(""); const [ivFb, setIvFb] = useState(""); const [ivBusy, setIvBusy] = useState(false);
  const ai = useServerFn(askAI);

  async function send(text?: string) {
    const t = (text ?? input).trim(); if (!t || busy) return;
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    setAiHist(p => [...p, { role: "user", content: t, ts }]);
    setInput(""); setBusy(true);
    const history = aiHist.map(m => ({ role: m.role, content: m.content }));
    const { reply } = await ai({ data: {
      prompt: t,
      system: `You are FisherSafe AI 🐟, warm maritime safety expert for Karnataka fishermen near ${town}. ${ctx}. Mix Kannada. Practical. Under 120 words.`,
      history,
      maxTokens: 450,
    }});
    setAiHist(p => [...p, { role: "assistant", content: reply, ts: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) }]);
    setBusy(false);
  }

  async function startIv() {
    setIvBusy(true); setIvFb("");
    const { reply } = await ai({ data: {
      prompt: "Act as a tech interviewer for FisherSafe AI. Ask 3 numbered questions about impact, technical challenges, scalability. Warm professional tone.",
      system: "You are a product evaluator.", maxTokens: 400,
    }});
    setIvQ(reply); setIvBusy(false);
  }
  async function getFb() {
    if (!ivAns.trim()) return;
    setIvBusy(true);
    const { reply } = await ai({ data: {
      prompt: `Questions:${ivQ.slice(0,200)}\nAnswer:${ivAns}\nGive constructive feedback in 3-4 sentences.`,
      system: "You are a supportive tech interviewer.", maxTokens: 300,
    }});
    setIvFb(reply); setIvBusy(false);
  }

  const suggs = ["Is it safe today?","ಇಂದು ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗಬಹುದೇ?","Best zone now?","Bait for Kingfish?","Cyclone this week?"];

  return (
    <div className="space-y-4">
      <Card title={<>🤖 FisherSafe AI Console</>} tag="MULTI-TURN" tagKind="n">
        <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto p-2 fs-scroll">
          {aiHist.map((m, i) => (
            <div key={i} className={`fs-bub ${m.role === "user" ? "fs-bub-user" : "fs-bub-ai"}`}>
              {m.content}<div className="fs-bub-meta" style={{ textAlign: m.role === "user" ? "right" : "left" }}>{m.ts}</div>
            </div>
          ))}
          {busy && <div className="fs-typing"><span /><span /><span /></div>}
        </div>
        {aiHist.length === 0 && (
          <div className="mt-3">
            <div className="text-xs opacity-70 mb-2">💡 Try:</div>
            {suggs.map(s => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Is it safe today? / ಇಂದು ಮೀನಿಗೆ ಹೋಗಬಹುದೇ?" className="flex-1 px-3 py-2 rounded-lg border bg-card" style={{ borderColor: "var(--border)" }} />
          <PrimaryButton onClick={()=>send()} disabled={busy}>{busy ? <Spinner /> : "🐟 Send"}</PrimaryButton>
          <GhostButton onClick={() => setAiHist([])}>🗑️</GhostButton>
        </div>
      </Card>

      <Card title={<>🎭 AI Interview Simulator</>}>
        <p className="text-xs opacity-70 mb-3">Practice answering project questions — AI is your interviewer.</p>
        <PrimaryButton onClick={startIv} disabled={ivBusy}>{ivBusy ? <><Spinner /> Preparing…</> : "🎤 Start Interview"}</PrimaryButton>
        {ivQ && <>
          <div className="mt-3"><AIBox>{ivQ}</AIBox></div>
          <textarea value={ivAns} onChange={e=>setIvAns(e.target.value)} placeholder="Type your response…" className="w-full px-3 py-2 mt-3 rounded-lg border bg-card min-h-[120px]" style={{ borderColor: "var(--border)" }} />
          <div className="mt-2"><PrimaryButton onClick={getFb} disabled={ivBusy}>{ivBusy ? <><Spinner /> Evaluating…</> : "📊 Get Feedback"}</PrimaryButton></div>
          {ivFb && <div className="mt-3"><AIBox>{ivFb}</AIBox></div>}
        </>}
      </Card>
    </div>
  );
}
