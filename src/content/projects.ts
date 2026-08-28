import type { Project } from "./types";

/**
 * Engineering OS detail comes from its own README (private repo,
 * github.com/Val551/Personal-OS) — the résumé line understated it
 * considerably. Screenshots are captures of the running app.
 */
export const projects: Project[] = [
  {
    id: "engineering-os",
    title: "Personal Engineering OS",
    blurb:
      "Calendar, tasks, notes and pull requests behind one priority engine.",
    summary:
      "A single-pane command center for engineering work and college life: calendar, tasks, notes, pull requests and a daily recap, unified behind one priority engine. Built as a personal tool, designed like a product.",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Postgres",
      "Prisma",
      "Auth.js v5",
      "Tailwind",
      "Radix",
      "Vercel Cron",
      "Vitest",
    ],
    // The Today capture is 1792px of dashboard. Unzoomed in a 340px card it
    // reads as grey texture; anchored top-left at 1.9x it leads with the
    // sidebar and the "Thursday" headline, which is legible at that size.
    coverZoom: 1.85,
    coverOrigin: "left top",
    repo: "https://github.com/Val551/Personal-OS",
    demo: null,
    access:
      "The app needs Google or GitHub sign-in, since it syncs my own calendar and pull requests. These captures are the running app.",
    shots: [
      {
        src: "/projects/engineering-os/today.webp",
        w: 1792,
        h: 1017,
        label: "Today",
        caption:
          "The morning view: schedule, pull requests needing review, and the priority engine's pick for what to do first.",
      },
      {
        src: "/projects/engineering-os/pull-requests.webp",
        w: 1792,
        h: 1009,
        label: "GitHub",
        caption:
          "Pull requests bucketed into needs-review, authored, assigned and stale, synced from the GitHub GraphQL API with CI rollup.",
      },
      {
        src: "/projects/engineering-os/meetings.webp",
        w: 1792,
        h: 1022,
        label: "Meetings",
        caption:
          "297 events synced from Google Calendar, each reclassifiable into a workspace: internship, school, personal or club.",
      },
      {
        src: "/projects/engineering-os/notes.webp",
        w: 1792,
        h: 997,
        label: "Notes",
        caption:
          "A structured daily log covering key learnings, mistakes, next steps, open questions and what I built, parsed from and back to markdown.",
      },
      {
        src: "/projects/engineering-os/recap.webp",
        w: 1792,
        h: 1018,
        label: "Recap",
        caption:
          "End-of-day reflection: what shipped, what blocked, tomorrow's three bets, and what carries over.",
      },
      {
        src: "/projects/engineering-os/tasks.webp",
        w: 1792,
        h: 1008,
        label: "Tasks",
        caption:
          "Tasks filtered by status, workspace and priority, with optimistic edits that survive a create still in flight.",
      },
      {
        src: "/projects/engineering-os/connections.webp",
        w: 1792,
        h: 1005,
        label: "Settings",
        caption:
          "Google and GitHub linked to a single user: the account-merge problem above, seen from the user's side.",
      },
    ],
    hue: 244,
  },
  {
    id: "design-dash",
    title: "Design Dash",
    blurb:
      "A timed design sprint, peer-voted and scored by a model.",
    summary:
      "A real-time competitive design game. A host picks a category and a timer, players join with a six-character code, and a hidden brief is revealed to everyone at once. When the sprint ends the submissions play back in a blind randomised loop for peer rating, then Gemini scores each one against the brief, and the leaderboard shows both the crowd and the model.",
    stack: [
      "React 18",
      "Vite",
      "Node.js",
      "Express",
      "Socket.io",
      "SQLite",
      "Gemini 1.5 Flash",
    ],
    repo: "https://github.com/AlexDaGreat555/DesignDash",
    demo: null,
    access: null,
    shots: [
      {
        src: "/projects/design-dash/leaderboard.webp",
        label: "Results",
        caption:
          "The final leaderboard: three submissions against one brief, each scored on the average of peer ratings and the model's own read.",
        w: 1092,
        h: 452,
      },
    ],
    hue: 196,
  },
  {
    id: "web-proxy",
    title: "Multithreaded Web Proxy",
    blurb:
      "A concurrent caching proxy in C, with LRU eviction.",
    summary:
      "A concurrent caching web proxy server written in C, using socket programming and Pthreads to serve real-time HTTP/1.0 client requests.",
    stack: ["C", "Pthreads", "Sockets", "HTTP/1.0"],
    repo: null,
    demo: null,
    access: "Coursework repo, kept private under academic integrity policy.",
    shots: [],
    hue: 220,
  },
];
