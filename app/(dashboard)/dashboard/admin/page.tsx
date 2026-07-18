"use client";

import Link from "next/link";
import { Briefcase, User, BookOpen, ArrowRight, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Access all dashboard views for testing and management</p>
      </div>

      {/* Dashboard Views */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/trainee"
          className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md hover:border-brand-secondary transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Trainee Dashboard</h3>
          <p className="text-gray-600">
            View the trainee experience and training interface
          </p>
        </Link>

        <Link
          href="/dashboard/talent"
          className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md hover:border-brand-secondary transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Talent Dashboard</h3>
          <p className="text-gray-600">
            View the talent experience and job matching interface
          </p>
        </Link>

        <Link
          href="/dashboard/recruiter"
          className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:shadow-md hover:border-brand-secondary transition group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-brand-secondary group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h3>
          <p className="text-gray-600">
            View the recruiter experience and job posting interface
          </p>
        </Link>
      </div>
    </div>
  );
}

