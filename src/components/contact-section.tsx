import { GitHubIcon } from "@/components/icons/github-icon";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { PlaceholderText } from "@/components/placeholder-text";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { SiteContent } from "@/content/site";
import { getVisibleSections, type SectionKey } from "@/lib/sections";

/**
 * The Contact footer's body: the lead line, the GitHub/LinkedIn profile
 * links with their one-colour logos, the big Email keycap, the footer
 * lede and the Sections/Elsewhere link columns
 * (docs/tickets/12-contact-closing.md, "Decisions (binding)"; DESIGN.md
 * §6 "Contact / footer"). Rendered inside the `<SectionShell id="contact"
 * as="footer">` ticket 03 already owns (its H2 is the section title),
 * immediately above `<LegalRow>` (ticket 04) — this component renders
 * neither the shell nor the legal row.
 *
 * No email address is ever shown as text: the big button is the
 * `mailto:` link itself (ticket decision), and its key chip
 * (`<Kbd aria-hidden>`) stays out of the accessibility tree the same
 * way the header's and hero's Email buttons already do.
 *
 * The Elsewhere column uses its own `footer.elsewhereGithubLabel`/
 * `elsewhereLinkedinLabel` — not `contact.githubLabel`/`linkedinLabel`,
 * which name the Contact row's logo+label links a few lines above —
 * because the prototype's two rows carry different text ("GitHub
 * profile" vs. bare "GitHub"; carried-over polish, Flame 2026-11-13).
 * Every visitor-facing string still comes from `site.ts`, never
 * hard-coded copy.
 */
export function ContactSection({ site }: { site: SiteContent }) {
  const { contact, footer, sections } = site;
  const sectionLinks = getVisibleSections(site).filter(
    (key): key is Exclude<SectionKey, "contact"> => key !== "contact",
  );

  return (
    <>
      {contact.intro ? (
        <p className="mt-4 max-w-[62ch] text-[18px] leading-[1.5] lg:text-[20px]">
          <PlaceholderText text={contact.intro} />
        </p>
      ) : null}

      <ul className="mt-4 grid gap-4 max-sm:gap-0">
        <li>
          <ProfileLink
            href={contact.github}
            label={contact.githubLabel}
            icon={<GitHubIcon className="size-6" />}
          />
        </li>
        <li>
          <ProfileLink
            href={contact.linkedin}
            label={contact.linkedinLabel}
            icon={<LinkedInIcon className="size-6" />}
          />
        </li>
      </ul>

      <Button
        size="xl"
        className="mt-8 w-full lg:mt-9 sm:w-1/2"
        render={
          <a href={`mailto:${contact.email}`}>
            <span className="min-w-0 flex-1 text-left whitespace-normal">
              {contact.emailLabel}
            </span>
            <Kbd size="xl" aria-hidden="true" className="-mr-1 shrink-0">
              &#8629;
            </Kbd>
          </a>
        }
      />

      <div className="mt-12 sm:mt-16 grid grid-cols-12 gap-x-6 gap-y-6 sm:gap-y-12">
        <p className="col-span-12 max-w-[30ch] text-[18px] leading-[1.25] font-medium tracking-[-0.028em] lg:col-span-6 lg:text-[20px]">
          <PlaceholderText text={footer.lede} />
        </p>
        <div className="col-span-12 grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-10 sm:col-span-6 lg:col-start-7">
          <FooterColumn heading={footer.sectionsHeading}>
            {sectionLinks.map((key) => (
              <li key={key}>
                <FooterColumnLink href={`#${key}`}>
                  {sections[key].title}
                </FooterColumnLink>
              </li>
            ))}
          </FooterColumn>
          <FooterColumn heading={footer.elsewhereHeading}>
            <li>
              <FooterColumnLink href={contact.github}>
                {footer.elsewhereGithubLabel}
              </FooterColumnLink>
            </li>
            <li>
              <FooterColumnLink href={contact.linkedin}>
                {footer.elsewhereLinkedinLabel}
              </FooterColumnLink>
            </li>
          </FooterColumn>
        </div>
      </div>
    </>
  );
}

/** A GitHub/LinkedIn profile link: logo + label, trailing ↗ (it always leaves the site), DESIGN.md §6a "Text links".
 * Carried-over polish (Flame 2026-11-13): this link sits inside the
 * `<footer>`, where the prototype's shared text-link style (CDP-measured
 * `background-size`/`background-image`, motion.css) shows the underline
 * only on hover/focus, not at rest — unlike the (non-footer) Projects
 * card links, whose rest-state underline already matched the build and
 * needed no change. `hover:underline`/`focus-visible:underline` (no
 * base `underline`) reproduces that: no line at rest, one on
 * hover/keyboard focus. */
function ProfileLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex w-fit max-sm:min-h-11 items-center gap-2 rounded-sm text-[14px] font-medium decoration-border-strong underline-offset-4 hover:underline hover:decoration-current focus-visible:underline focus-visible:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Carried-over fix (Flame, 2026-11-13): Chrome draws the <a>'s
       * inherited underline through an inline-block descendant as its
       * own short, independently-positioned line (not a continuation
       * of the label's); `no-underline` on the icon and the glyph
       * stops each from drawing one at all — only the label text
       * itself underlines. */}
      <span className="no-underline">{icon}</span>
      {label}
      <span
        aria-hidden="true"
        className="inline-block no-underline transition-transform duration-150 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
      >
        {"\u2197"}
      </span>
    </a>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-[14px] leading-[1.4] font-medium text-muted-foreground [font-stretch:100%]">
        {heading}
      </h3>
      <ul className="grid gap-3 text-[14px] leading-[1.55] max-sm:gap-0">
        {children}
      </ul>
    </div>
  );
}

/** A Sections/Elsewhere column link: plain text, no arrow glyph (DESIGN.md §6a "footer" row; reviewer round 1 fix 5).
 * Reviewer round 2 fix 2: the prototype draws the underline on
 * `:hover` *and* `:focus-visible` (`motion.css:97`, `.footer ul
 * a:is(:hover, :focus-visible)`), matching `ProfileLink` above —
 * `hover:underline` alone left keyboard focus with no visible line. */
function FooterColumnLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-sm font-normal text-foreground decoration-current hover:underline focus-visible:underline focus-visible:decoration-current max-sm:min-h-11 max-sm:min-w-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  );
}
