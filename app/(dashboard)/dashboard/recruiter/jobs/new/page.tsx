"use client";

import { useState } from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [""],
    location: "Remote",
    type: "Full-time",
    salary: "",
    experience: "1-2 years",
    status: "DRAFT",
  });

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    setFormData({ ...formData, requirements: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, save to API
    alert("Job posted successfully!");
    router.push("/dashboard/recruiter/jobs");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Job</h1>
        <p className="text-gray-600">Create a job posting to attract top talent</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
              placeholder="e.g., Customer Support Specialist"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
                placeholder="Remote, Global"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
                placeholder="e.g., $45,000 - $65,000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Required</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
              >
                <option>No experience</option>
                <option>1-2 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
            <div className="space-y-3">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
                    placeholder="e.g., 2+ years experience in customer support"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-secondary hover:bg-blue-50 transition text-gray-700 font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Requirement
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Post Job
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
