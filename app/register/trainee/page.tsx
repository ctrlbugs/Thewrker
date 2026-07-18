"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import ProgressIndicator from "@/components/onboarding/progress-indicator";
import { useAutoSave, AutoSaveIndicator } from "@/components/onboarding/auto-save";
import { ArrowRight, ArrowLeft, GraduationCap, Sparkles, Clock, Target, BookOpen } from "lucide-react";

const STEPS = [
  "Profile",
  "Career Intent",
  "Availability",
  "Background",
  "Learning Style",
  "Goals"
];

interface TraineeFormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  
  // Step 2
  desiredRole: string;
  
  // Step 3
  weeklyAvailability: string;
  preferredWorkType: string;
  timezoneFlexibility: string;
  targetStartDate: string;
  
  // Step 4
  remoteExperience: string;
  comfortableWith: string[];
  backgroundNote: string;
  
  // Step 5
  learningStyle: string[];
  learningSpeed: string;
  
  // Step 6
  motivation: string;
  successVision: string;
}

export default function TraineeOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TraineeFormData>(() => {
    if (typeof window === "undefined") {
      return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      timezone: "",
      preferredLanguage: "English",
      desiredRole: "",
      weeklyAvailability: "",
      preferredWorkType: "",
      timezoneFlexibility: "",
      targetStartDate: "",
      remoteExperience: "",
      comfortableWith: [],
      backgroundNote: "",
      learningStyle: [],
      learningSpeed: "",
      motivation: "",
      successVision: "",
      };
    }
    const saved = localStorage.getItem("trainee_onboarding");
    return saved ? JSON.parse(saved) : {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      timezone: "",
      preferredLanguage: "English",
      desiredRole: "",
      weeklyAvailability: "",
      preferredWorkType: "",
      timezoneFlexibility: "",
      targetStartDate: "",
      remoteExperience: "",
      comfortableWith: [],
      backgroundNote: "",
      learningStyle: [],
      learningSpeed: "",
      motivation: "",
      successVision: "",
    };
  });

  const { lastSaved } = useAutoSave(formData, "trainee_onboarding");

  const updateField = (field: keyof TraineeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof TraineeFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      if (checked) {
        return { ...prev, [field]: [...current, value] };
      } else {
        return { ...prev, [field]: current.filter(item => item !== value) };
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.password;
      case 2:
        return formData.desiredRole;
      case 3:
        return formData.weeklyAvailability && formData.preferredWorkType;
      case 4:
        return true; // Optional step
      case 5:
        return formData.learningSpeed;
      case 6:
        return true; // Optional step
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
          role: "TRAINEE",
          onboardingData: formData,
        }),
      });

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.removeItem("trainee_onboarding");
        router.push("/dashboard/trainee");
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-secondary/10 rounded-2xl mb-4">
              <GraduationCap className="h-8 w-8 text-brand-secondary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Let&apos;s get you job-ready
            </h1>
            <p className="text-gray-600 text-lg">
              We&apos;ll train you, certify you, and connect you with opportunities
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
            <ProgressIndicator currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
          </div>

          {/* Form Steps */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
                  <p className="text-gray-600">No experience? That&apos;s okay. We&apos;ll train you.</p>
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
                  <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                      <option value="KE">Kenya</option>
                      {/* Add more countries */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => updateField("preferredLanguage", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 2: Career Intent */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you want to train for?</h2>
                  <p className="text-gray-600">Choose the role that interests you most</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: "va", name: "Virtual Assistant", pay: "$30k - $50k", demand: "High" },
                    { id: "csr", name: "Customer Care Representative", pay: "$35k - $55k", demand: "Very High" },
                    { id: "sales", name: "Sales Representative", pay: "$40k - $70k", demand: "High" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => updateField("desiredRole", role.id)}
                      className={`p-6 border-2 rounded-2xl text-left transition-all ${
                        formData.desiredRole === role.id
                          ? "border-brand-secondary bg-brand-secondary/5 shadow-lg"
                          : "border-gray-200 hover:border-brand-secondary/50"
                      }`}
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{role.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>💵 {role.pay}</span>
                        <span>📈 {role.demand} demand</span>
                      </div>
                    </button>
                  ))}
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 3: Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your availability</h2>
                  <p className="text-gray-600">This helps us match you with the right opportunities</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weekly Availability (hours) *
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
                    Preferred Work Type *
                  </label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {["Full-time", "Part-time", "Flexible"].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("preferredWorkType", type.toLowerCase())}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          formData.preferredWorkType === type.toLowerCase()
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
                    Target Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetStartDate}
                    onChange={(e) => updateField("targetStartDate", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                  />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 4: Background */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your background</h2>
                  <p className="text-gray-600">Help us personalize your training</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Have you worked remotely before?
                  </label>
                  <div className="flex gap-4">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        onClick={() => updateField("remoteExperience", option.toLowerCase())}
                        className={`px-6 py-3 border-2 rounded-xl transition-all ${
                          formData.remoteExperience === option.toLowerCase()
                            ? "border-brand-secondary bg-brand-secondary/5"
                            : "border-gray-200 hover:border-brand-secondary/50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Comfortable with: (select all that apply)
                  </label>
                  <div className="space-y-2">
                    {["Email", "Chat tools", "Video calls", "Basic computer usage"].map((item) => (
                      <label key={item} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-brand-secondary/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.comfortableWith.includes(item)}
                          onChange={(e) => updateArrayField("comfortableWith", item, e.target.checked)}
                          className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                        />
                        <span className="text-gray-900 font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anything else we should know? (Optional)
                  </label>
                  <textarea
                    value={formData.backgroundNote}
                    onChange={(e) => updateField("backgroundNote", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Tell us about your background..."
                  />
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 5: Learning Style */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you learn best?</h2>
                  <p className="text-gray-600">We&apos;ll tailor your training experience</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Learning Style (select all that apply)
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {["Video", "Practice tasks", "Reading", "Interactive quizzes"].map((style) => (
                      <label key={style} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-brand-secondary/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.learningStyle.includes(style)}
                          onChange={(e) => updateArrayField("learningStyle", style, e.target.checked)}
                          className="w-5 h-5 text-brand-secondary rounded focus:ring-brand-secondary"
                        />
                        <span className="text-gray-900 font-medium">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Learning Speed *
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: "slow", label: "Slow & steady", desc: "Take your time" },
                      { id: "balanced", label: "Balanced", desc: "Moderate pace" },
                      { id: "fast", label: "Fast-paced", desc: "Learn quickly" },
                    ].map((speed) => (
                      <button
                        key={speed.id}
                        onClick={() => updateField("learningSpeed", speed.id)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                          formData.learningSpeed === speed.id
                            ? "border-brand-secondary bg-brand-secondary/5"
                            : "border-gray-200 hover:border-brand-secondary/50"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{speed.label}</div>
                        <div className="text-sm text-gray-600">{speed.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <AutoSaveIndicator lastSaved={lastSaved} />
              </div>
            )}

            {/* Step 6: Goals */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your goals & motivation</h2>
                  <p className="text-gray-600">Help us keep you motivated throughout your journey</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Why do you want this role? (Optional)
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Share your motivation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What does success look like in 6 months? (Optional)
                  </label>
                  <textarea
                    value={formData.successVision}
                    onChange={(e) => updateField("successVision", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="Describe your vision of success..."
                  />
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

