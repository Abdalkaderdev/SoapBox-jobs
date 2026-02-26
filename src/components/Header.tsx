"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSavedJobs } from "@/contexts/SavedJobsContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { savedJobsCount } = useSavedJobs();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation for mobile menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isMenuOpen) return;

    if (e.key === "Escape") {
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    // Focus trap for mobile menu
    if (e.key === "Tab" && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
              aria-label="SoapBox Jobs - Go to homepage"
            >
              <span className="text-2xl font-bold text-primary-600">SoapBox</span>
              <span className="text-2xl font-light text-gray-600 ml-1">Jobs</span>
            </Link>
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4" aria-label="Main navigation">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Browse all job listings"
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs/saved"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium flex items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={`Saved Jobs${savedJobsCount > 0 ? `, ${savedJobsCount} jobs saved` : ""}`}
            >
              Saved Jobs
              {savedJobsCount > 0 && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" aria-hidden="true">
                  {savedJobsCount}
                </span>
              )}
            </Link>
            {isAuthenticated && user?.role === "church_admin" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Church administration dashboard"
              >
                Church Admin
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link
                  href="/applications"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="View your job applications"
                >
                  My Applications
                </Link>
                <Link
                  href="/alerts"
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Manage your job alerts"
                >
                  Job Alerts
                </Link>
              </>
            )}
            <Link
              href="#"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Information for churches posting jobs"
            >
              For Churches
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 p-1"
                  aria-label={`View profile for ${user?.name || "user"}`}
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <span className="text-sm font-medium text-primary-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Hamburger Button - visible only on mobile */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? (
              // Close icon (X)
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer - slides from right */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-800" id="mobile-menu-title">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Close navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info Section (when logged in) */}
          {isAuthenticated && user && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary-600">
                    {user.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            <ul className="space-y-1" role="list">
              <li>
                <Link
                  href="/jobs"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Browse all job listings"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs/saved"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label={`Saved Jobs${savedJobsCount > 0 ? `, ${savedJobsCount} jobs saved` : ""}`}
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Saved Jobs
                  {savedJobsCount > 0 && (
                    <span className="ml-auto bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center" aria-hidden="true">
                      {savedJobsCount}
                    </span>
                  )}
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      href="/applications"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      aria-label="View your job applications"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      My Applications
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/alerts"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      aria-label="Manage your job alerts"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Job Alerts
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && user?.role === "church_admin" && (
                <li>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label="Church administration dashboard"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Church Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="#"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Information for churches posting jobs"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  For Churches
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sign In / Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full flex items-center justify-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg border border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Sign out of your account"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                onClick={closeMenu}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Sign in to your account"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
