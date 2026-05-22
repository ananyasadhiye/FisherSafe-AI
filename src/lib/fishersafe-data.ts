export const TOWNS: Record<string, [number, number]> = {
  "Gokarna, Karnataka": [14.5479, 74.3188],
  "Karwar, Karnataka": [14.8135, 74.1288],
  "Mangaluru, Karnataka": [12.9141, 74.856],
  "Udupi, Karnataka": [13.3409, 74.7421],
  "Malpe, Karnataka": [13.3528, 74.7062],
  "Honnavar, Karnataka": [14.2796, 74.4452],
  "Mumbai, Maharashtra": [18.9388, 72.8354],
  "Kochi, Kerala": [9.9312, 76.2673],
};

export const WMO_EMOJI: Record<number, string> = {
  0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️", 45: "🌫", 51: "🌦", 61: "🌧", 63: "🌧",
  65: "⛈", 80: "🌦", 81: "🌧", 82: "⛈", 95: "⛈", 99: "🌪",
};

export type ZoneLevel = "hot" | "warm" | "cold";
export const ZONES_DATA: { name: string; level: ZoneLevel; fish: string[]; pct: number; sst: number }[] = [
  { name: "Oyster Rock Shoal", level: "hot",  fish: ["Kingfish","Pomfret","Tuna"], pct: 88, sst: 27.4 },
  { name: "Kurumgad Island",   level: "hot",  fish: ["Sardine","Mackerel","Barracuda"], pct: 82, sst: 26.8 },
  { name: "Nirvana Deep",      level: "warm", fish: ["Snapper","Grouper"], pct: 61, sst: 28.1 },
  { name: "Mirjan Creek",      level: "cold", fish: ["Mullet","Crab"], pct: 34, sst: 24.3 },
];

export type TrendDir = "up" | "down" | "flat";
export const FISH_PRICES: { e: string; n: string; kn: string; p: number; t: TrendDir }[] = [
  { e: "🐟", n: "Pomfret",      kn: "ಅಕ್ಕಟ",   p: 480, t: "up" },
  { e: "🐠", n: "Kingfish",     kn: "ಅಂಜಲ",    p: 380, t: "up" },
  { e: "🐡", n: "Mackerel",     kn: "ಬಂಗಡ",    p: 120, t: "flat" },
  { e: "🦐", n: "Tiger Prawns", kn: "",         p: 650, t: "up" },
  { e: "🐟", n: "Sardine",      kn: "ತಾರ್ಲೆ",  p: 80,  t: "down" },
  { e: "🦞", n: "Lobster",      kn: "",         p: 900, t: "up" },
  { e: "🐙", n: "Squid",        kn: "ಮಾಗಾ",    p: 220, t: "flat" },
  { e: "🦀", n: "Crab",         kn: "ಏಡಿ",     p: 350, t: "down" },
];

export const PM: Record<string, number> = {
  Pomfret: 480, Kingfish: 380, Mackerel: 120, "Tiger Prawns": 650,
  Sardine: 80, Lobster: 900, Squid: 220, Crab: 350,
};

export type VesselStatus = "active" | "anchored" | "docked";
export const VESSELS_DATA: { e: string; n: string; t: string; d: number; spd: number; dir: string; s: VesselStatus; id: string }[] = [
  { e:"⛵", n:"Kattumaram #1",     t:"Artisanal",   d:1.8, spd:6.2,  dir:"NW", s:"active",   id:"KAR-4521" },
  { e:"🚢", n:"Motorized Vallam",  t:"Small-scale", d:3.4, spd:8.5,  dir:"NE", s:"active",   id:"KAR-3309" },
  { e:"🛥️", n:"Commercial Trawler", t:"Commercial", d:5.1, spd:12.0, dir:"W",  s:"active",   id:"KAR-7712" },
  { e:"⛴️", n:"Purse Seiner",       t:"Commercial", d:7.3, spd:0,    dir:"-",  s:"anchored", id:"KAR-2218" },
  { e:"🚤", n:"Fibre Boat",         t:"Artisanal",  d:9.6, spd:0,    dir:"-",  s:"docked",   id:"KAR-5533" },
];

