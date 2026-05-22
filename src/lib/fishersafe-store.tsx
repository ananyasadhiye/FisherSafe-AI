import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { TOWNS, fetchWeather, type WeatherData } from "./fishersafe-data";

export type ChatMsg = { r: "ai" | "user"; t: string; ts: string };
export type AIMsg = { role: "user" | "assistant"; content: string; ts: string };
export type CatchEntry = { fish: string; kg: number; date: string; zone: string };

type Store = {
  town: string;
  setTown: (t: string) => void;
  weather: WeatherData | null;
  weatherLoading: boolean;
  chatMsgs: ChatMsg[];
  addChatMsg: (m: ChatMsg) => void;
  aiHist: AIMsg[];
  setAiHist: (m: AIMsg[] | ((p: AIMsg[]) => AIMsg[])) => void;
  catchLog: CatchEntry[];
  addCatch: (c: CatchEntry) => void;
  sosSent: boolean;
  setSosSent: (b: boolean) => void;
  timer: { startMs: number | null; hrs: number };
  setTimer: (t: { startMs: number | null; hrs: number }) => void;
};

const Ctx = createContext<Store | null>(null);

const initialChat: ChatMsg[] = [
  { r:"ai", t:"🌊 KAR-4521: ಗಾಳಿ ಜೋರಾಗಿದೆ — wind picking up near Oyster Rock!", ts:"08:42" },
  { r:"ai", t:"⛵ KAR-3309: Roger. Heading back now. Stay safe! 🙏",          ts:"08:45" },
  { r:"ai", t:"🐟 KAR-7712: Big catch near Kurumgad today! ಮೀನು ಚೆನ್ನಾಗಿ ಸಿಗ್ತಿದೆ!", ts:"09:10" },
];

const initialCatch: CatchEntry[] = [
  { fish:"Kingfish", kg:12.5, date:"10 May", zone:"Oyster Rock Shoal" },
  { fish:"Pomfret",  kg:8.0,  date:"08 May", zone:"Nirvana Deep" },
  { fish:"Mackerel", kg:25.0, date:"06 May", zone:"Nirvana Deep" },
];

export function FisherSafeProvider({ children }: { children: ReactNode }) {
  const [town, setTown] = useState<string>("Gokarna, Karnataka");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>(initialChat);
  const [aiHist, setAiHist] = useState<AIMsg[]>([]);
  const [catchLog, setCatchLog] = useState<CatchEntry[]>(initialCatch);
  const [sosSent, setSosSent] = useState(false);
  const [timer, setTimer] = useState<{ startMs: number | null; hrs: number }>({ startMs: null, hrs: 8 });

  useEffect(() => {
    const [lat, lon] = TOWNS[town];
    setWeatherLoading(true);
    setWeather(null);
    fetchWeather(lat, lon).then(w => {
      setWeather(w);
      setWeatherLoading(false);
    });
  }, [town]);

  return (
    <Ctx.Provider value={{
      town, setTown, weather, weatherLoading,
      chatMsgs, addChatMsg: (m) => setChatMsgs(p => [...p, m]),
      aiHist, setAiHist,
      catchLog, addCatch: (c) => setCatchLog(p => [c, ...p]),
      sosSent, setSosSent,
      timer, setTimer,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("FisherSafeProvider missing");
  return v;
}
