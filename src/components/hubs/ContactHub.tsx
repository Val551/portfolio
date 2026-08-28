"use client";

import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { MailIcon } from "@/components/ui/icons";

const SUBJECTS = [
  "New-grad or internship role",
  "Project collaboration",
  "A question about my work",
  "Something else",
] as const;

type Field = "name" | "email" | "subject" | "message";

/**
 * Contact: the reasons to write on the left, a composer on the right.
 *
 * The form does NOT post anywhere. This site is a static export with no
 * server, so a form that appeared to send would either need a third-party
 * endpoint or would silently drop messages. Instead it validates, then hands
 * a fully-composed mail to the visitor's own client — which also puts the
 * thread in their sent folder, where they can find it again.
 *
 * That constraint is stated on the button and in the confirmation, so nobody
 * presses send and wonders whether anything happened.
 */
export function ContactHub() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [handedOff, setHandedOff] = useState(false);
  const firstInvalid = useRef<Field | null>(null);

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear an error the moment the visitor starts fixing it, rather than
    // making them submit again to find out.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter an email address I can reply to.";
    if (!values.subject) next.subject = "Please pick a subject.";
    if (values.message.trim().length < 10)
      next.message = "A sentence or two is plenty. Ten characters minimum.";
    return next;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    const order: Field[] = ["name", "email", "subject", "message"];
    firstInvalid.current = order.find((f) => next[f]) ?? null;
    if (firstInvalid.current) {
      document.getElementById(`contact-${firstInvalid.current}`)?.focus();
      return;
    }

    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href =
      `mailto:${profile.email}` +
      `?subject=${encodeURIComponent(values.subject)}` +
      `&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  };

  const field = (name: Field, label: string, node: React.ReactNode) => (
    <div>
      <label htmlFor={`contact-${name}`} className="block text-label text-ink-muted">
        {label}
      </label>
      <div className="mt-1.5">{node}</div>
      {/* No role="alert". Submitting an empty form revealed four of these at
          once, which is four assertive interruptions competing to be read.
          The errors reach assistive tech the correct way instead: each field
          points at its own message with aria-describedby, and submit moves
          focus to the first invalid field, so that field and its reason are
          announced together. */}
      {errors[name] ? (
        <p id={`contact-${name}-error`} className="mt-1.5 text-label text-[oklch(0.75_0.14_28)]">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  const inputProps = (name: Field) => ({
    id: `contact-${name}`,
    name,
    // Validation is ours (the form is noValidate), but `required` still
    // carries the requirement to assistive tech, which is what the four
    // "(required)" labels were doing visually and redundantly.
    required: true,
    value: values[name],
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    className: "field w-full rounded-md px-3.5 py-2.5 text-small text-ink",
  });

  return (
    <div className="grid max-w-[62rem] gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
      <div>
        <h3 className="text-h3">Let&rsquo;s connect</h3>
        <p className="measure mt-3 text-small text-ink-muted">
          I&rsquo;m open to new-grad and internship roles, and happy to talk
          about systems, side projects, or anything on this site.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="about-link mt-7 inline-flex min-h-11 items-center gap-2.5 rounded-md px-4 text-small text-ink-muted"
        >
          <MailIcon className="size-[18px]" />
          {profile.email}
        </a>
      </div>

      <form noValidate onSubmit={onSubmit} className="contact-form grid gap-4 rounded-md p-6 sm:p-7">
        {/* Name and email pair up from sm: the stacked column pushed
            "Compose email" below the fold on a 13-inch laptop, so the one
            action this whole site is built around was invisible until you
            scrolled a form you had not filled in yet. */}
        <p className="text-label text-ink-faint">All fields required.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {field("name", "Name",
            <input {...inputProps("name")} type="text" autoComplete="name" placeholder="Ada Lovelace"
              onChange={(e) => set("name", e.target.value)} />)}

          {field("email", "Email",
            <input {...inputProps("email")} type="email" autoComplete="email" placeholder="you@company.com"
              onChange={(e) => set("email", e.target.value)} />)}
        </div>

        {field("subject", "Subject",
          <select {...inputProps("subject")} onChange={(e) => set("subject", e.target.value)}>
            <option value="">Select a subject</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>)}

        {field("message", "Message",
          <textarea {...inputProps("message")} rows={4} placeholder="A sentence about the role, the team, or what you're working on."
            onChange={(e) => set("message", e.target.value)} />)}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-2.5 rounded-md bg-ink px-6 text-small font-medium text-void transition-transform duration-200 ease-[var(--ease-out-expo)] hover:scale-[1.02] active:scale-[0.99]"
          >
            <MailIcon className="size-[18px]" />
            Compose email
          </button>
          <p className="text-label text-ink-faint">
            Opens in your mail client, already filled in.
          </p>
        </div>

        <p role="status" aria-live="polite" className="text-label text-ink-muted">
          {handedOff
            ? "Your mail client should have opened with the message ready to send. If nothing happened, use the address on the left instead."
            : ""}
        </p>
      </form>
    </div>
  );
}
