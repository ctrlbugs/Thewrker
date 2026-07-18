"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import BrandLogo from "@/components/brand-logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/explore" className="flex items-center group">
            <BrandLogo size="md" variant="dark" className="transition-transform group-hover:scale-[1.02]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-brand-secondary transition font-medium text-sm lg:text-base">
              Jobs
            </Link>
            <Link href="/talent" className="text-gray-700 hover:text-brand-secondary transition font-medium text-sm lg:text-base">
              For Talent
            </Link>
            <Link href="/recruiter" className="text-gray-700 hover:text-brand-secondary transition font-medium text-sm lg:text-base">
              For Recruiters
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-brand-secondary transition font-medium text-sm lg:text-base">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-brand-secondary text-white px-5 py-2.5 rounded-lg hover:bg-brand-secondary/90 transition font-semibold text-sm lg:text-base shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
            
            {/* Desktop Social Icons */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Twitter/X"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -mr-2 text-gray-700 hover:text-brand-secondary transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/jobs"
              className="block px-4 py-3 text-gray-700 hover:text-brand-secondary hover:bg-gray-50 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              href="/talent"
              className="block px-4 py-3 text-gray-700 hover:text-brand-secondary hover:bg-gray-50 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Talent
            </Link>
            <Link
              href="/recruiter"
              className="block px-4 py-3 text-gray-700 hover:text-brand-secondary hover:bg-gray-50 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Recruiters
            </Link>
            <Link
              href="/login"
              className="block px-4 py-3 text-gray-700 hover:text-brand-secondary hover:bg-gray-50 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block bg-brand-secondary text-white px-4 py-3 rounded-lg text-center hover:bg-brand-secondary/90 transition font-semibold mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center justify-center space-x-4 pt-4 mt-4 border-t border-gray-200">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Twitter/X"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-brand-secondary transition p-2 hover:bg-gray-100 rounded-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
