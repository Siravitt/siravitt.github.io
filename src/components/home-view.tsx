import type { SiteContent } from "@/content/site";
import { AboutSection } from "@/components/about-section";
import { Header } from "@/components/header";
import { HeroArt } from "@/components/hero-art";
import { HeroFacts } from "@/components/hero-facts";
import { LegalRow } from "@/components/legal-row";
import { PlaceholderText } from "@/components/placeholder-text";
import { SectionShell } from "@/components/section-shell";
import { StackSection } from "@/components/stack-section";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { getVisibleSections } from "@/lib/sections";

/**
 * The home page view. Presentational: it takes the content as a prop and
 * renders it, nothing else (ticket 01 decision: this prop boundary is
 * Seam A — the agreed test seam for view-rendering tests).
 *
 * Ticket 03 adds the page skeleton (header, nav, section shells); it
 * renders the hero's text column only (the thin slice ticket 01 proved
 * end to end) and, per ticket 03's decision, a shell + H2 for each of
 * about/stack/projects/experience/contact — their bodies are tickets
 * 06 (hero), 07, 08, 11 and 12. `getVisibleSections` decides which of
 * the five show, and both the nav and the shells read the same list so
 * they never disagree.
 */
export function HomeView({ site }: { site: SiteContent }) {
  const visibleSections = getVisibleSections(site);
  const isVisible = (key: (typeof visibleSections)[number]) =>
    visibleSections.includes(key);

  return (
    <>
      <Header site={site} visibleSections={visibleSections} />
      <main
        id="top"
        tabIndex={-1}
        className="scroll-mt-18 outline-none max-sm:scroll-mt-14 focus-visible:shadow-[inset_2px_0_0_var(--ring)]"
      >
        <section
          aria-labelledby="hero-h"
          className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-6 py-24 max-sm:px-4 lg:grid-cols-[5fr_6fr]"
        >
          <div className="min-w-0 lg:flex lg:flex-col">
            <p className="mb-6 text-[14px] leading-[1.5] font-medium">
              <PlaceholderText text={site.person.role} />
            </p>
            <h1
              id="hero-h"
              className="text-[length:clamp(38px,3.24vw+25.4px,72px)] leading-[1.02] font-medium tracking-[-0.036em] [font-stretch:96%]"
            >
              {site.person.name}
            </h1>
            <p className="mt-6 max-w-[42ch] text-[18px] leading-[1.6] font-normal lg:text-[20px]">
              <PlaceholderText text={site.person.pitch} />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 max-sm:flex-col max-sm:items-stretch">
              <Button
                className="w-full sm:w-auto"
                render={
                  <a href={`mailto:${site.contact.email}`}>
                    {site.contact.emailLabel}
                    <Kbd aria-hidden="true">&#8629;</Kbd>
                  </a>
                }
              />
              {isVisible("projects") && (
                <Button
                  variant="secondary"
                  className="max-sm:w-full max-sm:justify-center max-sm:border-transparent max-sm:bg-transparent max-sm:text-foreground max-sm:underline max-sm:decoration-border-strong max-sm:underline-offset-4 max-sm:shadow-none max-sm:before:hidden max-sm:hover:bg-transparent"
                  render={
                    <a href="#projects">
                      {site.hero.secondaryLabel}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 2v9M3.5 7.5 7 11l3.5-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  }
                />
              )}
            </div>
            <HeroFacts site={site} />
          </div>
          <div className="min-w-0">
            <HeroArt site={site} />
          </div>
        </section>

        <SectionShell
          id="about"
          title={site.sections.about.title}
          headingClassName="mb-8 text-[13px] leading-[1.4] font-medium text-muted-foreground"
        >
          <AboutSection site={site} />
        </SectionShell>

        {isVisible("stack") && (
          <SectionShell
            id="stack"
            title={site.sections.stack.title}
            renderHeading={false}
          >
            {(headingId) => <StackSection site={site} headingId={headingId} />}
          </SectionShell>
        )}

        {isVisible("projects") && (
          <SectionShell
            id="projects"
            title={site.sections.projects.title}
            tagline={site.sections.projects.tagline}
          />
        )}

        {isVisible("experience") && (
          <SectionShell
            id="experience"
            title={site.sections.experience.title}
            tagline={site.sections.experience.tagline}
          />
        )}
      </main>

      <SectionShell
        id="contact"
        title={site.sections.contact.title}
        as="footer"
      >
        <LegalRow site={site} />
      </SectionShell>
    </>
  );
}
