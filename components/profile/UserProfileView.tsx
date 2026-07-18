"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Camera,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { CURRENT_USER_ID } from "@/lib/profile/seed";
import {
  getCurrentProfile,
  getProfileByUsername,
  isFollowing,
  toggleFollow,
  updateCurrentProfile,
} from "@/lib/profile/store";
import {
  displayName,
  normalizeUsername,
  type ProfileAvailability,
  type UserProfile,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";
import "@/app/profile.css";

type Props = {
  /** When set, show that username; otherwise current user */
  username?: string;
  showBack?: boolean;
  allowEdit?: boolean;
};

const STATUS_LABEL: Record<ProfileAvailability, string> = {
  available: "available",
  open_to_work: "open to work",
  busy: "busy",
  away: "away",
};

function formatJoined(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function UserProfileView({
  username,
  showBack = true,
  allowEdit = false,
}: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [following, setFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<UserProfile>>({});
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const readImageFile = (file: File | undefined | null): Promise<string | null> =>
    new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/")) {
        resolve(null);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        alert("Image must be 4 MB or smaller.");
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

  const onCoverPick = async (file?: File | null) => {
    const dataUrl = await readImageFile(file);
    if (!dataUrl) return;
    setProfile(updateCurrentProfile({ coverUrl: dataUrl }));
  };

  const onAvatarPick = async (file?: File | null) => {
    const dataUrl = await readImageFile(file);
    if (!dataUrl) return;
    updateCurrentProfile({ avatarUrl: dataUrl });
    refresh(username);
  };

  const clearCover = () => {
    const updated = updateCurrentProfile({ coverUrl: "" });
    setProfile(updated);
  };

  const refresh = (uname?: string) => {
    const p = uname
      ? getProfileByUsername(uname)
      : getCurrentProfile();
    setProfile(p);
    if (p) {
      setFollowing(isFollowing(CURRENT_USER_ID, p.id));
      setDraft({
        firstName: p.firstName,
        lastName: p.lastName,
        username: p.username,
        bio: p.bio,
        headline: p.headline,
        location: p.location,
        roleLabel: p.roleLabel,
        availability: p.availability,
      });
    }
  };

  useEffect(() => {
    refresh(username);
  }, [username]);

  useEffect(() => {
    if (!editing) return;
    const panel = document.getElementById("up-edit-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [editing]);

  if (!profile) {
    return (
      <div className="up-root mx-auto max-w-xl px-4 py-16 text-center">
        <UserRound className="mx-auto mb-3 h-10 w-10 text-[#94a3b8]" />
        <h1 className="text-xl font-bold text-[#21386B]">Profile not found</h1>
        <p className="mt-2 text-sm text-[#64748b]">
          No user matches @{normalizeUsername(username || "")}. Try another
          username.
        </p>
        <Link
          href="/dashboard/talent/profile"
          className="up-follow-btn mt-6 inline-flex"
        >
          Back to your profile
        </Link>
      </div>
    );
  }

  const own = profile.id === CURRENT_USER_ID;
  const canEdit = allowEdit && own;

  const onFollow = () => {
    toggleFollow(profile.id);
    refresh(profile.username);
  };

  const onSave = () => {
    const nextUser = normalizeUsername(draft.username || profile.username);
    const updated = updateCurrentProfile({
      firstName: (draft.firstName ?? profile.firstName).trim() || profile.firstName,
      lastName: (draft.lastName ?? profile.lastName).trim() || profile.lastName,
      username: nextUser,
      bio: draft.bio ?? profile.bio,
      headline: draft.headline ?? profile.headline,
      location: draft.location ?? profile.location,
      roleLabel: draft.roleLabel ?? profile.roleLabel,
      availability:
        (draft.availability as ProfileAvailability) ?? profile.availability,
    });
    setProfile(updated);
    setFollowing(isFollowing(CURRENT_USER_ID, updated.id));
    setDraft({
      firstName: updated.firstName,
      lastName: updated.lastName,
      username: updated.username,
      bio: updated.bio,
      headline: updated.headline,
      location: updated.location,
      roleLabel: updated.roleLabel,
      availability: updated.availability,
    });
    setEditing(false);
    if (username && updated.username !== username) {
      router.replace(`/u/${updated.username}`);
    }
  };

  const hasCover = Boolean(profile.coverUrl);

  return (
    <div className="up-root space-y-0">
      <article className="up-shell">
        <div
          className={cn("up-banner", hasCover && "is-photo")}
          style={
            hasCover
              ? { backgroundImage: `url(${profile.coverUrl})` }
              : undefined
          }
        >
          {showBack && (
            <button
              type="button"
              className="up-banner-back"
              onClick={() => router.back()}
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="up-banner-logo" aria-hidden>
            <Image
              src="/logo/logo-white.png"
              alt=""
              width={804}
              height={183}
              priority
            />
          </div>

          {canEdit && (
            <>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void onCoverPick(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <div className="up-banner-tools">
                {hasCover && (
                  <button
                    type="button"
                    className="up-banner-upload"
                    onClick={clearCover}
                    aria-label="Reset cover to default gradient"
                    title="Reset to default cover"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
                <button
                  type="button"
                  className="up-banner-upload"
                  onClick={() => coverInputRef.current?.click()}
                  aria-label={hasCover ? "Change cover photo" : "Upload cover photo"}
                  title={hasCover ? "Change cover" : "Upload cover"}
                >
                  <Camera className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="up-body">
          <div className="up-avatar-wrap">
            <div className="up-avatar">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" />
              ) : (
                <UserRound className="h-12 w-12" strokeWidth={1.5} />
              )}
              {canEdit && (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      void onAvatarPick(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    className="up-avatar-upload"
                    onClick={() => avatarInputRef.current?.click()}
                    aria-label="Upload photo"
                    title="Upload photo"
                  >
                    <Camera className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="up-toolbar">
            <a
              href={`mailto:${profile.email}`}
              className="up-icon-btn"
              aria-label="Message"
            >
              <Mail className="h-4 w-4" />
            </a>
            {canEdit && (
              <button
                type="button"
                className={cn("up-icon-btn", editing && "is-active")}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditing((v) => !v);
                }}
                aria-label={editing ? "Close edit" : "Edit profile"}
                title={editing ? "Close edit" : "Edit profile"}
                aria-expanded={editing}
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              className={cn(
                "up-follow-btn",
                following && !own && "is-following"
              )}
              onClick={() => {
                if (own) {
                  const url = `${window.location.origin}/u/${profile.username}`;
                  void navigator.clipboard?.writeText(url);
                  return;
                }
                onFollow();
              }}
              title={
                own
                  ? "Copy your profile link — others can follow you"
                  : following
                    ? "Unfollow"
                    : "Follow"
              }
            >
              {own ? "Follow" : following ? "Following" : "Follow"}
            </button>
          </div>

          <div className="up-identity">
            <div className="up-name-row">
              <h1 className="up-name">{displayName(profile)}</h1>
              {profile.verified && (
                <span className="up-verified">
                  <BadgeCheck aria-hidden />
                  Verified
                </span>
              )}
            </div>

            <p className="up-handle">
              <Link
                href={`/u/${profile.username}`}
                className="font-semibold text-[#21386B] hover:text-[#76BEC5]"
              >
                @{profile.username}
              </Link>
              {profile.headline ? ` · ${profile.headline}` : ""}
            </p>

            {profile.bio && <p className="up-bio">{profile.bio}</p>}

            <div className="up-meta">
              <span
                className={cn(
                  "up-status",
                  `up-status--${profile.availability}`
                )}
              >
                {STATUS_LABEL[profile.availability]}
              </span>
              {profile.roleLabel && (
                <span className="up-meta-item">{profile.roleLabel}</span>
              )}
              {profile.location && (
                <span className="up-meta-item">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              <span className="up-meta-item">
                <CalendarDays className="h-3.5 w-3.5" />
                Joined {formatJoined(profile.joinedAt)}
              </span>
            </div>

            <div className="up-stats">
              <p>
                <strong>{profile.followers.length}</strong>{" "}
                <span>Followers</span>
              </p>
              <p>
                <strong>{profile.following.length}</strong>{" "}
                <span>Following</span>
              </p>
              <p>
                <strong>{profile.listingCount}</strong>{" "}
                <span>Listings</span>
              </p>
            </div>

            <div className="up-social">
              {profile.social.instagram && (
                <a
                  href={profile.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {profile.social.linkedIn && (
                <a
                  href={profile.social.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.social.facebook && (
                <a
                  href={profile.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {profile.social.github && (
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>

      {canEdit && editing && (
        <section id="up-edit-panel" className="up-edit-panel">
          <h2 className="up-discover-title">Edit profile</h2>
          <div className="up-edit-grid">
            <label className="up-edit-field">
              First name
              <input
                value={draft.firstName ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, firstName: e.target.value }))
                }
              />
            </label>
            <label className="up-edit-field">
              Last name
              <input
                value={draft.lastName ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, lastName: e.target.value }))
                }
              />
            </label>
            <label className="up-edit-field">
              Username
              <input
                value={draft.username ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    username: normalizeUsername(e.target.value),
                  }))
                }
              />
            </label>
            <label className="up-edit-field">
              Availability
              <select
                value={draft.availability ?? "available"}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    availability: e.target.value as ProfileAvailability,
                  }))
                }
              >
                <option value="available">Available</option>
                <option value="open_to_work">Open to work</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
              </select>
            </label>
            <label className="up-edit-field up-edit-field--full">
              Headline
              <input
                value={draft.headline ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, headline: e.target.value }))
                }
              />
            </label>
            <label className="up-edit-field up-edit-field--full">
              Bio
              <textarea
                rows={3}
                value={draft.bio ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, bio: e.target.value }))
                }
              />
            </label>
            <label className="up-edit-field">
              Role
              <input
                value={draft.roleLabel ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, roleLabel: e.target.value }))
                }
              />
            </label>
            <label className="up-edit-field">
              Location
              <input
                value={draft.location ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, location: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="up-edit-actions">
            <button type="button" className="up-follow-btn" onClick={onSave}>
              Save changes
            </button>
            {hasCover && (
              <button type="button" className="up-ghost-btn" onClick={clearCover}>
                Reset cover to gradient
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
