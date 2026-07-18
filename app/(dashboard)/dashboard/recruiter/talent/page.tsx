"use client";

import { useState } from "react";
import { Search, Filter, Award, MapPin, Briefcase, Star, Eye } from "lucide-react";

const talent = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Customer Support Specialist",
    location: "New York, NY",
    experience: "5 years",
    matchScore: 95,
    skills: ["Zendesk", "CRM", "Email Support", "Chat Support"],
    certifications: ["CSR Certified", "VA Certified"],
    availability: "Full-time",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Virtual Assistant",
    location: "San Francisco, CA",
    experience: "3 years",
    matchScore: 92,
    skills: ["Calendar Management", "Email Management", "Data Entry"],
    certifications: ["VA Certified"],
    availability: "Full-time",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Sales Representative",
    location: "Austin, TX",
    experience: "4 years",
    matchScore: 88,
    skills: ["Lead Generation", "Sales", "CRM", "Negotiation"],
    certifications: ["Sales Certified"],
    availability: "Full-time",
    rating: 4.7,
  },
];

export default function RecruiterTalentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkills, setFilterSkills] = useState<string[]>([]);

  const filteredTalent = talent.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Talent</h1>
        <p className="text-gray-600">Search and filter verified talent by skills and experience</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, title, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent text-gray-900 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Talent Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalent.map((person) => (
          <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-brand-secondary font-bold text-lg">{person.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{person.name}</h3>
                  <p className="text-sm text-gray-600">{person.title}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                {person.matchScore}% Match
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {person.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                {person.experience}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                {person.rating} Rating
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                {person.certifications.length} Certifications
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {person.skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {person.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">+{person.skills.length - 3}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold">
                View Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
