"use client";

import { recordProductEvent } from "@/app/actions/telemetry";
import type { DetailCode, ProductEventName } from "./events";
import { getAnonymousSessionId } from "./session";

export function trackProductEvent(
  event: ProductEventName,
  detail?: DetailCode | null,
) {
  const sessionId = getAnonymousSessionId();
  if (!sessionId) return;
  void recordProductEvent({
    sessionId,
    event,
    detail: detail ?? null,
  }).catch(() => {
    // A failed event must not block the comparison.
  });
}
