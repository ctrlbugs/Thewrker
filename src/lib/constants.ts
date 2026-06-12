import { BRAND } from "./brand";

export const USER_PROFILE = {
  name: BRAND.name,
  role: "Workspace",
  avatar: BRAND.logoIcon,
} as const;

export const TAGLINE = BRAND.heroTagline;
export const VISION = BRAND.heroVision;
