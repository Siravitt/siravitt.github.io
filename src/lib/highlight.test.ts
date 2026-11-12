import { describe, expect, it } from "vitest";
import { splitHighlight } from "@/lib/highlight";

describe("splitHighlight", () => {
  it("splits text around the highlight phrase when it is found", () => {
    expect(
      splitHighlight(
        "Fixture statement with a fixture highlight inside it.",
        "fixture highlight",
      ),
    ).toEqual({
      before: "Fixture statement with a ",
      match: "fixture highlight",
      after: " inside it.",
    });
  });

  it("returns the whole text as `before` with no match when the highlight is undefined", () => {
    expect(splitHighlight("Fixture statement.", undefined)).toEqual({
      before: "Fixture statement.",
      match: null,
      after: "",
    });
  });

  it("returns the whole text as `before` with no match when the highlight isn't in the text", () => {
    expect(splitHighlight("Fixture statement.", "not present")).toEqual({
      before: "Fixture statement.",
      match: null,
      after: "",
    });
  });

  it("matches only the first occurrence when the phrase repeats", () => {
    expect(splitHighlight("go go go", "go")).toEqual({
      before: "",
      match: "go",
      after: " go go",
    });
  });
});
