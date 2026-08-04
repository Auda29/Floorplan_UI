import { describe, expect, it } from "vitest";
import { createLocalizer } from "./i18n";

describe("i18n", () => {
  it("uses German for Home Assistant German locales", () => {
    const t = createLocalizer("de-DE");
    expect(t("panel.edit")).toBe("Bearbeiten");
    expect(t("editor.title")).toBe("Grundriss bearbeiten");
    expect(t("editor.planView")).toBe("Plan und Ansichten");
    expect(t("editor.viewOverlay")).toBe("Ansicht und Overlays");
    expect(t("panel.changesSaved")).toBe("Änderungen gespeichert.");
    expect(t("dialog.cancel")).toBe("Abbrechen");
    expect(t("dialog.importMessage", { plans: 2, views: 3 })).toBe(
      "2 Plan/Pläne und 3 Ansicht(en) importieren?"
    );
    expect(t("panel.planNamed", { name: "Erdgeschoss" })).toBe("Plan „Erdgeschoss“");
  });

  it("falls back to English for unknown languages and keys", () => {
    const t = createLocalizer("fr");
    expect(t("panel.edit")).toBe("Edit");
    expect(t("unknown.key" as never)).toBe("unknown.key");
  });
});
