"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, FileText, TrendingUp, ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import ReadinessScore from "@/components/readiness-score";
import { BadgeStack } from "@/components/badge";

export default function TalentDashboard() {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    matches: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      applications: 3,
      interviews: 1,
      profileViews: 12,
      matches: 8,
    });
  }, []);

  const badges = [
    { name: "Certified Customer Support", type: "certification" as const, verified: true },
    { name: "CRM Tools", type: "skill" as const, score: 92, verified: true },
    { name: "Communication", type: "soft-skill" as const, score: 88, verified: true },
    { name: "Zendesk", type: "skill" as const, score: 95, verified: true },
    { name: "Virtual Assistant", type: "certification" as const, level: "mid" as const, verified: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Talent Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your profile, applications, and job matches</p>
      </div>

      {/* Readiness Score */}
      <div className="grid md:grid-cols-2 gap-6">
        <ReadinessScore 
          score={87} 
          size="md"
          showBreakdown
          breakdown={{
            skill: 90,
            consistency: 85,
            performance: 88,
          }}
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Badges</h3>
          <BadgeStack badges={badges} maxVisible={4} />
          <Link
            href="/dashboard/talent/profile"
            className="mt-4 inline-flex items-center text-sm text-brand-secondary hover:text-brand-secondary/80 font-medium"
          >
            View all badges
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-brand-secondary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.applications}</div>
          <div className="text-sm text-gray-600">Applications</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.matches}</div>
          <div className="text-sm text-gray-600">Matches</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.interviews}</div>
          <div className="text-sm text-gray-600">Interviews</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.profileViews}</div>
          <div className="text-sm text-gray-600">Profile Views</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/talent/jobs/swipe"
          className="bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold mb-2">Swipe on Jobs</h3>
          <p className="text-white/90">
            Discover new opportunities with our swipe-based matching
          </p>
        </Link>

        <Link
          href="/dashboard/talent/jobs"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-brand-secondary" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Browse All Jobs</h3>
          <p className="text-gray-600">
            Explore all available remote opportunities
          </p>
        </Link>

        <Link
          href="/dashboard/talent/resume"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Builder</h3>
          <p className="text-gray-600">
            Create an ATS-optimized resume with AI enhancement
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Customer Support Specialist</h4>
                <p className="text-sm text-gray-600">Microsoft • 92% Match</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Matched
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Virtual Assistant</h4>
                <p className="text-sm text-gray-600">Tesla • 88% Match</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Matched
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/talent/applications"
          className="mt-4 inline-flex items-center text-sm text-brand-secondary hover:text-brand-secondary/80 font-medium"
        >
          View all matches
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
