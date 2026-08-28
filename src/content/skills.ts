import type { SkillGroup } from "./types";

/**
 * The résumé's skills plus everything actually shipped in the projects
 * listed on this site — each entry is evidenced by a stack on the Projects
 * page or a role on the résumé, never aspirational.
 *
 * Grouped rather than listed flat: a single wall of 35 chips would imply
 * Rust and HTML/CSS carry the same weight.
 */
export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C", "C++", "C#", "Rust", "Java", "R"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Vite", "Tailwind CSS", "Radix", "HTML / CSS"],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "Express", "Socket.io", "REST APIs", "Auth.js", "Gemini API"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "SQLite", "MongoDB", "Prisma", "SQL / NoSQL", "NumPy"],
  },
  {
    label: "Systems & tooling",
    items: ["Linux", "Sockets", "Pthreads", "Git", "Docker", "Vercel", "Vitest", "Azure", "AWS", "Google Cloud"],
  },
];
