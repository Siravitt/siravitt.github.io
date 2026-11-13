import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { ScrollMotion } from "@/components/scroll-motion";

/** A minimal fake, just enough to drive the component's one callback by hand. */
class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observed: Element[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.observed.push(target);
  }
  unobserve(target: Element) {
    this.observed = this.observed.filter((el) => el !== target);
  }
  disconnect() {
    this.observed = [];
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

function stubReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduce") ? reduced : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function stubNativeTimelineSupport(supported: boolean) {
  (
    window as unknown as { CSS: { supports: (feature: string) => boolean } }
  ).CSS = { supports: vi.fn().mockReturnValue(supported) };
}

function stubRequestAnimationFrame() {
  window.requestAnimationFrame = vi
    .fn()
    .mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
}

/** Every test starts from "the fallback should run": motion allowed, no native support, IO present. */
function stubFallbackEligible() {
  stubReducedMotion(false);
  stubNativeTimelineSupport(false);
  window.IntersectionObserver =
    FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  stubRequestAnimationFrame();
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
  stubFallbackEligible();
  window.location.hash = "";
});

afterEach(() => {
  document.documentElement.classList.remove("sm-io");
  vi.restoreAllMocks();
});

describe("ScrollMotion", () => {
  it("renders nothing", () => {
    const { container } = render(<ScrollMotion />);
    expect(container.firstChild).toBeNull();
  });

  it("clicking a link to #projects moves focus, one frame later, to #projects with tabindex=-1 and preventScroll", () => {
    const section = document.createElement("section");
    section.id = "projects";
    document.body.appendChild(section);
    const link = document.createElement("a");
    link.href = "#projects";
    document.body.appendChild(link);
    const focusSpy = vi.spyOn(section, "focus");

    render(<ScrollMotion />);
    fireEvent.click(link);

    expect(section).toHaveAttribute("tabindex", "-1");
    expect(document.activeElement).toBe(section);
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

    section.remove();
    link.remove();
  });

  it("a hashchange to #experience moves focus to that section", () => {
    const section = document.createElement("section");
    section.id = "experience";
    document.body.appendChild(section);

    render(<ScrollMotion />);
    window.location.hash = "#experience";
    fireEvent(window, new Event("hashchange"));

    expect(document.activeElement).toBe(section);
    section.remove();
  });

  it("a modified click, a non-left click, or an already-prevented click does not move focus", () => {
    const section = document.createElement("section");
    section.id = "projects";
    document.body.appendChild(section);
    const link = document.createElement("a");
    link.href = "#projects";
    document.body.appendChild(link);
    document.body.focus();

    render(<ScrollMotion />);

    fireEvent.click(link, { ctrlKey: true });
    expect(document.activeElement).not.toBe(section);
    fireEvent.click(link, { metaKey: true });
    expect(document.activeElement).not.toBe(section);
    fireEvent.click(link, { shiftKey: true });
    expect(document.activeElement).not.toBe(section);
    fireEvent.click(link, { altKey: true });
    expect(document.activeElement).not.toBe(section);
    fireEvent.click(link, { button: 1 });
    expect(document.activeElement).not.toBe(section);

    const preventedLink = document.createElement("a");
    preventedLink.href = "#projects";
    preventedLink.addEventListener("click", (e) => e.preventDefault());
    document.body.appendChild(preventedLink);
    fireEvent.click(preventedLink);
    expect(document.activeElement).not.toBe(section);

    section.remove();
    link.remove();
    preventedLink.remove();
  });

  it("a hash naming no element does nothing and throws nothing", () => {
    const link = document.createElement("a");
    link.href = "#does-not-exist";
    document.body.appendChild(link);

    render(<ScrollMotion />);
    expect(() => fireEvent.click(link)).not.toThrow();

    link.remove();
  });

  it("with reduced motion, focus handling still works and sm-io is not added", () => {
    stubReducedMotion(true);
    const section = document.createElement("section");
    section.id = "projects";
    document.body.appendChild(section);
    const link = document.createElement("a");
    link.href = "#projects";
    document.body.appendChild(link);

    render(<ScrollMotion />);
    fireEvent.click(link);

    expect(document.activeElement).toBe(section);
    expect(document.documentElement).not.toHaveClass("sm-io");

    section.remove();
    link.remove();
  });

  it("when both CSS.supports checks are true, sm-io is not added and no observer is created", () => {
    stubNativeTimelineSupport(true);
    render(<ScrollMotion />);

    expect(document.documentElement).not.toHaveClass("sm-io");
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("when CSS.supports is false, sm-io is added and every [data-rv] block plus the stack board is observed", () => {
    const rv1 = document.createElement("div");
    rv1.setAttribute("data-rv", "");
    const rv2 = document.createElement("div");
    rv2.setAttribute("data-rv", "");
    const board = document.createElement("div");
    board.setAttribute("data-stack-board", "");
    document.body.append(rv1, rv2, board);

    render(<ScrollMotion />);

    expect(document.documentElement).toHaveClass("sm-io");
    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    const observed = FakeIntersectionObserver.instances[0].observed;
    expect(observed).toContain(rv1);
    expect(observed).toContain(rv2);
    expect(observed).toContain(board);

    rv1.remove();
    rv2.remove();
    board.remove();
  });

  it("when IntersectionObserver is missing, the fallback does not run (no sm-io)", () => {
    // @ts-expect-error -- simulating a browser without IntersectionObserver
    delete window.IntersectionObserver;

    render(<ScrollMotion />);

    expect(document.documentElement).not.toHaveClass("sm-io");
  });

  it("Review Focus 5: a block whose top is already above the viewport gets is-in at once, even though it isn't intersecting", () => {
    const rv = document.createElement("div");
    rv.setAttribute("data-rv", "");
    document.body.appendChild(rv);

    render(<ScrollMotion />);
    const observer = FakeIntersectionObserver.instances[0];

    act(() => {
      observer.callback(
        [
          {
            target: rv,
            isIntersecting: false,
            boundingClientRect: { top: -50 } as DOMRectReadOnly,
            intersectionRatio: 0,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: 0,
          },
        ],
        observer,
      );
    });

    expect(rv).toHaveClass("is-in");
    rv.remove();
  });

  it("tapping an in-page link closes the header's open menu (nav is a sibling of <details>, not a DOM descendant — header.tsx's group-has-[details[open]] CSS trick)", () => {
    const header = document.createElement("header");
    const details = document.createElement("details");
    details.open = true;
    header.appendChild(details);
    const link = document.createElement("a");
    link.href = "#about";
    header.appendChild(link);
    document.body.appendChild(header);

    render(<ScrollMotion />);
    fireEvent.click(link);

    expect(details.open).toBe(false);
    header.remove();
  });

  it("a tap on a link outside any header leaves an open details elsewhere untouched", () => {
    const details = document.createElement("details");
    details.open = true;
    document.body.appendChild(details);
    const link = document.createElement("a");
    link.href = "#about";
    document.body.appendChild(link);

    render(<ScrollMotion />);
    fireEvent.click(link);

    expect(details.open).toBe(true);
    details.remove();
    link.remove();
  });

  it("unmounting removes sm-io, disconnects the observer and removes the listeners (a later click focuses nothing)", () => {
    const section = document.createElement("section");
    section.id = "projects";
    document.body.appendChild(section);
    const link = document.createElement("a");
    link.href = "#projects";
    document.body.appendChild(link);

    const { unmount } = render(<ScrollMotion />);
    expect(document.documentElement).toHaveClass("sm-io");
    const observer = FakeIntersectionObserver.instances[0];
    const disconnectSpy = vi.spyOn(observer, "disconnect");

    unmount();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(document.documentElement).not.toHaveClass("sm-io");

    document.body.focus();
    fireEvent.click(link);
    expect(document.activeElement).not.toBe(section);

    section.remove();
    link.remove();
  });
});
