"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-background border-t border-gray-200 dark:border-gray-500 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="text-center space-y-4">
          {/* About Link */}
          <div>
            <Link
              href="/about"
              className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
            >
              About MijuBlog.vercel.app
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Link
              href="/privacy"
              className="hover:text-orange-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>/</span>
            <Link
              href="/sitemap.xml"
              className="hover:text-orange-600 transition-colors"
            >
              Site Map
            </Link>
            <span>/</span>
            <Link
              href="/contact-us"
              className="hover:text-orange-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500 pt-4">
            <p>Copyright © {currentYear} MijuBlog.vercel.app</p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full shadow-lg transition-colors"
            aria-label="Back to top"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
