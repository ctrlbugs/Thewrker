"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Award, PlayCircle, CheckCircle, ArrowRight, TrendingUp, Users } from "lucide-react";

const trainingTracks = [
  {
    id: "1",
    title: "Customer Support Representative",
    description: "Master the skills needed to provide exceptional customer support in remote environments.",
    duration: "4-6 weeks",
    modules: 12,
    enrolled: 1250,
    progress: 0,
    level: "Beginner",
    skills: ["Email Support", "Chat Support", "CRM Tools", "Problem Solving"],
    badge: "CSR Certified",
  },
  {
    id: "2",
    title: "Virtual Assistant",
    description: "Learn to manage administrative tasks, schedules, and business operations remotely.",
    duration: "3-5 weeks",
    modules: 10,
    enrolled: 980,
    progress: 0,
    level: "Beginner",
    skills: ["Calendar Management", "Email Management", "Data Entry", "Communication"],
    badge: "VA Certified",
  },
  {
    id: "3",
    title: "Sales Representative",
    description: "Develop sales skills, lead generation, and customer relationship management.",
    duration: "5-7 weeks",
    modules: 15,
    enrolled: 750,
    progress: 0,
    level: "Intermediate",
    skills: ["Lead Generation", "Sales Techniques", "CRM Tools", "Negotiation"],
    badge: "Sales Certified",
  },
];

export default function TrainingPage() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Tracks</h1>
        <p className="text-gray-600">Choose a track to start your journey to becoming job-ready</p>
      </div>

      {/* Training Tracks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingTracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-brand-secondary transition p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-brand-secondary" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {track.level}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{track.title}</h3>
            <p className="text-gray-600 mb-4 flex-1">{track.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{track.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{track.modules} Modules</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{track.enrolled.toLocaleString()} enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>{track.badge}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {track.skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {track.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{track.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedTrack(track.id)}
              className="w-full px-4 py-3 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-5 w-5" />
              Start Learning
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-brand-secondary/10 to-blue-50 rounded-xl border border-brand-secondary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="h-6 w-6 text-brand-secondary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Get Certified, Get Hired</h3>
            <p className="text-gray-600 text-sm mb-3">
              Complete any training track to earn a verified certificate. Our certificates are recognized by top
              employers and help you stand out in the job market.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-secondary" />
                <span>Industry-recognized certificates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-secondary" />
                <span>Job-ready skills in weeks, not years</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-secondary" />
                <span>Direct path to verified job opportunities</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
