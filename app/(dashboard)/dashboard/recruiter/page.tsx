"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Users, FileText, TrendingUp, ArrowRight, Plus } from "lucide-react";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    hired: 0,
    talentPool: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      activeJobs: 5,
      applications: 23,
      hired: 8,
      talentPool: 150,
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and talent pipeline</p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.applications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hired</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.hired}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Talent Pool</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.talentPool}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <Plus className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Post New Job</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create a new job posting and reach verified talent
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              Create Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/recruiter/talent"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <Users className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Browse Talent</h3>
            <p className="text-sm text-gray-600 mb-3">
              Search and filter verified talent by skills and experience
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              View Talent
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/recruiter/jobs"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <Briefcase className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Manage Jobs</h3>
            <p className="text-sm text-gray-600 mb-3">
              View and manage all your job postings
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              View Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">5 new applications</p>
                <p className="text-sm text-gray-500">Customer Support Representative - 2 hours ago</p>
              </div>
            </div>
            <Link
              href="/dashboard/recruiter/jobs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

