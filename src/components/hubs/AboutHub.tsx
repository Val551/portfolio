import { profile } from "@/content/profile";
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  DownloadIcon,
} from "@/components/ui/icons";

/**
 * Who Fabio is, what he has studied, and every way to reach him.
 *
 * The degree / institution / graduating / GPA block that used to sit here
 * is gone: the introduction already states the degree and the university,
 * so the block was largely restating the paragraph directly above it.
 */
export function AboutHub() {
  const links = [
    { href: `mailto:${profile.email}`, label: "Email", Icon: MailIcon, external: false },
    { href: profile.github, label: "GitHub", Icon: GitHubIcon, external: true },
    { href: profile.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

  return (
    <div className="grid max-w-[58rem] gap-10">
      {/* Portrait beside the introduction, not above it: at this width a
          full-bleed photo would push the text below the fold and make the
          page open on an image rather than on a sentence. */}
      <div className="grid gap-7 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-start sm:gap-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.w}
          height={profile.portrait.h}
          decoding="async"
          className="portrait w-40 rounded-md sm:w-full"
        />
        <p className="measure text-body text-ink-muted">{profile.intro}</p>
      </div>

      <div>
        <h3 className="text-label font-medium text-ink-faint">
          Relevant coursework
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.coursework.map((course) => (
            <li
              key={course}
              className="chip"
            >
              {course}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--hairline)] pt-8">
        {links.map(({ href, label, Icon, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="about-link inline-flex min-h-11 items-center gap-2.5 rounded-md px-4 text-small text-ink-muted"
          >
            <Icon className="size-[18px]" />
            {label}
          </a>
        ))}

        {profile.resume ? (
          <a
            href={profile.resume}
            download
            className="inline-flex min-h-11 items-center gap-2.5 rounded-md bg-ink px-5 text-small font-medium text-void transition-transform duration-200 ease-[var(--ease-out-expo)] hover:scale-[1.03] active:scale-[0.99]"
          >
            <DownloadIcon className="size-[18px]" />
            Download résumé
          </a>
        ) : null}
      </div>
    </div>
  );
}
