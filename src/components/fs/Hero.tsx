import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/fishersafe-store";
import { assess, windDir } from "@/lib/fishersafe-data";

export function Hero() {
  const { town, weather } = useStore();
  const c = weather?.current;
  const s = c ? assess(c.windspeed_10m, c.precipitation, c.weathercode, c.visibility ?? 10000) : "safe";

  const statusText = s === "safe" ? "Calm seas ahead" : s === "caution" ? "Use caution" : "Storm risk";
  const statusBadge = s === "safe" ? "SAFE TO SAIL" : s === "caution" ? "ADVISORY" : "DO NOT SAIL";
  const statusColor = s === "safe" ? "oklch(0.55 0.14 180)" : s === "caution" ? "oklch(0.55 0.16 70)" : "oklch(0.55 0.20 30)";
  const statusBg = s === "safe" ? "oklch(0.55 0.14 180 / .12)" : s === "caution" ? "oklch(0.55 0.16 70 / .14)" : "oklch(0.55 0.20 30 / .14)";

  const base = c?.windspeed_10m ?? 12;
  const bars = Array.from({ length: 14 }, (_, i) => 28 + Math.abs(Math.sin(i * 0.55 + base * 0.1)) * 50);

  return (
    <section className="relative mt-6">
      <div className="fs-hero-v2">
        <div className="fs-hero-mesh" aria-hidden />
        <div className="fs-hero-grid-bg" aria-hidden />

        <div className="relative z-10 grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 items-center">
          {/* LEFT */}
          <div className="animate-fade-up">
            <div className="fs-hero-eyebrow-v2 mb-6">
              <span className="dot" />
              <span>Live ocean intelligence</span>
              <span className="pill">v2</span>
            </div>

            <h1 className="fs-hero-h1">
              Every fisherman deserves to
              <br />
              <span className="ital">come home safely.</span>
            </h1>

            <p className="mt-7 text-base md:text-lg leading-relaxed max-w-xl" style={{ color: "oklch(0.42 0.03 235)" }}>
              FisherSafe AI is a free, multilingual maritime safety platform — predicting weather,
              guiding boats, and standing watch over every voyage along India's coast.
            </p>

            <div className="flex flex-wrap gap-3 mt-9">
              <Link to="/features" className="fs-cta-v2">
                Explore platform
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/voice" className="fs-cta-ghost-v2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>
                Voice assistant
              </Link>
              <Link to="/sos" className="fs-cta-ghost-v2" style={{ color: "oklch(0.55 0.20 30)" }}>
                <span className="inline-block w-2 h-2 rounded-full animate-blink" style={{ background: "oklch(0.60 0.20 30)" }} />
                Emergency SOS
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 mt-12">
              {[
                ["12,400+", "Families protected"],
                ["186", "Coastal villages"],
                ["842", "SOS responses"],
                ["6", "Languages"],
              ].map(([n, l], i) => (
                <div key={l} style={{ animationDelay: `${i * 80}ms` }} className="fs-counter">
                  <div>{n}</div>
                  <div className="text-[.72rem] font-sans font-medium mt-1.5" style={{ color: "var(--lt)", letterSpacing: 0 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — live glass card */}
          <div className="fs-live-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[.7rem] font-mono-brand tracking-widest uppercase" style={{ color: "var(--lt)" }}>
                  {town.split(",")[0]} Coast
                </div>
                <div className="mt-2 font-display text-3xl md:text-[2rem]" style={{ color: "var(--ink)", letterSpacing: "-.015em", lineHeight: 1.05 }}>
                  {statusText}
                </div>
              </div>
              <span className="fs-live-pill" style={{ color: statusColor, background: statusBg, border: `1px solid ${statusColor.replace(/\)$/, ' / .3)')}` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: statusColor }} />
                {statusBadge}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-5">
              {[
                { lbl: "Wind", val: c ? `${c.windspeed_10m.toFixed(0)}` : "12", unit: c ? `km/h ${windDir(c.winddirection_10m)}` : "km/h", icon: "💨" },
                { lbl: "Humidity", val: c ? `${(c.relative_humidity_2m ?? 78).toFixed(0)}` : "78", unit: "%", icon: "💧" },
                { lbl: "Swell", val: "0.8", unit: "m", icon: "🌊" },
              ].map(t => (
                <div key={t.lbl} className="fs-mini-stat">
                  <div className="text-base">{t.icon}</div>
                  <div className="text-[.65rem] mt-1" style={{ color: "var(--lt)" }}>{t.lbl}</div>
                  <div className="mt-0.5">
                    <span className="font-display text-lg" style={{ color: "var(--ink)" }}>{t.val}</span>
                    <span className="font-mono-brand text-[.6rem] ml-1" style={{ color: "var(--lt)" }}>{t.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl mt-4 p-4" style={{ background: "linear-gradient(180deg, oklch(0.95 0.04 215 / .7), oklch(0.92 0.06 200 / .5))", border: "1px solid oklch(0.65 0.13 205 / .2)" }}>
              <div className="flex justify-between items-center mb-2.5">
                <div className="text-[.7rem] font-medium" style={{ color: "var(--ink-2)" }}>Next 12 hours forecast</div>
                <div className="text-[.65rem] font-mono-brand uppercase tracking-wider" style={{ color: "var(--sage)" }}>● Favorable</div>
              </div>
              <div className="flex items-end justify-between gap-1" style={{ height: 60 }}>
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md" style={{
                    height: `${h}%`,
                    background: `linear-gradient(180deg, oklch(0.65 0.14 210), oklch(0.80 0.10 195))`,
                    animation: `barRise .8s cubic-bezier(.2,.7,.2,1) both ${i * 50}ms`,
                    minHeight: 10,
                  }} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-[.72rem]" style={{ color: "var(--ink-2)" }}>
              <div className="flex items-center gap-2"><span className="fs-dlive" />AI watching 4 boats nearby</div>
              <div className="font-mono-brand" style={{ color: "var(--lt)" }}>Auto-alerts ON</div>
            </div>
          </div>
        </div>

        {/* Animated waves at the bottom */}
        <svg className="fs-wave" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="wg1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.70 0.13 210 / .35)" />
              <stop offset="100%" stopColor="oklch(0.55 0.14 220 / .6)" />
            </linearGradient>
          </defs>
          <path fill="url(#wg1)" d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,90 L0,90 Z M1200,40 C1350,80 1550,0 1800,40 C2050,80 2250,0 2400,40 L2400,90 L1200,90 Z"/>
        </svg>
        <svg className="fs-wave fs-wave-2" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden>
          <path fill="oklch(0.78 0.13 40 / .35)" d="M0,30 C200,70 400,0 600,30 C800,60 1000,0 1200,30 L1200,70 L0,70 Z M1200,30 C1400,70 1600,0 1800,30 C2000,60 2200,0 2400,30 L2400,70 L1200,70 Z"/>
        </svg>
        <svg className="fs-wave fs-wave-3" viewBox="0 0 1200 55" preserveAspectRatio="none" aria-hidden>
          <path fill="oklch(0.85 0.10 160 / .45)" d="M0,20 C180,50 380,0 600,25 C820,50 1020,0 1200,25 L1200,55 L0,55 Z M1200,25 C1380,50 1580,0 1800,25 C2020,50 2220,0 2400,25 L2400,55 L1200,55 Z"/>
        </svg>
      </div>

      {/* Trust marquee */}
      <div className="fs-marquee mt-8">
        <div className="fs-marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="inline-flex gap-12 pr-12">
              {["Coastal Cooperatives", "IMD Bulletins", "NDRF Network", "Open Weather API", "Karnataka Fisheries", "ISRO INCOIS", "WhatsApp Alerts", "Satellite Tracking"].map(n => (
                <span key={n + k} className="fs-marquee-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>
                  {n}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="mt-24 md:mt-32">
        <div className="fs-eyebrow mb-4">Our mission</div>
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
          <div>
            <h2 className="fs-section-title">
              Technology in service of those <span className="fs-hero-grad" style={{ fontStyle: "italic" }}>who feed us.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: "oklch(0.42 0.03 235)" }}>
              For generations, fishermen have sailed into uncertainty. We built FisherSafe AI so no
              family has to wait in fear — bringing weather intelligence, voice assistance, and
              emergency response to every boat, free of cost, in every coastal language.
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="oklch(0.60 0.20 30)"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>
              <span style={{ color: "var(--ink-2)" }}>A public-good project — never paywalled, never sold.</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <ShieldIcon />, title: "Safety first", desc: "Real-time sea state, storm alerts, and one-tap SOS connect crews with rescue networks." },
              { icon: <LangIcon />, title: "Every coast, every tongue", desc: "Voice and text in Kannada, Telugu, Tamil, Malayalam, Hindi, and English." },
              { icon: <FishIcon />, title: "Smarter livelihoods", desc: "AI fish-zone forecasts and mandi prices help families earn more from each voyage." },
              { icon: <PeopleIcon />, title: "Community-driven", desc: "Open data, open source, built with cooperatives and coastal NGOs." },
            ].map((b, i) => (
              <div key={b.title} className="fs-bento-v2" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="fs-bento-icon-v2">{b.icon}</div>
                <h3 className="font-semibold text-base" style={{ color: "var(--ink)", letterSpacing: "-.01em" }}>{b.title}</h3>
                <p className="text-[.88rem] mt-1.5 leading-relaxed" style={{ color: "oklch(0.42 0.03 235)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShieldIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function LangIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14M5 8l-1 4M5 8l-1-4M19 8l1 4M19 8l1-4M12 12v8M9 20h6"/></svg>; }
function FishIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c2-4 6-6 10-6l3 6-3 6c-4 0-8-2-10-6zM2 12c1.5-1 3-1 4 0M17 12h.01"/></svg>; }
function PeopleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }