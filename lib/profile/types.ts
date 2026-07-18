export type ProfileAvailability = "available" | "busy" | "open_to_work" | "away";

export interface SocialLinks {
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  website?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  headline: string;
  location: string;
  roleLabel: string;
  availability: ProfileAvailability;
  verified: boolean;
  avatarUrl?: string;
  /** Custom cover photo (data URL or remote). Default = brand gradient */
  coverUrl?: string;
  coverGradient?: string;
  joinedAt: string;
  followers: string[];
  following: string[];
  listingCount: number;
  social: SocialLinks;
  isOwn?: boolean;
}

export function displayName(p: Pick<UserProfile, "firstName" | "lastName">) {
  return `${p.firstName} ${p.lastName}`.trim();
}

export function normalizeUsername(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);
}
