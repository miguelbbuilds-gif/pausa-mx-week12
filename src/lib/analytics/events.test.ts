import { describe, expect, it } from "vitest";
import { detailForField, parseProductEvent } from "./events";

const sessionId = "a1b2c3d4e5f67890abcd";

describe("parseProductEvent", () => {
  it("accepts an allowlisted event without amounts", () => {
    const parsed = parseProductEvent({
      sessionId,
      event: "comparison_viewed",
      detail: "full",
    });
    expect(parsed).toEqual({
      ok: true,
      value: { sessionId, event: "comparison_viewed", detail: "full" },
    });
  });

  it("rejects amounts, emails, and unknown fields", () => {
    expect(
      parseProductEvent({
        sessionId,
        event: "comparison_viewed",
        detail: "2500.00",
      }).ok,
    ).toBe(false);
    expect(
      parseProductEvent({
        sessionId,
        event: "evaluation_started",
        email: "person@example.com",
      }).ok,
    ).toBe(false);
    expect(
      parseProductEvent({
        sessionId,
        event: "save_attempted",
        availableMoney: 10000,
      }).ok,
    ).toBe(false);
    expect(
      parseProductEvent({
        sessionId,
        event: "password_reset",
      }).ok,
    ).toBe(false);
  });

  it("maps form fields to detail codes", () => {
    expect(detailForField("purchasePrice")).toBe("purchaseprice");
    expect(detailForField("unknown")).toBe("form");
  });

  it("accepts distribution events and rejects amounts or identity", () => {
    expect(
      parseProductEvent({
        sessionId,
        event: "launch_viewed",
        detail: "launch",
      }).ok,
    ).toBe(true);
    expect(
      parseProductEvent({
        sessionId,
        event: "asset_viewed",
        detail: "carousel",
      }).ok,
    ).toBe(true);
    expect(
      parseProductEvent({
        sessionId,
        event: "product_cta_clicked",
        detail: "product",
      }).ok,
    ).toBe(true);
    expect(
      parseProductEvent({
        sessionId,
        event: "share_clicked",
        detail: "copy_link",
      }).ok,
    ).toBe(true);
    expect(
      parseProductEvent({
        sessionId,
        event: "content_series_viewed",
        detail: "antes_de_comprar",
      }).ok,
    ).toBe(true);
    expect(
      parseProductEvent({
        sessionId,
        event: "launch_viewed",
        detail: "12000",
      }).ok,
    ).toBe(false);
    expect(
      parseProductEvent({
        sessionId,
        event: "share_clicked",
        email: "person@example.com",
      }).ok,
    ).toBe(false);
    expect(
      parseProductEvent({
        sessionId,
        event: "asset_viewed",
        name: "Miguel",
      }).ok,
    ).toBe(false);
  });
});
