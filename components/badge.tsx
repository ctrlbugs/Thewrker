"use client";

import { Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  type: "certification" | "skill" | "soft-skill";
  level?: "junior" | "mid" | "senior";
  score?: number;
  verified?: boolean;
  className?: string;
}

const badgeColors = {
  certification: "bg-blue-100 text-blue-700 border-blue-200",
  skill: "bg-green-100 text-green-700 border-green-200",
  "soft-skill": "bg-purple-100 text-purple-700 border-purple-200",
};

const levelColors = {
  junior: "bg-yellow-100 text-yellow-700 border-yellow-200",
  mid: "bg-orange-100 text-orange-700 border-orange-200",
  senior: "bg-red-100 text-red-700 border-red-200",
};

export default function Badge({
  name,
  type,
  level,
  score,
  verified = true,
  className,
}: BadgeProps) {
  const baseColor = level ? levelColors[level] : badgeColors[type];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium",
        baseColor,
        className
      )}
    >
      {verified && <Award className="h-4 w-4" />}
      <span>{name}</span>
      {score && (
        <span className="ml-1 text-xs font-semibold">{score}%</span>
      )}
      {level && (
        <span className="ml-1 text-xs font-semibold capitalize">{level}</span>
      )}
    </div>
  );
}

interface BadgeStackProps {
  badges: Array<{
    name: string;
    type: "certification" | "skill" | "soft-skill";
    level?: "junior" | "mid" | "senior";
    score?: number;
    verified?: boolean;
  }>;
  className?: string;
  maxVisible?: number;
}

export function BadgeStack({ badges, className, maxVisible = 5 }: BadgeStackProps) {
  const visible = badges.slice(0, maxVisible);
  const remaining = badges.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((badge, idx) => (
        <Badge key={idx} {...badge} />
      ))}
      {remaining > 0 && (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-300 bg-gray-50 text-gray-600 text-sm font-medium">
          +{remaining} more
        </div>
      )}
    </div>
  );
}

