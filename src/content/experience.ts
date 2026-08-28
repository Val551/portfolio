import type { Activity } from "./types";

/**
 * Straight from the résumé, most recent first. Bullets are the résumé's own
 * claims — every figure (200+ students, 20+ operators, 15%, 20%) is as
 * written. Run-on résumé sentences are broken for screen reading; no claim
 * has been added, removed or strengthened.
 *
 * Bullets carry no terminal full stop: they are fragments in a list, not
 * sentences, and the periods only added visual noise down the right edge.
 */
export const experience: Activity[] = [
  {
    id: "cmu-ta-fullstack",
    organization: "Carnegie Mellon University",
    role: "Teaching Assistant · 18-351 Full-Stack Software Development for Engineers",
    period: "Aug 2026 – Present",
    bullets: [
      "Support students building end-to-end web applications on a client-server architecture, with a plain web-stack front end against a TypeScript and NoSQL back end",
      "Cover the course's core concepts in office hours and code review: asynchronous computation, modularity, authentication and authorization, and deploying from an integration server to the cloud",
    ],
  },
  {
    id: "azure",
    organization: "Microsoft",
    role: "Software Engineering Intern · Azure Security",
    period: "May – Aug 2026",
    bullets: [
      "Built a secure proxy service connecting Azure SRE AI agents to internal infrastructure APIs, giving on-call engineers real-time access to machine health, logs, repair state and operational data without manual investigation across restricted systems",
      "Implemented cross-system authentication and authorization for protected internal services, configuring token-based access, service roles and approval workflows to bridge identity boundaries between Azure and lower-level infrastructure",
      "Developed a reusable integration layer between Azure incident-response automation and lower-level infrastructure, cutting manual investigation steps for on-call engineers and leaving the integration extensible for other teams",
    ],
  },
  {
    id: "cmu-ta",
    organization: "Carnegie Mellon University",
    role: "Teaching Assistant · Fundamentals of Programming and Computer Science",
    period: "Aug 2025 – May 2026",
    bullets: [
      "Supported 200+ students in Python, algorithm design and data structures, debugging their code directly and reinforcing computational problem-solving against real debugging workflows",
    ],
  },
  {
    id: "moonranger",
    organization: "MoonRanger",
    role: "Full-Stack Software Engineer Intern · Mission Control",
    period: "May – Aug 2025",
    bullets: [
      "Improved the Mission Control web interface used by 20+ operators, implementing React and TypeScript features for real-time visualization of rover status, command history and live telemetry. Operator errors fell 15%",
      "Resolved critical coordinate-conversion faults in lunar maps, increasing rover navigation path accuracy by 20% and making mission operations safer",
    ],
  },
  {
    id: "cmu-research",
    organization: "Carnegie Mellon University",
    role: "Undergraduate Research · Climate Risk Data Collection and Spatial Analysis",
    period: "Aug 2023 – May 2024",
    bullets: [
      "Created geospatial analysis tools visualizing data-driven insights highlighting regional climate vulnerabilities across Arizona",
      "Developed Python scripts to acquire, curate, and analyze high-resolution climate risk datasets, ensuring precision and reproducibility in spatial vulnerability assessments",
    ],
  },
];
