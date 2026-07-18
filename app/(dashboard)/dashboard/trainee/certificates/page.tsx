"use client";

import { Award, Download, CheckCircle, Calendar } from "lucide-react";

const certificates = [
  {
    id: "1",
    title: "Customer Support Representative",
    issuedDate: "March 15, 2024",
    status: "completed",
    score: 92,
  },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificates</h1>
        <p className="text-gray-600">View and download your earned certificates</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-4">Complete a training track to earn your first certificate</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-brand-secondary" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{cert.title}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Issued: {cert.issuedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Score: {cert.score}%
                </div>
              </div>
              <button className="w-full px-4 py-3 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition font-semibold flex items-center justify-center gap-2">
                <Download className="h-5 w-5" />
                Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
