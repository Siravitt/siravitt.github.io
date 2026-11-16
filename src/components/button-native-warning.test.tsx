import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { HomeView } from "@/components/home-view";
import { NotFoundView } from "@/components/not-found-view";
import { PrivacyView } from "@/components/privacy-view";
import { siteFixture } from "@/test/fixtures/site";

/**
 * Carried-over fix (Flame, 2026-11-13): every Button on the site
 * renders as a link via `render={<a/>}`; Base UI's `nativeButton`
 * defaults to `true`, which warned on every one of them
 * ("A component that acts as a button expected a native <button>
 * because the `nativeButton` prop is true..."). Fixed in
 * `ui/button.tsx`; this seam asserts the warning is gone from the
 * three views that render every Button variant on the site.
 */
describe("Base UI's nativeButton warning", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["HomeView", <HomeView key="home" site={siteFixture} />],
    ["PrivacyView", <PrivacyView key="privacy" site={siteFixture} />],
    ["NotFoundView", <NotFoundView key="404" site={siteFixture} />],
  ])("logs no nativeButton warning when rendering %s", (_name, element) => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(element);

    const allCalls = [...errorSpy.mock.calls, ...warnSpy.mock.calls];
    const nativeButtonCalls = allCalls.filter((args) =>
      args.some(
        (arg) => typeof arg === "string" && arg.includes("nativeButton"),
      ),
    );
    expect(nativeButtonCalls).toEqual([]);
  });
});
