import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Card, AIBox, PrimaryButton, Spinner } from "@/components/fs/UI";
import { askAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/voice")({
  component: VoicePage,
  head: () => ({ meta: [{ title: "Voice AI · FisherSafe AI" }] }),
});

function VoicePage() {
  const [lang, setLang] = useState("kn-IN");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const recRef = useRef<any>(null);
  const finalRef = useRef("");
  const ai = useServerFn(askAI);

  async function start() {
    if (listening && recRef.current) { recRef.current.stop(); return; }
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setErr("⚠️ Use Chrome — speech recognition not supported here."); return; }
    setErr(""); setTranscript(""); setReply(""); finalRef.current = "";
    const rec = new SR();
    rec.lang = lang; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current = t;
      }
      setTranscript(t);
    };
    rec.onerror = (e: any) => setErr("⚠️ " + e.error);
    rec.onend = async () => {
      setListening(false);
      const final = finalRef.current.trim();
      if (!final) { setErr("No speech detected — try again."); return; }
      setBusy(true);
      const { reply: r } = await ai({ data: {
        prompt: final,
        system: "You are FisherSafe AI 🐟, warm maritime safety assistant for Karnataka fishermen. Reply under 80 words. Mix Kannada naturally. Be practical and caring.",
        maxTokens: 280,
      }});
      setReply(r); setBusy(false);
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(r); u.lang = lang;
        window.speechSynthesis.speak(u);
      }
    };
    recRef.current = rec; setListening(true); rec.start();
  }

  return (
    <div className="space-y-4">
      <Card title={<>🎤 Voice AI Assistant</>} tag="MULTILINGUAL" tagKind="hot">
        <p className="text-sm opacity-70 mb-4">Speak in Kannada, Hindi, Tamil, English — get safety advice. Uses Web Speech API.</p>
        <div className="rounded-2xl p-6 text-center border-2 border-dashed" style={{ background: "color-mix(in oklch, var(--sea-3) 22%, var(--card))", borderColor: "color-mix(in oklch, var(--sea) 30%, transparent)" }}>
          <div className="text-6xl mb-2 inline-block" style={{ animation: listening ? "blink .8s ease-in-out infinite" : "float 4s ease-in-out infinite" }}>🎙️</div>
          <div className="font-semibold mb-1">Speak — get safety advice back</div>
          <div className="text-xs opacity-70 mb-4">Web Speech API · works offline · low-literacy friendly</div>
          <select value={lang} onChange={e=>setLang(e.target.value)} className="px-3 py-2 rounded-lg border bg-card mb-3" style={{ borderColor: "var(--border)" }}>
            <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="ta-IN">தமிழ் (Tamil)</option>
            <option value="en-IN">English (India)</option>
          </select>
          <div><PrimaryButton onClick={start}>{listening ? "⏹ Stop" : "🎤 Start Speaking"}</PrimaryButton></div>
          {err && <div className="text-xs mt-3 opacity-70">{err}</div>}
          {transcript && <div className="font-semibold mt-3">📝 {transcript}</div>}
          {busy && <div className="mt-3 inline-flex items-center gap-2 text-sm"><Spinner /> 🤖 FisherSafe AI thinking…</div>}
          {reply && <div className="mt-4"><AIBox>🐟 {reply}</AIBox></div>}
        </div>
      </Card>
    </div>
  );
}
