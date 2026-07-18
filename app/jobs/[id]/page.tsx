"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { MapPin, Clock, DollarSign, Briefcase, ArrowLeft, Building2, CheckCircle } from "lucide-react";

// Sample job details - In production, this would come from an API
const jobDetails: Record<string, any> = {
  "1-1": {
    id: "1-1",
    company: "Microsoft",
    logo: "https://img.icons8.com/color/96/000000/microsoft.png",
    title: "Customer Support Specialist",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$45,000 - $65,000",
    description: "Provide exceptional customer support for Microsoft products and services.",
    fullDescription: `We are looking for a Customer Support Specialist to join our team and help customers navigate Microsoft products and services. You will be responsible for:

• Responding to customer inquiries via phone, email, and chat
• Troubleshooting technical issues with Microsoft products
• Providing product guidance and best practices
• Escalating complex issues to technical teams
• Maintaining customer satisfaction ratings

Requirements:
• 2+ years of customer support experience
• Excellent communication skills
• Strong problem-solving abilities
• Familiarity with Microsoft products
• Ability to work in a fast-paced environment`,
    requirements: [
      "2+ years of customer support experience",
      "Excellent communication skills",
      "Strong problem-solving abilities",
      "Familiarity with Microsoft products",
      "Ability to work in a fast-paced environment",
    ],
    benefits: [
      "Health insurance",
      "401(k) matching",
      "Remote work flexibility",
      "Professional development opportunities",
    ],
    posted: "2 days ago",
    skillMatch: 92,
  },
  "2-1": {
    id: "2-1",
    company: "Tesla",
    logo: "https://img.icons8.com/color/96/000000/tesla-logo.png",
    title: "Customer Experience Representative",
    location: "Remote, United States",
    type: "Full-time",
    salary: "$50,000 - $70,000",
    description: "Deliver outstanding customer experiences for Tesla customers worldwide.",
    fullDescription: `Tesla is seeking a Customer Experience Representative to provide exceptional service to our customers. You will be the first point of contact for customer inquiries and will play a crucial role in maintaining Tesla's reputation for outstanding customer service.

Responsibilities:
• Handle customer inquiries via multiple channels (phone, email, chat)
• Assist customers with vehicle orders, deliveries, and service appointments
• Resolve customer issues and concerns promptly
• Collaborate with internal teams to ensure customer satisfaction
• Maintain detailed records of customer interactions

Requirements:
• 2+ years of customer service experience
• Passion for sustainable energy and electric vehicles
• Excellent communication and interpersonal skills
• Ability to work flexible hours including weekends
• Strong attention to detail`,
    requirements: [
      "2+ years of customer service experience",
      "Passion for sustainable energy and electric vehicles",
      "Excellent communication and interpersonal skills",
      "Ability to work flexible hours including weekends",
      "Strong attention to detail",
    ],
    benefits: [
      "Competitive salary",
      "Health and dental insurance",
      "Employee stock options",
      "Remote work option",
      "Gym membership",
    ],
    posted: "3 days ago",
    skillMatch: 85,
  },
  // Add more job details as needed
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = jobDetails[id];

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">The job you are looking for does not exist.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-brand-secondary/90 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 px-6 sm:px-8 py-8 sm:py-10 text-white">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white rounded-xl border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.parentElement) {
                        target.parentElement.innerHTML = `<div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-brand-primary font-bold text-2xl">${job.company[0]}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-brand-primary font-bold text-2xl">
                    {job.company[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">{job.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="text-lg font-medium">{job.company}</span>
                  </div>
                  {job.skillMatch && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full text-green-100 border border-green-300/30">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-semibold">{job.skillMatch}% Match</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Job Meta */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Location</div>
                  <div className="text-sm font-semibold text-gray-900">{job.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Job Type</div>
                  <div className="text-sm font-semibold text-gray-900">{job.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Salary</div>
                  <div className="text-sm font-semibold text-gray-900">{job.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 font-medium">Posted</div>
                  <div className="text-sm font-semibold text-gray-900">{job.posted}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.fullDescription || job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                      </div>
                      <span className="text-gray-700 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-200">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition shadow-lg hover:shadow-xl text-lg">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
