"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Zap, Users, TrendingUp, Award, Clock, Target, Filter } from "lucide-react";
import Badge from "@/components/badge";

export default function RecruiterLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#21386B]/10 via-[#76BEC5]/15 to-[#21386B]/5">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-brand-secondary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Hire Verified Talent.{" "}
              <span className="text-brand-secondary">Not CV Noise.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
              Stop wasting time on fake CVs and inflated experience. Hire people with verified skills that actually match your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-brand-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-secondary/90 transition inline-flex items-center justify-center shadow-lg shadow-brand-secondary/30 hover:shadow-xl"
              >
                Start Hiring Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className="bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 transition shadow-md hover:shadow-lg inline-flex items-center justify-center"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-brand-secondary mb-2">3x</div>
              <div className="text-sm sm:text-base text-gray-600">Faster Hiring</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-brand-secondary mb-2">95%</div>
              <div className="text-sm sm:text-base text-gray-600">Match Accuracy</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-brand-secondary mb-2">50%</div>
              <div className="text-sm sm:text-base text-gray-600">Less Time Wasted</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-brand-secondary mb-2">10K+</div>
              <div className="text-sm sm:text-base text-gray-600">Verified Talents</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why TheWrker */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Recruiters Choose TheWrker
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Stop guessing. Start hiring verified talent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Verified Skills</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Every candidate has verified badges proving their actual skills. No fake CVs, no inflated experience.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Faster Matching</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Swipe-based matching and AI-powered recommendations help you find the right candidate in minutes, not weeks.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Target className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Better Fit</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Readiness scores and skill matching ensure candidates are actually ready to work, reducing turnover.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Filter className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Smart Filtering</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Filter by badges, timezone, availability, and readiness score. Find exactly what you need.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Trial Hires</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Start with paid micro-tasks and trial periods. Risk-free hiring before full commitment.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Global Talent</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Access verified talent from around the world. Timezone-friendly matching for your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badge System */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Example Talent Profile</h3>
              <div className="space-y-6">
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
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Readiness Score</span>
                    <span className="text-2xl font-bold text-brand-secondary">87/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-secondary h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                The Badge System Works
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                See exactly what candidates can do before you hire. No more guessing games.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Verified Abilities</h3>
                    <p className="text-gray-600">
                      Each badge represents skills proven through assessments, not just claimed on a CV.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Readiness Score</h3>
                    <p className="text-gray-600">
                      AI-calculated score combines skill, consistency, and performance. Hire people who are ready to work.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Filter & Match</h3>
                    <p className="text-gray-600">
                      Filter candidates by required badges, timezone, availability, and score. Find your perfect hire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-brand-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Hire Smarter?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Join companies hiring verified talent. Book a demo or get started today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Start Hiring Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/30 transition border-2 border-white/30">
              Book a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

