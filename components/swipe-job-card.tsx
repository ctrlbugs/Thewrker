"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState } from "react";
import { MapPin, Clock, DollarSign, Briefcase, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";

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

interface SwipeJobCardProps {
  job: Job;
  onSwipe: (direction: "left" | "right" | "super") => void;
  isActive: boolean;
  progressData?: {
    current: number;
    total: number;
    saved: number;
  };
}

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 500;

export default function SwipeJobCard({ job, onSwipe, isActive, progressData }: SwipeJobCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0.3, 0.95, 1, 0.95, 0.3]);

  const [exitX, setExitX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Overlay opacity based on swipe direction
  const leftOverlayOpacity = useTransform(x, [-150, -50, 0], [1, 0.3, 0]);
  const rightOverlayOpacity = useTransform(x, [0, 50, 150], [0, 0.3, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine swipe direction and strength
    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > SWIPE_VELOCITY) {
      const direction = offset > 0 ? "right" : "left";
      const isSuperSwipe = Math.abs(offset) > 200 || Math.abs(velocity) > 1000;
      
      setIsExiting(true);
      setExitX(offset > 0 ? 1000 : -1000);
      
      setTimeout(() => {
        onSwipe(isSuperSwipe && direction === "right" ? "super" : direction);
        setIsExiting(false);
        setExitX(0);
        x.set(0);
      }, 200);
    } else {
      // Snap back to center
      x.set(0);
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full">
        <div className="p-6 sm:p-8 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {job.company[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
                {job.title}
              </h3>
              <p className="text-lg text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      onDragEnd={handleDragEnd}
      animate={isExiting ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ x, rotate, opacity }}
      className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full cursor-grab active:cursor-grabbing touch-none select-none"
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col relative">
        {/* PASS Overlay (Left Swipe) - Positioned at top right */}
        <motion.div
          className="absolute top-0 right-0 pointer-events-none z-50"
          style={{ opacity: leftOverlayOpacity }}
        >
          <motion.div
            className="m-4"
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <div className="bg-red-500 px-6 py-3 rounded-xl shadow-2xl border-4 border-red-600">
              <span className="text-white font-black text-3xl sm:text-4xl tracking-wider">PASS</span>
            </div>
          </motion.div>
        </motion.div>

        {/* INTERESTED/APPLY Overlay (Right Swipe) - Positioned at top left */}
        <motion.div
          className="absolute top-0 left-0 pointer-events-none z-50"
          style={{ opacity: rightOverlayOpacity }}
        >
          <motion.div
            className="m-4"
            animate={{ rotate: [8, -8, 8] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <div className="bg-green-500 px-6 py-3 rounded-xl shadow-2xl border-4 border-green-600">
              <span className="text-white font-black text-3xl sm:text-4xl tracking-wider">INTERESTED</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Indicator - Inside card at top */}
        {progressData && isActive && (
          <div className="relative z-10 mb-6 bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-600">{progressData.current} of {progressData.total}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-600">{progressData.saved}</span>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">saved</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-brand-secondary rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${(progressData.current / progressData.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Header with Logo and Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {job.company[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-lg text-gray-600 font-medium">{job.company}</p>
                  </div>
                </div>
                {job.skillMatch && (
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {job.skillMatch}% Match
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium mb-0.5">Location</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{job.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium mb-0.5">Type</div>
                <div className="text-sm font-semibold text-gray-900">{job.type}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium mb-0.5">Salary</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{job.salary}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium mb-0.5">Posted</div>
                <div className="text-sm font-semibold text-gray-900">{job.posted}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-4 sm:line-clamp-5">
              {job.description}
            </p>
          </div>

          {/* View Details Link */}
          <div className="pt-4">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center text-brand-secondary hover:text-brand-secondary/80 font-semibold text-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View full job details →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
