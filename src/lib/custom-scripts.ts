export type ScriptPlacement = "header" | "footer";

export type CustomScript = {
  id: string;
  name: string;
  placement: ScriptPlacement;
  enabled: boolean;
  code: string;
};

export function createEmptyScript(
  placement: ScriptPlacement = "header"
): CustomScript {
  return {
    id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    placement,
    enabled: true,
    code: "",
  };
}

/** Merge older single header/footer fields into the script list once. */
export function normalizeCustomScripts(settings: {
  customScripts?: CustomScript[] | null;
  headerCode?: string | null;
  footerCode?: string | null;
}): CustomScript[] {
  const existing = Array.isArray(settings.customScripts)
    ? settings.customScripts
    : [];
  if (existing.length > 0) {
    return existing.map((script) => ({
      id: script.id || createEmptyScript().id,
      name: script.name || "",
      placement: script.placement === "footer" ? "footer" : "header",
      enabled: script.enabled !== false,
      code: script.code || "",
    }));
  }

  const migrated: CustomScript[] = [];
  if (settings.headerCode?.trim()) {
    migrated.push({
      id: "legacy_header",
      name: "Header Scripts",
      placement: "header",
      enabled: true,
      code: settings.headerCode,
    });
  }
  if (settings.footerCode?.trim()) {
    migrated.push({
      id: "legacy_footer",
      name: "Footer Scripts",
      placement: "footer",
      enabled: true,
      code: settings.footerCode,
    });
  }
  return migrated;
}

export function splitScriptsByPlacement(scripts: CustomScript[]): {
  header: string;
  footer: string;
} {
  const enabled = scripts.filter((script) => script.enabled && script.code?.trim());
  return {
    header: enabled
      .filter((script) => script.placement === "header")
      .map((script) => script.code.trim())
      .join("\n"),
    footer: enabled
      .filter((script) => script.placement === "footer")
      .map((script) => script.code.trim())
      .join("\n"),
  };
}
