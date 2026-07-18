"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function PageHeader({ 
  title, 
  subtitle,
  showBackButton = true 
}: { 
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}) {
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                href="/"
                className="inline-flex items-center text-brand-secondary hover:text-brand-secondary/80 transition"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-secondary transition"
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

