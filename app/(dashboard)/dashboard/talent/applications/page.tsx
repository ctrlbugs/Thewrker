"use client";

import { useState } from "react";
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

const applications = [
  {
    id: "1",
    jobTitle: "Customer Support Specialist",
    company: "Microsoft",
    status: "PENDING",
    appliedDate: "3 days ago",
    matchScore: 92,
  },
  {
    id: "2",
    jobTitle: "Virtual Assistant",
    company: "Tesla",
    status: "REVIEWED",
    appliedDate: "1 week ago",
    matchScore: 88,
  },
  {
    id: "3",
    jobTitle: "Sales Representative",
    company: "Google",
    status: "REJECTED",
    appliedDate: "2 weeks ago",
    matchScore: 75,
  },
];

export default function TalentApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = applications.filter((app) => filterStatus === "all" || app.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "REVIEWED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEWED", "ACCEPTED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? "bg-brand-secondary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{app.jobTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-brand-secondary font-semibold mb-3">{app.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Applied {app.appliedDate}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
