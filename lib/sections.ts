// Section IDs are stable string keys, NOT display labels
export type SectionId =
  | "identity" | "summary" | "experience" | "skills"
  | "education" | "certifications" | "custom";

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "identity", "summary", "experience", "skills",
  "education", "certifications", "custom",
];

export const SECTION_META: Record<SectionId, { label: string; subtitle: string }> = {
  identity:       { label: "Identity",       subtitle: "Name & contact" },
  summary:        { label: "Summary",        subtitle: "Your professional pitch" },
  experience:     { label: "Experience",     subtitle: "Work history" },
  skills:         { label: "Skills",         subtitle: "Core competencies" },
  education:      { label: "Education",      subtitle: "Degrees & programs" },
  certifications: { label: "Certifications", subtitle: "Credentials & awards" },
  custom:         { label: "Custom",         subtitle: "Additional sections" },
};

// Normalizes on every load: drops unknown ids, appends any missing ids
// (covers legacy résumés, bad data, and future ids), and pins identity first.
export function normalizeSectionOrder(input?: string[]): SectionId[] {
  const valid = (input ?? []).filter(
    (id): id is SectionId => (DEFAULT_SECTION_ORDER as string[]).includes(id)
  );
  const missing = DEFAULT_SECTION_ORDER.filter(id => !valid.includes(id));
  const merged = Array.from(new Set([...valid, ...missing])) as SectionId[];
  return ["identity", ...merged.filter(id => id !== "identity")];
}
