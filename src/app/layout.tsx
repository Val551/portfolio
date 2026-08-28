import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { AmbientProvider } from "@/hooks/useAmbient";
import { AmbientBackground } from "@/components/chrome/AmbientBackground";
import { profile } from "@/content/profile";
import "./globals.css";

/**
 * Sony's system typeface is SST (Monotype, Akira Kobayashi) — a neo-grotesque
 * with faint humanist warmth, engineered for screen UI. It cannot be licensed
 * for the web, so Hanken Grotesk stands in: the same skeleton, softened
 * terminals, and a weight range wide enough to carry both 13px labels and an
 * 84px display line. One family throughout, as a console UI would.
 */
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
  // 700 is unused: no font-bold, no <strong>, and headings top out at 600.
  // Note this saves no bytes. Hanken Grotesk self-hosts as a variable font,
  // one file per unicode range with the whole weight axis inside, so the
  // four shipped woff2 files are latin / latin-ext / vietnamese /
  // cyrillic-ext and are identical either way. Dropping 700 only stops the
  // CSS declaring a face the site never asks for.
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${profile.name}, ${profile.affiliation}`,
  description: `Portfolio of ${profile.name}, ${profile.degree} at ${profile.school}, graduating ${profile.graduation}.`,
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name}, Electrical & Computer Engineering`,
    description: `Portfolio of ${profile.name}, ${profile.degree} at ${profile.school}.`,
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0f13",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        <AmbientProvider>
          <AmbientBackground />
          {/* py-3 rather than py-2 so the focused target clears 44px. */}
          <a
            href="#main"
            className="sr-only rounded-md bg-ink px-5 py-3 text-small font-medium text-void focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[var(--z-toast)]"
          >
            Skip to content
          </a>
          <main id="main">{children}</main>
        </AmbientProvider>
      </body>
    </html>
  );
}
