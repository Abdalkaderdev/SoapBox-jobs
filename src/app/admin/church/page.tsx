"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getChurchName } from "@/lib/admin";

interface ChurchProfile {
  id: string;
  name: string;
  denomination?: string;
  size?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
  aboutTeam?: string;
  benefits?: string;
}

const STORAGE_KEY = "soapbox_church_profiles";

const DENOMINATION_OPTIONS = [
  "Non-denominational",
  "Baptist",
  "Methodist",
  "Presbyterian",
  "Lutheran",
  "Pentecostal",
  "Catholic",
  "Anglican/Episcopal",
  "Church of Christ",
  "Assembly of God",
  "Evangelical Free",
  "Other",
];

const SIZE_OPTIONS = [
  "Under 100",
  "100-250",
  "250-500",
  "500-1000",
  "1000-2500",
  "2500-5000",
  "Over 5000",
];

function getStoredProfiles(): Record<string, ChurchProfile> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProfile(profile: ChurchProfile): void {
  if (typeof window === "undefined") return;
  const profiles = getStoredProfiles();
  profiles[profile.id] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function getProfile(churchId: string): ChurchProfile | null {
  const profiles = getStoredProfiles();
  return profiles[churchId] || null;
}

export default function ChurchProfilePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [formData, setFormData] = useState<ChurchProfile>({
    id: "",
    name: "",
    denomination: "",
    size: "",
    location: "",
    description: "",
    logoUrl: "",
    aboutTeam: "",
    benefits: "",
  });

  useEffect(() => {
    if (user?.churchId) {
      const storedProfile = getProfile(user.churchId);
      if (storedProfile) {
        setFormData(storedProfile);
      } else {
        // Initialize with default name from mock data
        const defaultName = getChurchName(user.churchId);
        setFormData({
          id: user.churchId,
          name: defaultName,
          denomination: "",
          size: "",
          location: "",
          description: "",
          logoUrl: "",
          aboutTeam: "",
          benefits: "",
        });
      }
      setIsLoaded(true);
    }
  }, [user]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload - just store the filename
      setFormData((prev) => ({ ...prev, logoUrl: file.name }));
      setSaveSuccess(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a brief save delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    saveProfile(formData);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Church Profile Preview</h1>
          <button
            onClick={() => setShowPreview(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Edit
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12">
            <div className="flex items-center gap-6">
              {formData.logoUrl ? (
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-md">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg className="h-12 w-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold text-white">{formData.name || "Church Name"}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm">
                  {formData.denomination && <span>{formData.denomination}</span>}
                  {formData.size && <span>{formData.size} members</span>}
                  {formData.location && (
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {formData.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {formData.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Our Church</h3>
                <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
              </div>
            )}

            {formData.aboutTeam && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Our Team</h3>
                <p className="text-gray-700 whitespace-pre-line">{formData.aboutTeam}</p>
              </div>
            )}

            {formData.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Offer</h3>
                <p className="text-gray-700 whitespace-pre-line">{formData.benefits}</p>
              </div>
            )}

            {!formData.description && !formData.aboutTeam && !formData.benefits && (
              <div className="text-center py-8 text-gray-500">
                <p>No additional information provided yet.</p>
                <p className="text-sm mt-2">Add a description, team info, or benefits to enhance your profile.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowPreview(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Continue Editing
          </button>
          <button
            onClick={() => {
              handleSave();
              setShowPreview(false);
            }}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Church Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage how your church appears to job seekers
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-medium">Profile saved successfully!</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Church Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.logoUrl ? (
                    <div className="text-center">
                      <svg className="h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  ) : (
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {formData.logoUrl ? "Change Logo" : "Upload Logo"}
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="ml-3 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                  {formData.logoUrl && (
                    <p className="mt-1 text-sm text-gray-500">Current: {formData.logoUrl}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Church Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Church Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="e.g., Grace Community Church"
              />
            </div>

            {/* Denomination & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-1">
                  Denomination
                </label>
                <select
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  <option value="">Select denomination...</option>
                  {DENOMINATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Church Size
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  <option value="">Select size...</option>
                  {SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="e.g., Austin, TX"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Church Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="Tell job seekers about your church's mission, values, and community..."
              />
            </div>
          </div>
        </div>

        {/* About Our Team */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About Our Team</h2>
          <p className="text-sm text-gray-500 mb-4">
            Share information about your staff culture, leadership, and what it&apos;s like to work at your church.
          </p>

          <textarea
            id="aboutTeam"
            name="aboutTeam"
            value={formData.aboutTeam}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            placeholder="Describe your team culture, leadership style, staff meetings, development opportunities, etc."
          />
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What We Offer</h2>
          <p className="text-sm text-gray-500 mb-4">
            List the benefits and perks of working at your church.
          </p>

          <textarea
            id="benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            placeholder="Examples: Health insurance, retirement plan, paid time off, professional development budget, sabbatical program, flexible schedule, etc."
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Preview Profile
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
