import { describe, expect, it } from "vitest";
import { createTokenSet } from "../src/index";

describe("tokens", () => {
  it("creates semantic tokens", () => {
    expect(createTokenSet().color.primary).toBeTruthy();
  });
});
