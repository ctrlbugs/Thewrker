"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { MapPin, Clock, DollarSign, Briefcase, Search, Filter, Grid, Bookmark, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

// Enhanced job data with company info
const jobs = [
  {
    id: "1",
    company: "Microsoft",
    logo: "https://img.icons8.com/color/96/000000/microsoft.png",
    description: "Leading technology company providing cloud services, software, and hardware solutions worldwide",
    employees: "100,000+ Employees",
    badges: ["Top 1% of responders", "Responds within a day", "Recently funded"],
    jobs: [
      {
        id: "1-1",
        title: "Customer Support Specialist",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$45,000 - $65,000",
        description: "Provide exceptional customer support for Microsoft products and services.",
        experience: "2 years of exp",
        posted: "2 days ago",
        skillMatch: 92,
      },
      {
        id: "1-2",
        title: "Virtual Assistant",
        location: "Remote, Global",
        type: "Full-time",
        salary: "$40,000 - $55,000",
        description: "Support executive team with administrative tasks and calendar management.",
        experience: "1 year of exp",
        posted: "1 week ago",
        skillMatch: 88,
      },
    ],
  },
  {
    id: "2",
    company: "Tesla",
    logo: "https://img.icons8.com/color/96/000000/tesla-logo.png",
    description: "Electric vehicle and clean energy company revolutionizing transportation and energy",
    employees: "100,000+ Employees",
    badges: ["Top 10% of responders", "Responds within two weeks", "B2B"],
    jobs: [
      {
        id: "2-1",
        title: "Customer Experience Representative",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$50,000 - $70,000",
        description: "Deliver outstanding customer experiences for Tesla customers worldwide.",
        experience: "2 years of exp",
        posted: "3 days ago",
        skillMatch: 85,
      },
      {
        id: "2-2",
        title: "Sales Development Representative",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$55,000 - $75,000",
        description: "Generate leads and support sales initiatives for Tesla Energy products.",
        experience: "1 year of exp",
        posted: "5 days ago",
        skillMatch: 90,
      },
    ],
  },
  {
    id: "3",
    company: "Google",
    logo: "https://img.icons8.com/color/96/000000/google-logo.png",
    description: "Global technology company providing search, cloud, and software solutions",
    employees: "150,000+ Employees",
    badges: ["Top 1% of responders", "B2B", "Scale Stage"],
    jobs: [
      {
        id: "3-1",
        title: "Customer Support Agent",
        location: "Remote, Global",
        type: "Full-time",
        salary: "$60,000 - $80,000",
        description: "Help users navigate Google products and resolve technical issues.",
        experience: "2 years of exp",
        posted: "1 day ago",
        skillMatch: 87,
      },
      {
        id: "3-2",
        title: "Executive Assistant",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$65,000 - $85,000",
        description: "Provide administrative support to Google leadership team.",
        experience: "3 years of exp",
        posted: "4 days ago",
        skillMatch: 83,
      },
    ],
  },
  {
    id: "4",
    company: "Amazon",
    logo: "https://img.icons8.com/color/96/000000/amazon.png",
    description: "E-commerce and cloud computing company serving millions of customers globally",
    employees: "1,500,000+ Employees",
    badges: ["Top 5% of responders", "Responds within a day", "B2B"],
    jobs: [
      {
        id: "4-1",
        title: "Customer Service Representative",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$42,000 - $58,000",
        description: "Support Amazon customers with orders, returns, and inquiries.",
        experience: "1 year of exp",
        posted: "2 days ago",
        skillMatch: 89,
      },
      {
        id: "4-2",
        title: "Virtual Assistant - Operations",
        location: "Remote, Global",
        type: "Full-time",
        salary: "$45,000 - $60,000",
        description: "Assist operations team with data entry and process management.",
        experience: "2 years of exp",
        posted: "1 week ago",
        skillMatch: 91,
      },
    ],
  },
  {
    id: "5",
    company: "Apple",
    logo: "https://img.icons8.com/color/96/000000/apple-logo.png",
    description: "Technology company designing and manufacturing consumer electronics and software",
    employees: "150,000+ Employees",
    badges: ["Top 1% of responders", "B2B", "Top Investors"],
    jobs: [
      {
        id: "5-1",
        title: "Technical Support Specialist",
        location: "Remote, United States",
        type: "Full-time",
        salary: "$55,000 - $75,000",
        description: "Provide technical support for Apple products and services.",
        experience: "2 years of exp",
        posted: "3 days ago",
        skillMatch: 86,
      },
      {
        id: "5-2",
        title: "Customer Experience Advisor",
        location: "Remote, Global",
        type: "Full-time",
        salary: "$50,000 - $70,000",
        description: "Deliver exceptional customer experiences for Apple customers.",
        experience: "1 year of exp",
        posted: "6 days ago",
        skillMatch: 84,
      },
    ],
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const companies = Array.from(new Set(jobs.map((job) => job.company)));

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobs.some((j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCompany = !selectedCompany || job.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white py-20 sm:py-24 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Remote Jobs
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
                Discover opportunities from top companies
              </p>
            </div>
            <Link
              href="/jobs/swipe"
              className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3 rounded-lg transition text-white font-medium"
            >
              <Grid className="h-5 w-5" />
              <span>Try Swipe Mode</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <select
                value={selectedCompany || ""}
                onChange={(e) => setSelectedCompany(e.target.value || null)}
                className="pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> companies
          </p>
          <div className="text-sm text-gray-500">
            Sort by: <button className="font-medium text-gray-700 hover:text-brand-secondary">Relevance</button>
            {" • "}
            <button className="font-medium text-gray-700 hover:text-brand-secondary">Date</button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Company Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={company.logo}
                        alt={`${company.company} logo`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<div class="w-full h-full bg-brand-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">${company.company[0]}</div>`;
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                          {company.company}
                        </h2>
                        <p className="text-sm text-gray-500 mb-3">{company.employees}</p>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                          {company.description}
                        </p>
                        {/* Company Badges */}
                        <div className="flex flex-wrap gap-2">
                          {company.badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100"
                            >
                              {badge === "Top 1% of responders" && <TrendingUp className="h-3 w-3" />}
                              {badge.includes("Responds") && <Clock className="h-3 w-3" />}
                              {badge.includes("funded") && <DollarSign className="h-3 w-3" />}
                              {badge === "B2B" && <Briefcase className="h-3 w-3" />}
                              {badge === "Scale Stage" && <TrendingUp className="h-3 w-3" />}
                              {badge === "Top Investors" && <DollarSign className="h-3 w-3" />}
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Actively Hiring
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Listings */}
              <div className="divide-y divide-gray-100">
                {company.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50 transition group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-brand-secondary transition mb-2">
                                {job.title}
                              </h3>
                            </Link>
                            {/* Job Meta */}
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 mb-3">
                              <span className="inline-flex items-center px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium border border-yellow-200">
                                {job.type}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{job.salary}</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                {job.location}
                              </span>
                              <span className="text-gray-500">{job.experience}</span>
                            </div>
                            {job.skillMatch && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                                <TrendingUp className="h-3 w-3" />
                                {job.skillMatch}% Match
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base mb-3">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Posted {job.posted}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSave(job.id);
                          }}
                          className={`p-3 rounded-xl border-2 transition ${
                            savedJobs.has(job.id)
                              ? "bg-brand-secondary/10 border-brand-secondary text-brand-secondary"
                              : "bg-white border-gray-200 text-gray-600 hover:border-brand-secondary hover:text-brand-secondary"
                          }`}
                          aria-label="Save job"
                        >
                          <Bookmark className={`h-5 w-5 ${savedJobs.has(job.id) ? "fill-current" : ""}`} />
                        </button>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCompany(null);
              }}
              className="px-6 py-3 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-brand-primary text-white py-12 sm:py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to apply?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Sign up to get started and apply for these amazing opportunities
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-brand-secondary text-white rounded-xl text-lg font-semibold hover:bg-brand-secondary/90 transition shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
