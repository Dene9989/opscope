import { describe, expect, it } from "vitest";
import { parseMovementSearchParams, shouldInitMovement } from "../src/lib/movement";

describe("parseMovementSearchParams", () => {
  it("parses valid search params", () => {
    const params = new URLSearchParams({
      type: "entrega",
      itemId: "item-1",
      projectId: "project-1",
      collaboratorId: "user-1",
      deliveryMovementId: "mov-1"
    });

    const parsed = parseMovementSearchParams(params);

    expect(parsed).toEqual({
      type: "ENTREGA",
      itemId: "item-1",
      projectId: "project-1",
      collaboratorId: "user-1",
      deliveryMovementId: "mov-1"
    });
  });

  it("ignores invalid type", () => {
    const params = new URLSearchParams({ type: "abc", itemId: "item-2" });
    const parsed = parseMovementSearchParams(params);

    expect(parsed.type).toBeUndefined();
    expect(parsed.itemId).toBe("item-2");
  });
});

describe("shouldInitMovement", () => {
  it("does not init when closed", () => {
    const result = shouldInitMovement({ isOpen: false, didInit: false });
    expect(result).toEqual({ shouldInit: false, nextDidInit: false });
  });

  it("inits once when opened", () => {
    const first = shouldInitMovement({ isOpen: true, didInit: false });
    const second = shouldInitMovement({ isOpen: true, didInit: true });

    expect(first).toEqual({ shouldInit: true, nextDidInit: true });
    expect(second).toEqual({ shouldInit: false, nextDidInit: true });
  });
});
