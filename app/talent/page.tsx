"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Award, TrendingUp, Users, Shield, Zap, Star, Play, BookOpen } from "lucide-react";
import Badge from "@/components/badge";
import ReadinessScore from "@/components/readiness-score";

export default function TalentLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#21386B]/10 via-[#76BEC5]/15 to-[#21386B]/5">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-brand-secondary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                No experience?{" "}
                <span className="text-brand-secondary">No problem.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
                Get trained. Get verified. Get hired.
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                TheWrker trains you, verifies your skills with badges, and connects you to global remote jobs. No fake CVs needed—your verified skills speak for themselves.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="bg-brand-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-secondary/90 transition inline-flex items-center justify-center shadow-lg shadow-brand-secondary/30 hover:shadow-xl"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 transition shadow-md hover:shadow-lg inline-flex items-center justify-center"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <ReadinessScore score={87} size="lg" showBreakdown />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your career
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">1. Train</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Complete role-based training tracks with practical lessons, simulations, and real-world tasks.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Award className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">2. Get Verified</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Earn TheWrker Badges that prove your skills. No fake CVs—your verified abilities speak for themselves.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">3. Get Hired</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get matched with verified employers. Swipe on jobs, get matched, and start working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                TheWrker Badges Replace CVs
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your skills are verified, not just claimed. Each badge proves you can actually do the work.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Certified Skills</h3>
                    <p className="text-gray-600">
                      Each badge represents verified skills through assessments and simulations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Employer Trust</h3>
                    <p className="text-gray-600">
                      Recruiters trust verified badges over inflated CVs. Faster hiring, better matches.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Career Growth</h3>
                    <p className="text-gray-600">
                      Unlock higher-paying jobs as you earn more badges and improve your readiness score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Example Badge Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge name="Certified Virtual Assistant" type="certification" verified />
                    <Badge name="Customer Support" type="certification" verified />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge name="CRM Tools" type="skill" score={92} verified />
                    <Badge name="Communication" type="soft-skill" score={88} verified />
                    <Badge name="Zendesk" type="skill" score={95} verified />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Level</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge name="Mid-Level" type="certification" level="mid" verified />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Tracks */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Training Tracks
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Job-ready training, not academic courses
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Customer Support", emoji: "🎧", desc: "Master customer service skills for remote support roles" },
              { name: "Virtual Assistant", emoji: "💼", desc: "Learn administrative tasks and productivity tools" },
              { name: "Sales / SDR", emoji: "📊", desc: "Develop sales skills and lead generation techniques" },
            ].map((track) => (
              <div key={track.name} className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 hover:border-brand-secondary transition hover:shadow-lg">
                <div className="text-4xl mb-4">{track.emoji}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{track.name}</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">{track.desc}</p>
                <Link
                  href="/register"
                  className="text-brand-secondary font-semibold inline-flex items-center text-sm sm:text-base hover:text-brand-secondary/80 transition"
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-brand-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to transform your career?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Join thousands of professionals building their remote careers with verified skills
          </p>
          <Link
            href="/register"
            className="inline-flex items-center bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

