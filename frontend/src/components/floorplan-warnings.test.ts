// @vitest-environment jsdom
import { render } from "lit";
import { describe, it, expect, vi } from "vitest";
import { createLocalizer } from "../lib/i18n";
import type { ConfigDiagnostic } from "../lib/config-diagnostics";
import { renderWarningBadge, renderWarningCenter } from "./floorplan-warnings";
describe("warning center", () => {
  const t = createLocalizer("de");
  const actions = { onClose: vi.fn(), onToggle: vi.fn(), onSelectDiagnostic: vi.fn() };
  it("sorts errors first and jumps to the diagnostic shown", () => {
    const host = document.createElement("div");
    const warning: ConfigDiagnostic = {
      id: "1",
      category: "unbound_area",
      severity: "warning",
      messageKey: "diagnostics.unbound_area",
      params: { targetId: "room" },
      targetId: "room",
      planName: "Haus",
    };
    const error: ConfigDiagnostic = {
      ...warning,
      id: "2",
      category: "missing_entity",
      severity: "error",
      messageKey: "diagnostics.missing_entity",
      params: { entityId: "light.test" },
    };
    render(renderWarningCenter([warning, error], true, actions, t), host);
    expect(host.querySelector("li")?.textContent).toContain("Entität light.test fehlt.");
    expect(host.querySelector("li small")?.textContent).toContain("Haus");
    host.querySelector<HTMLButtonElement>("li button")!.click();
    expect(actions.onSelectDiagnostic).toHaveBeenCalledWith(error);
    host.querySelector<HTMLButtonElement>("header button")!.click();
    expect(actions.onClose).toHaveBeenCalled();
  });
  it("exposes badge state and the empty list", () => {
    const host = document.createElement("div");
    render(renderWarningBadge(0, 0, false, actions.onToggle, t), host);
    const badge = host.querySelector("button")!;
    expect(badge.textContent).toContain("Warnungen (0)");
    expect(badge.getAttribute("aria-expanded")).toBe("false");
    badge.click();
    expect(actions.onToggle).toHaveBeenCalled();
    render(renderWarningCenter([], true, actions, t), host);
    expect(host.textContent).toContain("Keine Konfigurationswarnungen.");
    render(renderWarningCenter([], false, actions, t), host);
    expect(host.querySelector("section")).toBeNull();
  });
});
