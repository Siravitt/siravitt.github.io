import type { SiteContent } from "@/content/site";
import { PlaceholderText } from "@/components/placeholder-text";
import { splitHighlight } from "@/lib/highlight";
import { splitPlaceholder } from "@/lib/placeholder";

/**
 * The About section's body: one large statement with its highlighted
 * phrase, then 0–2 shorter paragraphs side by side
 * (docs/tickets/07-about-stack.md, "Decisions (binding)"; DESIGN.md §3,
 * §6 "About statement"). Rendered inside the `<SectionShell id="about">`
 * ticket 03 already owns; this component is its children only.
 *
 * `about.highlight` is searched for inside `about.statement` *after* any
 * leading `[Placeholder]` marker is split off, so a real statement and a
 * still-placeholder one both search the same text. When the phrase isn't
 * found, the statement renders complete with no emphasis (ticket
 * decision: "if the phrase isn't in the statement, the statement renders
 * plain").
 */
export function AboutSection({ site }: { site: SiteContent }) {
  const { about } = site;
  const { marker, rest } = splitPlaceholder(about.statement);
  const { before, match, after } = splitHighlight(rest, about.highlight);

  return (
    <>
      <p className="max-w-[960px] text-[length:clamp(30px,1.72vw+23.3px,48px)] leading-[1.16] font-medium tracking-[-0.028em]">
        {marker ? <span className="ph">{marker}</span> : null}
        {before}
        {match ? (
          <strong className="font-medium text-primary">{match}</strong>
        ) : null}
        {after}
      </p>
      {about.paragraphs.length > 0 ? (
        <div className="mt-16 grid gap-x-6 gap-y-4 max-sm:gap-y-3 lg:grid-cols-12">
          {about.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph}
              data-rv
              style={{ "--i": i } as React.CSSProperties}
              className={
                i % 2 === 0 ? "lg:col-span-5" : "lg:col-span-5 lg:col-start-7"
              }
            >
              <PlaceholderText text={paragraph} />
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
}
