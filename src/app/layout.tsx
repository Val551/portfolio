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

/**
 * The origin this site is served from.
 *
 * Link previews need ABSOLUTE image URLs. LinkedIn, Slack and iMessage all
 * ignore a relative `/og.jpg` outright, so Next has to know the origin at
 * build time in order to resolve it. `metadataBase` is what supplies it.
 *
 * Read from the environment rather than hardcoded: Vercel sets
 * VERCEL_PROJECT_PRODUCTION_URL to the project's production domain, and keeps
 * it pointed at a custom domain once one is attached. So this stays correct
 * through a domain change without anyone remembering to edit it.
 * NEXT_PUBLIC_SITE_URL overrides it for any other host.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const TITLE = `${profile.name}, ${profile.affiliation}`;
const DESCRIPTION = `Portfolio of ${profile.name}, ${profile.degree} at ${profile.school}, graduating ${profile.graduation}.`;

/** The card image is a capture of the home screen at exactly 1200x630. */
const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: `The ${profile.name} portfolio home screen, laid out as a console menu with tiles for experience, projects, skills, about and contact.`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    // `website` rather than `profile`: LinkedIn renders it most predictably,
    // and `profile` expects first/last name properties this page has no use
    // for.
    type: "website",
    url: "/",
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    // summary_large_image is the full-width card. Plain `summary` renders a
    // small square thumbnail, which wastes a 1200x630 capture.
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
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
