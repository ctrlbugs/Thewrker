"use client";

import { useState } from "react";
import SwipeJobCard from "./swipe-job-card";
import { Heart, X, Sparkles } from "lucide-react";

interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted: string;
  skillMatch?: number;
}

interface JobSwipeContainerProps {
  jobs: Job[];
}

export default function JobSwipeContainer({ jobs }: JobSwipeContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const currentJob = jobs[currentIndex];
  const nextJob = jobs[currentIndex + 1];
  const hasMoreJobs = currentIndex < jobs.length - 1;

  const handleSwipe = (direction: "left" | "right" | "super") => {
    if (direction === "right" || direction === "super") {
      setSavedJobs((prev) => new Set(prev).add(currentJob.id));
    }

    if (hasMoreJobs) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    handleSwipe("left");
  };

  const handleSave = () => {
    handleSwipe("right");
  };

  if (!currentJob) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-brand-secondary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          You&apos;ve seen all jobs!
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Check back later for more opportunities or browse all jobs
        </p>
        <a
          href="/jobs"
          className="px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition"
        >
          Browse All Jobs
        </a>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "650px", minHeight: "580px" }}>
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {/* Next card (background) */}
        {nextJob && (
          <div className="absolute inset-0 transform scale-[0.92] opacity-30" style={{ zIndex: 1 }}>
            <SwipeJobCard job={nextJob} onSwipe={() => {}} isActive={false} />
          </div>
        )}

        {/* Current card (foreground) */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <SwipeJobCard
            job={currentJob}
            onSwipe={handleSwipe}
            isActive={true}
            progressData={{
              current: currentIndex + 1,
              total: jobs.length,
              saved: savedJobs.size,
            }}
          />
        </div>
      </div>

      {/* Action Buttons - Mobile optimized */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex items-center justify-center gap-6 sm:gap-8 px-4 z-30">
        <button
          onClick={handleSkip}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all touch-manipulation"
          aria-label="Skip job"
        >
          <X className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
        </button>
        
        <button
          onClick={handleSave}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-secondary rounded-full shadow-xl flex items-center justify-center hover:bg-brand-secondary/90 active:scale-90 transition-all touch-manipulation"
          aria-label="Save job"
        >
          <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-white fill-white" />
        </button>
      </div>
    </div>
  );
}
