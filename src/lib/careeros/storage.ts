import type { CareerOSState, CareerProfile, CareerLevel } from "./types";
import { normalizeCareerLevel } from "./types";

export const CAREEROS_STORAGE_KEY = "powerdesk-careeros-state";

const DEFAULT_PROFILE: CareerProfile = {
  name: "",
  headline: "",
  level: "junior",
  skills: [],
  resumeText: "",
  coverLetterText: "",
  yearsExperience: 1,
  careerDNA: null,
  structuredResume: null,
  resumeTemplate: "classic",
};

export const DEFAULT_CAREEROS_STATE: CareerOSState = {
  profile: DEFAULT_PROFILE,
  applications: [],
  reminders: [],
  growthPlan: null,
};

function migrateProfile(raw: Partial<CareerProfile>): CareerProfile {
  return {
    ...DEFAULT_PROFILE,
    ...raw,
    level: normalizeCareerLevel(String(raw.level ?? "junior")),
    coverLetterText: raw.coverLetterText ?? "",
    careerDNA: raw.careerDNA
      ? {
          ...raw.careerDNA,
          careerLevel: normalizeCareerLevel(raw.careerDNA.careerLevel) as CareerLevel,
        }
      : null,
    structuredResume: raw.structuredResume ?? null,
    resumeTemplate: raw.resumeTemplate ?? "classic",
  };
}

export function loadCareerOSState(): CareerOSState {
  if (typeof window === "undefined") return DEFAULT_CAREEROS_STATE;

  try {
    const raw = localStorage.getItem(CAREEROS_STORAGE_KEY);
    if (!raw) return DEFAULT_CAREEROS_STATE;
    const parsed = JSON.parse(raw) as CareerOSState;
    return {
      profile: migrateProfile(parsed.profile ?? {}),
      applications: parsed.applications ?? [],
      reminders: parsed.reminders ?? [],
      growthPlan: parsed.growthPlan ?? null,
    };
  } catch {
    return DEFAULT_CAREEROS_STATE;
  }
}

export function saveCareerOSState(state: CareerOSState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAREEROS_STORAGE_KEY, JSON.stringify(state));
}
