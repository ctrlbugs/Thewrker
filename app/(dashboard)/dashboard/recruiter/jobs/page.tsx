"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, Edit2, Trash2, Eye, Users, Clock, DollarSign } from "lucide-react";

const jobs = [
  {
    id: "1",
    title: "Customer Support Specialist",
    status: "OPEN",
    applications: 23,
    posted: "5 days ago",
    location: "Remote, Global",
    type: "Full-time",
    salary: "$45,000 - $65,000",
  },
  {
    id: "2",
    title: "Virtual Assistant",
    status: "OPEN",
    applications: 15,
    posted: "2 weeks ago",
    location: "Remote, US",
    type: "Full-time",
    salary: "$40,000 - $55,000",
  },
  {
    id: "3",
    title: "Sales Representative",
    status: "FILLED",
    applications: 42,
    posted: "1 month ago",
    location: "Remote, Global",
    type: "Full-time",
    salary: "$50,000 - $70,000",
  },
];

export default function RecruiterJobsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredJobs = jobs.filter((job) => filterStatus === "all" || job.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
          <p className="text-gray-600">Manage your job postings and applications</p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="px-6 py-3 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "OPEN", "DRAFT", "CLOSED", "FILLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? "bg-brand-secondary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "All Jobs" : status}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === "OPEN"
                        ? "bg-green-100 text-green-700"
                        : job.status === "FILLED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span>{job.location}</span>
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-6">
                  <Link
                    href={`/dashboard/recruiter/jobs/${job.id}/applications`}
                    className="flex items-center gap-2 text-brand-secondary hover:text-brand-secondary/80 font-medium"
                  >
                    <Users className="h-5 w-5" />
                    {job.applications} Applications
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-600 hover:text-brand-secondary hover:bg-gray-100 rounded-lg transition">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
