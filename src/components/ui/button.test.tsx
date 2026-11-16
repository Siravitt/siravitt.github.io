import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders an <a href> with no role=button when given render={<a/>}, with no nativeButton warning (carried-over fix, Flame 2026-11-13)", () => {
    render(<Button render={<a href="#x">Go</a>} />);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "#x");
    expect(link).not.toHaveAttribute("role");
    expect(link).not.toHaveAttribute("type");
    expect(link).not.toHaveAttribute("tabindex");
  });

  it("renders a native <button> by default when no render prop is given", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button", { name: "Go" }).tagName).toBe("BUTTON");
  });

  it("strips role/type/tabindex in native mode too, when forced with an explicit nativeButton on a render={<a/>}", () => {
    render(<Button nativeButton render={<a href="#x">Go</a>} />);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).not.toHaveAttribute("role");
    expect(link).not.toHaveAttribute("type");
    expect(link).not.toHaveAttribute("tabindex");
  });
});
