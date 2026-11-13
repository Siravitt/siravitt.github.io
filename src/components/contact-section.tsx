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
 * The Elsewhere column reuses `contact.githubLabel`/`linkedinLabel` —
 * not the prototype's bare "GitHub"/"LinkedIn" words — because every
 * visitor-facing string must come from `site.ts` (card's "Must keep");
 * the prototype's own markup is static sample text throughout, not
 * bound to the content file.
 */
export function ContactSection({ site }: { site: SiteContent }) {
  const { contact, footer, sections } = site;
  const sectionLinks = getVisibleSections(site).filter(
    (key): key is Exclude<SectionKey, "contact"> => key !== "contact",
  );

  return (
    <>
      {contact.intro ? (
        <p className="mt-4 max-w-[62ch] text-[18px] leading-[1.6] lg:text-[20px]">
          <PlaceholderText text={contact.intro} />
        </p>
      ) : null}

      <ul className="mt-4 grid gap-4 max-sm:gap-0">
        <li>
          <ProfileLink
            href={contact.github}
            label={contact.githubLabel}
            icon={<GitHubIcon className="size-5" />}
          />
        </li>
        <li>
          <ProfileLink
            href={contact.linkedin}
            label={contact.linkedinLabel}
            icon={<LinkedInIcon className="size-5" />}
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

      <div className="mt-12 grid gap-y-6 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <p className="max-w-[30ch] text-[18px] leading-[1.25] font-medium tracking-[-0.028em] lg:col-span-6 lg:text-[20px]">
          <PlaceholderText text={footer.lede} />
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-6 lg:col-start-7">
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
                {contact.githubLabel}
              </FooterColumnLink>
            </li>
            <li>
              <FooterColumnLink href={contact.linkedin}>
                {contact.linkedinLabel}
              </FooterColumnLink>
            </li>
          </FooterColumn>
        </div>
      </div>
    </>
  );
}

/** A GitHub/LinkedIn profile link: logo + label, trailing ↗ (it always leaves the site), DESIGN.md §6a "Text links". */
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
      className="group inline-flex w-fit max-sm:min-h-11 items-center gap-2 rounded-sm text-[14px] font-medium underline decoration-border-strong underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {icon}
      {label}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
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
      <ul className="grid gap-3 text-[14px] max-sm:gap-0">{children}</ul>
    </div>
  );
}

/** A Sections/Elsewhere column link: plain text, no arrow glyph (DESIGN.md §6a "footer" row; reviewer round 1 fix 5). */
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
      className="inline-flex items-center rounded-sm font-normal text-foreground hover:underline max-sm:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  );
}
