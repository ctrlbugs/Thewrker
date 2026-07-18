"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import ProgressIndicator from "@/components/onboarding/progress-indicator";
import { useAutoSave, AutoSaveIndicator } from "@/components/onboarding/auto-save";
import { ArrowRight, ArrowLeft, User, Sparkles, Briefcase, Upload, Linkedin, CheckCircle } from "lucide-react";

const STEPS = [
  "Identity",
  "Professional Summary",
  "Skills & Tools",
  "Resume & Profile",
  "Availability",
  "Verification"
];

interface TalentFormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  linkedinUrl: string;
  portfolioUrl: string;
  
  // Step 2
  primaryRole: string;
  yearsExperience: string;
  secondarySkills: string[];
  summary: string;
  
  // Step 3
  coreSkills: Record<string, string>;
  tools: Record<string, string>;
  
  // Step 4
  resumeUrl: string;
  importSource: string;
  
  // Step 5
  weeklyAvailability: string;
  contractType: string;
  payExpectations: string;
  timezoneCompatibility: string;
  
  // Step 6
  verificationPath: string;
}

export default function TalentOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TalentFormData>(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("talent_onboarding")
        : null;
    return saved ? JSON.parse(saved) : {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      timezone: "",
      preferredLanguage: "English",
      linkedinUrl: "",
      portfolioUrl: "",
      primaryRole: "",
      yearsExperience: "",
      secondarySkills: [],
      summary: "",
      coreSkills: {},
      tools: {},
      resumeUrl: "",
      importSource: "",
      weeklyAvailability: "",
      contractType: "",
      payExpectations: "",
      timezoneCompatibility: "",
      verificationPath: "",
    };
  });

  const { lastSaved } = useAutoSave(formData, "talent_onboarding");

  const updateField = (field: keyof TalentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSkill = (skill: string, proficiency: string) => {
    setFormData(prev => ({
      ...prev,
      coreSkills: { ...prev.coreSkills, [skill]: proficiency }
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.password;
      case 2:
        return formData.primaryRole && formData.yearsExperience;
      case 3:
        return Object.keys(formData.coreSkills).length > 0;
      case 4:
        return true; // Optional
      case 5:
        return formData.weeklyAvailability && formData.contractType;
      case 6:
        return formData.verificationPath;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "TALENT",
          onboardingData: formData,
        }),
      });

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.removeItem("talent_onboarding");
        router.push("/dashboard/talent");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Showcase your skills
            </h1>
            <p className="text-gray-600 text-lg">
              We&apos;ll verify your expertise and connect you with opportunities
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
            <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
          </div>

          {/* Form Steps */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your identity</h2>
                  <p className="text-gray-600">Let&apos;s start with the basics</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => updateField("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio Link (Optional)
                  </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => updateField("portfolioUrl", e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 2: Professional Summary */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional summary</h2>
                  <p className="text-gray-600">We&apos;ll clean this up later — focus on accuracy</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Role *
                  </label>
                  <select
                    value={formData.primaryRole}
                    onChange={(e) => updateField("primaryRole", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  >
                    <option value="">Select role</option>
                    <option value="customer-support">Customer Support</option>
                    <option value="virtual-assistant">Virtual Assistant</option>
                    <option value="sales">Sales Representative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => updateField("yearsExperience", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-5">4-5 years</option>
                    <option value="6+">6+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Summary
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => updateField("summary", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Brief summary of your professional background..."
                  />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 3: Skills & Tools */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & tools</h2>
                  <p className="text-gray-600">Rate your proficiency level</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Core Skills * (Select at least one)
                  </label>
                  <div className="space-y-4">
                    {["Customer Support", "Communication", "Problem Solving", "CRM Tools", "Email Management"].map((skill) => (
                      <div key={skill} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                        <span className="font-medium text-gray-900">{skill}</span>
                        <select
                          value={formData.coreSkills[skill] || ""}
                          onChange={(e) => updateSkill(skill, e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary text-gray-900 bg-white"
                        >
                          <option value="">Select level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 4: Resume Import */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume & profile</h2>
                  <p className="text-gray-600">Import your resume or build your profile manually</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => updateField("importSource", "upload")}
                    className={`p-6 border-2 rounded-2xl transition-all ${
                      formData.importSource === "upload"
                        ? "border-brand-secondary bg-brand-secondary/5"
                        : "border-gray-200 hover:border-brand-secondary/50"
                    }`}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-3 text-brand-secondary" />
                    <div className="font-semibold">Upload CV</div>
                  </button>

                  <button
                    onClick={() => updateField("importSource", "linkedin")}
                    className={`p-6 border-2 rounded-2xl transition-all ${
                      formData.importSource === "linkedin"
                        ? "border-brand-secondary bg-brand-secondary/5"
                        : "border-gray-200 hover:border-brand-secondary/50"
                    }`}
                  >
                    <Linkedin className="h-8 w-8 mx-auto mb-3 text-brand-secondary" />
                    <div className="font-semibold">Import LinkedIn</div>
                  </button>

                  <button
                    onClick={() => updateField("importSource", "manual")}
                    className={`p-6 border-2 rounded-2xl transition-all ${
                      formData.importSource === "manual"
                        ? "border-brand-secondary bg-brand-secondary/5"
                        : "border-gray-200 hover:border-brand-secondary/50"
                    }`}
                  >
                    <Briefcase className="h-8 w-8 mx-auto mb-3 text-brand-secondary" />
                    <div className="font-semibold">Manual Entry</div>
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">AI-Powered Import</h4>
                      <p className="text-sm text-blue-700">
                        Our AI will automatically extract and organize your information
                      </p>
                    </div>
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 5: Availability */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & preferences</h2>
                  <p className="text-gray-600">When and how do you want to work?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weekly Availability *
                  </label>
                  <select
                    value={formData.weeklyAvailability}
                    onChange={(e) => updateField("weeklyAvailability", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  >
                    <option value="">Select hours</option>
                    <option value="10-20">10-20 hours</option>
                    <option value="20-30">20-30 hours</option>
                    <option value="30-40">30-40 hours</option>
                    <option value="40+">40+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Contract Type *
                  </label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {["Full-time", "Part-time", "Contract"].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("contractType", type.toLowerCase())}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          formData.contractType === type.toLowerCase()
                            ? "border-brand-secondary bg-brand-secondary/5"
                            : "border-gray-200 hover:border-brand-secondary/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pay Expectations
                  </label>
                    <input
                      type="text"
                      value={formData.payExpectations}
                      onChange={(e) => updateField("payExpectations", e.target.value)}
                      placeholder="e.g., $40,000 - $60,000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 6: Verification */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification path</h2>
                  <p className="text-gray-600">Choose how you want to verify your skills</p>
                  <p className="text-sm text-orange-600 mt-2">No verification = limited job visibility</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "assessment", label: "Take Skill Assessment", desc: "Quick test to verify your skills" },
                    { id: "proof", label: "Upload Proof of Work", desc: "Portfolio, testimonials, or case studies" },
                    { id: "certification", label: "Fast-track Certification", desc: "Complete our training program" },
                  ].map((path) => (
                    <button
                      key={path.id}
                      onClick={() => updateField("verificationPath", path.id)}
                      className={`w-full p-6 border-2 rounded-2xl text-left transition-all ${
                        formData.verificationPath === path.id
                          ? "border-brand-secondary bg-brand-secondary/5"
                          : "border-gray-200 hover:border-brand-secondary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg text-gray-900 mb-1">{path.label}</div>
                          <div className="text-sm text-gray-600">{path.desc}</div>
                        </div>
                        {formData.verificationPath === path.id && (
                          <CheckCircle className="h-6 w-6 text-brand-secondary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>

              {currentStep < STEPS.length ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl hover:bg-brand-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg ml-auto"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-xl hover:bg-brand-secondary/90 transition"
                >
                  Complete Setup
                  <Sparkles className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

