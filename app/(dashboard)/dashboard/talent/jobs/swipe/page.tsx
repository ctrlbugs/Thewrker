"use client";

import { useState } from "react";
import JobSwipeContainer from "@/components/job-swipe-container";

// Sample job data - in production, fetch from API
const sampleJobs = [
  {
    id: "1",
    company: "Microsoft",
    logo: "https://img.icons8.com/color/96/000000/microsoft.png",
    title: "Customer Support Specialist",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$45,000 - $65,000",
    description: "Provide exceptional customer support for Microsoft products and services. Work with a global team to help customers succeed.",
    posted: "2 days ago",
    skillMatch: 92,
  },
  {
    id: "2",
    company: "Tesla",
    logo: "https://img.icons8.com/color/96/000000/tesla-logo.png",
    title: "Customer Experience Representative",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$50,000 - $70,000",
    description: "Deliver outstanding customer experiences for Tesla customers worldwide. Be part of the sustainable energy revolution.",
    posted: "3 days ago",
    skillMatch: 85,
  },
  {
    id: "3",
    company: "Google",
    logo: "https://img.icons8.com/color/96/000000/google-logo.png",
    title: "Customer Support Agent",
    location: "Remote, Global",
    type: "Full-time",
    salary: "$60,000 - $80,000",
    description: "Help users navigate Google products and resolve technical issues. Join a world-class support team.",
    posted: "1 day ago",
    skillMatch: 87,
  },
  {
    id: "4",
    company: "Amazon",
    logo: "https://img.icons8.com/color/96/000000/amazon.png",
    title: "Customer Service Representative",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$42,000 - $58,000",
    description: "Support Amazon customers with orders, returns, and inquiries. Work flexible hours from anywhere.",
    posted: "2 days ago",
    skillMatch: 89,
  },
  {
    id: "5",
    company: "Apple",
    logo: "https://img.icons8.com/color/96/000000/apple-logo.png",
    title: "Technical Support Specialist",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$55,000 - $75,000",
    description: "Provide technical support for Apple products and services. Help customers get the most from their devices.",
    posted: "3 days ago",
    skillMatch: 86,
  },
];

export default function TalentSwipeJobsPage() {
  const [jobs, setJobs] = useState(sampleJobs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Swipe Jobs</h1>
        <p className="text-gray-600 mt-2">
          Swipe right to save jobs you are interested in, left to skip
        </p>
      </div>

      {/* Swipe Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8" style={{ minHeight: "680px" }}>
        <JobSwipeContainer jobs={jobs} />
      </div>
    </div>
  );
}

