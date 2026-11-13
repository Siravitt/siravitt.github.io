import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { ExperienceSection } from "@/components/experience-section";
import { Header } from "@/components/header";
import { HeroArt } from "@/components/hero-art";
import { HeroFacts } from "@/components/hero-facts";
import { LegalRow } from "@/components/legal-row";
import { PlaceholderText } from "@/components/placeholder-text";
import { ProjectsSection } from "@/components/projects-section";
import {
  DEFAULT_HEADING_CLASSNAME,
  SectionShell,
} from "@/components/section-shell";
import { StackSection } from "@/components/stack-section";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { SiteContent } from "@/content/site";
import { CONTAINER_CLASSNAME } from "@/lib/layout";
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
          data-hero
          className={`${CONTAINER_CLASSNAME} grid gap-x-12 gap-y-10 py-24 lg:grid-cols-[5fr_6fr]`}
        >
          <div data-hero-text className="min-w-0 lg:flex lg:flex-col">
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
            className="bg-card"
            headingClassName={`${DEFAULT_HEADING_CLASSNAME} mb-8 sm:mb-12`}
          >
            <ProjectsSection site={site} />
          </SectionShell>
        )}

        {isVisible("experience") && (
          <SectionShell id="experience" title={site.sections.experience.title}>
            <ExperienceSection site={site} />
          </SectionShell>
        )}
      </main>

      <SectionShell
        id="contact"
        title={site.sections.contact.title}
        as="footer"
        className="border-t border-border bg-[color-mix(in_oklab,var(--background)_72%,#000)]"
      >
        <ContactSection site={site} />
        <LegalRow site={site} className="mt-6 sm:mt-12" />
      </SectionShell>
    </>
  );
}
