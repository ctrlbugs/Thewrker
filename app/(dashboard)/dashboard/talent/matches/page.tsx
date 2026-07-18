"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, MessageCircle, CheckCircle, X } from "lucide-react";
import ReadinessScore from "@/components/readiness-score";
import { BadgeStack } from "@/components/badge";

// Sample matches data
const matches = [
  {
    id: "1",
    jobId: "1",
    company: "Microsoft",
    logo: "https://img.icons8.com/color/96/000000/microsoft.png",
    title: "Customer Support Specialist",
    location: "Remote, United States",
    salary: "$45,000 - $65,000",
    type: "Full-time",
    skillMatch: 92,
    matchedAt: "2 days ago",
    status: "matched",
    requiredBadges: ["Customer Support", "Communication", "CRM Tools"],
  },
  {
    id: "2",
    jobId: "2",
    company: "Tesla",
    logo: "https://img.icons8.com/color/96/000000/tesla-logo.png",
    title: "Virtual Assistant",
    location: "Remote, Global",
    salary: "$40,000 - $55,000",
    type: "Full-time",
    skillMatch: 88,
    matchedAt: "5 days ago",
    status: "matched",
    requiredBadges: ["Virtual Assistant", "CRM Tools"],
  },
  {
    id: "3",
    jobId: "3",
    company: "Google",
    logo: "https://img.icons8.com/color/96/000000/google-logo.png",
    title: "Customer Support Agent",
    location: "Remote, Global",
    salary: "$60,000 - $80,000",
    type: "Full-time",
    skillMatch: 85,
    matchedAt: "1 week ago",
    status: "interview_scheduled",
    requiredBadges: ["Customer Support", "Technical Support"],
  },
];

export default function MatchesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredMatches = matches.filter((match) => {
    if (selectedStatus === "all") return true;
    return match.status === selectedStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/talent"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
          <p className="text-gray-600 mt-2">Jobs you&apos;ve matched with</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "all"
              ? "bg-brand-secondary text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          All ({matches.length})
        </button>
        <button
          onClick={() => setSelectedStatus("matched")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "matched"
              ? "bg-brand-secondary text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Matched ({matches.filter((m) => m.status === "matched").length})
        </button>
        <button
          onClick={() => setSelectedStatus("interview_scheduled")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "interview_scheduled"
              ? "bg-brand-secondary text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Interviews ({matches.filter((m) => m.status === "interview_scheduled").length})
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-6">
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === "all"
                ? "Start swiping on jobs to get matches!"
                : `No matches with status "${selectedStatus}"`}
            </p>
            <Link
              href="/jobs/swipe"
              className="inline-flex items-center bg-brand-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-secondary/90 transition"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                    {match.logo ? (
                      <img
                        src={match.logo}
                        alt={`${match.company} logo`}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<div class="w-16 h-16 bg-brand-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">${match.company[0]}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-brand-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {match.company[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{match.title}</h3>
                      <p className="text-lg text-gray-600 font-medium mb-2">{match.company}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {match.skillMatch}% Match
                        </span>
                        {match.status === "interview_scheduled" && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            Interview Scheduled
                          </span>
                        )}
                        {match.status === "matched" && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            Matched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-secondary" />
                      <span>{match.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand-secondary" />
                      <span>{match.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-brand-secondary" />
                      <span className="font-semibold text-gray-900">{match.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-secondary" />
                      <span>Matched {match.matchedAt}</span>
                    </div>
                  </div>

                  {/* Required Badges */}
                  {match.requiredBadges && match.requiredBadges.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Required Badges:</p>
                      <BadgeStack
                        badges={match.requiredBadges.map((name) => ({
                          name,
                          type: "certification" as const,
                          verified: true,
                        }))}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <Link
                    href={`/jobs/${match.jobId}`}
                    className="w-full md:w-auto px-6 py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-brand-secondary/90 transition text-center"
                  >
                    View Job Details
                  </Link>
                  {match.status === "matched" && (
                    <button className="w-full md:w-auto px-6 py-3 bg-white text-brand-secondary border-2 border-brand-secondary rounded-lg font-semibold hover:bg-brand-secondary/5 transition">
                      <MessageCircle className="h-4 w-4 inline mr-2" />
                      Message
                    </button>
                  )}
                  {match.status === "interview_scheduled" && (
                    <button className="w-full md:w-auto px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      View Interview
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

