"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import JobSwipeContainer from "@/components/job-swipe-container";
import { ArrowLeft, Grid, List } from "lucide-react";
import Link from "next/link";

// Sample job data
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

export default function SwipeJobsPage() {
  const [jobs, setJobs] = useState(sampleJobs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Mobile-optimized header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white py-6 pt-20 pb-4 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg transition text-white font-medium text-sm"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Swipe Jobs</h1>
          <p className="text-white/80 text-base sm:text-lg">
            Swipe right to save, left to skip
          </p>
        </div>
      </div>

      {/* Swipe Container - Full height for mobile */}
      <div className="relative" style={{ minHeight: "calc(100vh - 180px)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <JobSwipeContainer jobs={jobs} />
        </div>
      </div>

    </div>
  );
}
