"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Award, TrendingUp, ArrowRight } from "lucide-react";

export default function TraineeDashboard() {
  const [stats, setStats] = useState({
    enrolledTracks: 0,
    completedTracks: 0,
    certificates: 0,
    progress: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from API
    setStats({
      enrolledTracks: 1,
      completedTracks: 0,
      certificates: 0,
      progress: 25,
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trainee Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your learning progress and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled Tracks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.enrolledTracks}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedTracks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.certificates}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.progress}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/trainee/training"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <BookOpen className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Browse Training Tracks</h3>
            <p className="text-sm text-gray-600 mb-3">
              Explore available training tracks and start learning
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              View Tracks
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/trainee/certificates"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <Award className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">View Certificates</h3>
            <p className="text-sm text-gray-600 mb-3">
              See your earned certificates and achievements
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              View Certificates
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/dashboard/trainee/profile"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
          >
            <BookOpen className="h-8 w-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Complete Profile</h3>
            <p className="text-sm text-gray-600 mb-3">
              Update your profile to unlock more opportunities
            </p>
            <span className="text-primary-600 font-medium text-sm inline-flex items-center">
              Edit Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Enrolled in Customer Support Track</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
            <span className="text-sm text-primary-600 font-medium">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

