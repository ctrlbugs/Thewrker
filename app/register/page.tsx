"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import { User, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type UserRole = "trainee" | "talent" | "recruiter";

export default function RegisterPage() {
  const router = useRouter();

  const roleOptions = [
    {
      role: "trainee" as UserRole,
      icon: GraduationCap,
      title: "Trainee",
      description: "I want to learn new skills and complete training tracks",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
      href: "/register/trainee",
    },
    {
      role: "talent" as UserRole,
      icon: User,
      title: "Talent",
      description: "I have skills and I'm ready to get hired",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      hoverBorder: "hover:border-green-400",
      href: "/register/talent",
    },
    {
      role: "recruiter" as UserRole,
      icon: Briefcase,
      title: "Recruiter",
      description: "I want to hire verified remote talent",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-400",
      href: "/register/recruiter",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 pt-24 min-h-[calc(100vh-4rem)]">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Join TheWrker
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Choose your path and start your remote career journey
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sm:p-10 transform transition-all hover:shadow-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
              I want to join as...
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.role}
                    href={option.href}
                    className="relative p-8 border-2 border-gray-200 rounded-2xl hover:border-brand-secondary hover:shadow-xl transition-all text-left group overflow-hidden transform hover:scale-[1.02]"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon className={`h-8 w-8 ${option.iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {option.description}
                      </p>
                      <div className="flex items-center text-brand-secondary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-secondary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
