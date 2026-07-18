"use client";

import { TrendingUp, Award, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadinessScoreProps {
  score: number;
  breakdown?: {
    skill: number;
    consistency: number;
    performance: number;
  };
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
  className?: string;
}

export default function ReadinessScore({
  score,
  breakdown,
  size = "md",
  showBreakdown = false,
  className,
}: ReadinessScoreProps) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return {
          container: "p-3",
          score: "text-2xl",
          label: "text-xs",
          icon: "h-4 w-4",
        };
      case "lg":
        return {
          container: "p-6",
          score: "text-5xl",
          label: "text-lg",
          icon: "h-8 w-8",
        };
      default:
        return {
          container: "p-4",
          score: "text-3xl",
          label: "text-sm",
          icon: "h-5 w-5",
        };
    }
  };

  const sizes = getSizeClasses(size);

  return (
    <div
      className={cn(
        "rounded-xl border-2 flex items-center gap-4",
        getColor(score),
        sizes.container,
        className
      )}
    >
      <div className="flex-shrink-0">
        <TrendingUp className={sizes.icon} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("font-bold", sizes.score)}>{score}</span>
          <span className={cn("text-gray-600 font-medium", sizes.label)}>
            /100
          </span>
        </div>
        <p className={cn("text-gray-600 font-medium mt-1", sizes.label)}>
          Readiness Score
        </p>
        {showBreakdown && breakdown && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Skill</span>
              <span className="font-semibold">{breakdown.skill}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Consistency</span>
              <span className="font-semibold">{breakdown.consistency}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Performance</span>
              <span className="font-semibold">{breakdown.performance}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