export const SEASONAL: Record<number, { s: string[]; r: "peak"|"good"|"low"|"ban" }> = {
  1:{s:["Sardine","Mackerel"],r:"good"}, 2:{s:["Tuna","Kingfish"],r:"peak"},
  3:{s:["Pomfret","Snapper"],r:"peak"},  4:{s:["Prawns","Lobster"],r:"good"},
  5:{s:["Crab","Squid"],r:"good"},       6:{s:["—"],r:"ban"},
  7:{s:["—"],r:"ban"},                   8:{s:["Mackerel"],r:"low"},
  9:{s:["Sardine","Mullet"],r:"good"},  10:{s:["Kingfish","Tuna"],r:"peak"},
  11:{s:["Pomfret","Prawns"],r:"peak"}, 12:{s:["All species"],r:"good"},
};

export const SOS_COMM = [
  { id:"KAR-4521", msg:"Engine failure 8km offshore",         time:"09:42", status:"active",   loc:"Near Oyster Rock" },
  { id:"KAR-1198", msg:"Crew member needs medical help",      time:"08:15", status:"resolved", loc:"Near Karwar port" },
  { id:"KAR-3309", msg:"Caught in current, need tow",         time:"10:05", status:"active",   loc:"Kurumgad area" },
];

export const SECTIONS: { icon: string; path: string; label: string }[] = [
  { icon:"🌊", path:"/",         label:"Dashboard" },
  { icon:"⛅", path:"/weather",  label:"Weather" },
  { icon:"🐟", path:"/zones",    label:"Zones" },
  { icon:"💰", path:"/market",   label:"Market" },
  { icon:"💬", path:"/chat",     label:"Boat Chat" },
  { icon:"🤖", path:"/ai",       label:"AI Console" },
  { icon:"🎤", path:"/voice",    label:"Voice AI" },
  { icon:"🌊", path:"/tides",    label:"Tides" },
  { icon:"⛵", path:"/vessels",  label:"Vessels" },
  { icon:"🚀", path:"/features", label:"Features" },
  { icon:"🚨", path:"/sos",      label:"SOS" },
];

export function windDir(d: number) {
  return ["N","NE","E","SE","S","SW","W","NW"][Math.round(d/45)%8];
}

export function assess(wind: number, prec: number, wmo: number, vis: number): "safe"|"caution"|"danger" {
  if (wind >= 50 || [95,96,99].includes(wmo) || prec > 15 || vis < 1000) return "danger";
  if (wind >= 30 || [61,63,65,80,81,82].includes(wmo) || prec > 5 || vis < 3000) return "caution";
  return "safe";
}

export function moonPhase(): { icon: string; name: string; tip: string } {
  const days = ((Date.now() - new Date(2000,0,6).getTime()) / 86400000) % 29.53;
  if (days < 1.85) return { icon:"🌑", name:"New Moon",       tip:"Deep-sea night fishing works well." };
  if (days < 7.38) return { icon:"🌒", name:"Waxing Crescent", tip:"Fish active near surface at dawn." };
  if (days < 9.22) return { icon:"🌓", name:"First Quarter",   tip:"Strong tides — fish feed actively!" };
  if (days < 14.77)return { icon:"🌔", name:"Waxing Gibbous",  tip:"Excellent fishing window!" };
  if (days < 16.61)return { icon:"🌕", name:"Full Moon",       tip:"Max tides. Night fishing superb." };
  if (days < 22.15)return { icon:"🌖", name:"Waning Gibbous",  tip:"Fish active at dawn." };
  return { icon:"🌘", name:"Waning Crescent", tip:"Calm coastal fishing." };
}

export function genTides(lat: number): { h: number; v: number }[] {
  const seed = Math.floor(lat * 100 + new Date().getDate());
  return Array.from({ length: 12 }, (_, h) => ({
    h: h * 2,
    v: Math.max(0.1, 1.4 + 0.8 * Math.sin((h * 2 / 12.4) * Math.PI + seed)),
  }));
}

export type WeatherData = {
  current: {
    temperature_2m: number;
    windspeed_10m: number;
    winddirection_10m: number;
    weathercode: number;
    precipitation: number;
    cloudcover: number;
    visibility: number;
    relative_humidity_2m: number;
  };
  daily?: {
    time: string[];
    weathercode: number[];
    windspeed_10m_max: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&current=temperature_2m,windspeed_10m,winddirection_10m,weathercode,precipitation,cloudcover,visibility,relative_humidity_2m`
    + `&daily=weathercode,windspeed_10m_max,temperature_2m_max,temperature_2m_min`
    + `&timezone=Asia%2FKolkata&forecast_days=7`;
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}
