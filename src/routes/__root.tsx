import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { FisherSafeProvider } from "@/lib/fishersafe-store";
import { Nav } from "@/components/fs/Nav";
import { LocationSelector } from "@/components/fs/LocationSelector";
import { FloatingChatbot } from "@/components/fs/FloatingChatbot";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="fs-hero-title" style={{ fontSize: "clamp(4rem, 10vw, 6rem)" }}>
          <span className="fs-hero-grad">404</span>
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--lt)" }}>This shore isn't on the map.</p>
        <Link to="/" className="fs-cta mt-7 inline-flex">Back to safe waters</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center fs-card">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--lt)" }}>{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="fs-cta mt-5">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FisherSafe AI · Maritime safety for coastal fishermen" },
      { name: "description", content: "AI-powered safety, weather, fish zones, market prices & SOS for India's coastal fishing community." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <FisherSafeProvider>
        <div className="relative min-h-screen">
          <div className="fs-orb fs-orb-1" aria-hidden />
          <div className="fs-orb fs-orb-2" aria-hidden />
          <div className="fs-orb fs-orb-3" aria-hidden />

          <div className="max-w-[1240px] mx-auto px-4 md:px-6 pb-24 pt-4 relative z-10">
            <Nav />
            <div className="flex justify-end mt-4">
              <LocationSelector />
            </div>
            <main className="mt-2">
              <Outlet />
            </main>
            <footer className="mt-24 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-3 text-xs" style={{ borderColor: "var(--border)", color: "var(--lt)" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--coral)" }}>♥</span>
                Built with love for India's 4M+ coastal fishing community.
              </div>
              <div className="font-mono-brand">FisherSafe AI · v2.0 · Open & Free</div>
            </footer>
          </div>
          <FloatingChatbot />
        </div>
      </FisherSafeProvider>
    </QueryClientProvider>
  );
}
