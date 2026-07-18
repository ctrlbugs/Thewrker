"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import ProgressIndicator from "@/components/onboarding/progress-indicator";
import { useAutoSave, AutoSaveIndicator } from "@/components/onboarding/auto-save";
import { ArrowRight, ArrowLeft, Briefcase, Sparkles, Users, Clock, Target, Building2 } from "lucide-react";

const STEPS = [
  "Company Info",
  "Recruiter Profile",
  "Hiring Needs",
  "Volume & Speed",
  "Work Style",
  "Matching Preferences"
];

interface RecruiterFormData {
  // Step 1
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  hiringRegions: string[];
  
  // Step 2
  fullName: string;
  workEmail: string;
  roleTitle: string;
  hiringAuthority: string;
  
  // Step 3
  rolesHiringFor: string[];
  skillPriorities: string[];
  requiredBadges: string[];
  experienceLevel: string;
  
  // Step 4
  expectedHiresPerMonth: string;
  urgency: string;
  interviewAvailability: string;
  
  // Step 5
  teamSize: string;
  workExpectations: string;
  communicationStyle: string;
  
  // Step 6
  autoRecommend: boolean;
  enableSwipe: boolean;
  allowTrainees: boolean;
}

export default function RecruiterOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RecruiterFormData>(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("recruiter_onboarding")
        : null;
    return saved ? JSON.parse(saved) : {
      companyName: "",
      website: "",
      industry: "",
      companySize: "",
      hiringRegions: [],
      fullName: "",
      workEmail: "",
      roleTitle: "",
      hiringAuthority: "",
      rolesHiringFor: [],
      skillPriorities: [],
      requiredBadges: [],
      experienceLevel: "",
      expectedHiresPerMonth: "",
      urgency: "",
      interviewAvailability: "",
      teamSize: "",
      workExpectations: "",
      communicationStyle: "",
      autoRecommend: true,
      enableSwipe: false,
      allowTrainees: false,
    };
  });

  const { lastSaved } = useAutoSave(formData, "recruiter_onboarding");

  const updateField = (field: keyof RecruiterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof RecruiterFormData, value: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.industry && formData.companySize;
      case 2:
        return formData.fullName && formData.workEmail && formData.roleTitle;
      case 3:
        return formData.rolesHiringFor.length > 0;
      case 4:
        return formData.expectedHiresPerMonth && formData.urgency;
      case 5:
        return true; // Optional
      case 6:
        return true;
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
          firstName: formData.fullName.split(" ")[0],
          lastName: formData.fullName.split(" ").slice(1).join(" ") || "",
          email: formData.workEmail,
          password: "temp-password-" + Date.now(), // Will need to handle password separately
          role: "RECRUITER",
          onboardingData: formData,
        }),
      });

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.removeItem("recruiter_onboarding");
        router.push("/dashboard/recruiter");
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-2xl mb-4">
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Find verified talent
            </h1>
            <p className="text-gray-600 text-lg">
              We&apos;ll help you hire the best remote professionals
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
            <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
          </div>

          {/* Form Steps */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Company information</h2>
                  <p className="text-gray-600">Tell us about your company</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Size *
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => updateField("companySize", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hiring Regions (select all that apply)
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["North America", "Europe", "Asia", "Africa", "South America", "Global"].map((region) => (
                      <label key={region} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-brand-secondary/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hiringRegions.includes(region)}
                          onChange={() => updateArrayField("hiringRegions", region)}
                          className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                        />
                        <span className="text-gray-900 font-medium">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 2: Recruiter Profile */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your profile</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) => updateField("workEmail", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role/Title *
                    </label>
                    <input
                      type="text"
                      value={formData.roleTitle}
                      onChange={(e) => updateField("roleTitle", e.target.value)}
                      placeholder="e.g., HR Manager"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hiring Authority Level
                    </label>
                    <select
                      value={formData.hiringAuthority}
                      onChange={(e) => updateField("hiringAuthority", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                    >
                      <option value="">Select level</option>
                      <option value="decision-maker">Decision Maker</option>
                      <option value="influencer">Influencer</option>
                      <option value="executor">Executor</option>
                    </select>
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 3: Hiring Needs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Hiring needs</h2>
                  <p className="text-gray-600">What roles are you hiring for?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Roles Hiring For * (select all that apply)
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Customer Support", "Virtual Assistant", "Sales Representative", "Technical Support", "Account Manager"].map((role) => (
                      <label key={role} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-secondary/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rolesHiringFor.includes(role)}
                          onChange={() => updateArrayField("rolesHiringFor", role)}
                          className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                        />
                        <span className="font-medium">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Level Needed
                  </label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateField("experienceLevel", level.toLowerCase())}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          formData.experienceLevel === level.toLowerCase()
                            ? "border-brand-secondary bg-brand-secondary/5"
                            : "border-gray-200 hover:border-brand-secondary/50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 4: Volume & Speed */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Hiring volume & speed</h2>
                  <p className="text-gray-600">How quickly do you need to hire?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Hires per Month *
                  </label>
                  <select
                    value={formData.expectedHiresPerMonth}
                    onChange={(e) => updateField("expectedHiresPerMonth", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  >
                    <option value="">Select volume</option>
                    <option value="1-5">1-5 hires</option>
                    <option value="6-10">6-10 hires</option>
                    <option value="11-20">11-20 hires</option>
                    <option value="20+">20+ hires</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Urgency *
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: "immediate", label: "Immediate", desc: "Need to hire now" },
                      { id: "30", label: "30 days", desc: "Within a month" },
                      { id: "90", label: "90 days", desc: "Within 3 months" },
                    ].map((urgency) => (
                      <button
                        key={urgency.id}
                        onClick={() => updateField("urgency", urgency.id)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                          formData.urgency === urgency.id
                            ? "border-brand-secondary bg-brand-secondary/5"
                            : "border-gray-200 hover:border-brand-secondary/50"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{urgency.label}</div>
                        <div className="text-sm text-gray-600">{urgency.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 5: Work Style */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Work style & culture</h2>
                  <p className="text-gray-600">Help us understand your team culture</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Size
                  </label>
                  <input
                    type="text"
                    value={formData.teamSize}
                    onChange={(e) => updateField("teamSize", e.target.value)}
                    placeholder="e.g., 10-20 people"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Expectations
                  </label>
                  <textarea
                    value={formData.workExpectations}
                    onChange={(e) => updateField("workExpectations", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Describe your work expectations..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Communication Style
                  </label>
                  <textarea
                    value={formData.communicationStyle}
                    onChange={(e) => updateField("communicationStyle", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="How does your team communicate?"
                  />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 6: Matching Preferences */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Matching preferences</h2>
                  <p className="text-gray-600">Customize how we match talent to your needs</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-brand-secondary/50 transition">
                    <div>
                      <div className="font-semibold text-gray-900">Auto-recommend talents</div>
                      <div className="text-sm text-gray-600">Get AI-powered talent recommendations</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.autoRecommend}
                      onChange={(e) => updateField("autoRecommend", e.target.checked)}
                      className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-brand-secondary/50 transition">
                    <div>
                      <div className="font-semibold text-gray-900">Enable swipe matching</div>
                      <div className="text-sm text-gray-600">Use our swipe interface to review candidates</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.enableSwipe}
                      onChange={(e) => updateField("enableSwipe", e.target.checked)}
                      className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-brand-secondary/50 transition">
                    <div>
                      <div className="font-semibold text-gray-900">Allow trainees with certification</div>
                      <div className="text-sm text-gray-600">Consider certified trainees who completed our program</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.allowTrainees}
                      onChange={(e) => updateField("allowTrainees", e.target.checked)}
                      className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                    />
                  </label>
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

