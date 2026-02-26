"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createJob, CreateJobInput } from "@/lib/jobs";
import { getChurchName } from "@/lib/admin";
import { getTemplateById, saveTemplate } from "@/lib/templates";
import {
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  JobCategory,
  EmploymentType,
  WorkArrangement,
} from "@/types/job";

interface FormData {
  title: string;
  category: JobCategory;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  location: string;
  salaryMin: string;
  salaryMax: string;
  salaryType: "hourly" | "annual";
  description: string;
  qualifications: string;
  responsibilities: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  employmentType?: string;
  workArrangement?: string;
  location?: string;
  description?: string;
  salary?: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "Pastoral",
    employmentType: "Full-time",
    workArrangement: "On-site",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryType: "annual",
    description: "",
    qualifications: "",
    responsibilities: "",
  });

  // Load template data if template query param is present
  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          title: template.data.title || "",
          category: (template.data.category as JobCategory) || "Pastoral",
          employmentType: (template.data.employmentType as EmploymentType) || "Full-time",
          workArrangement: (template.data.workArrangement as WorkArrangement) || "On-site",
          description: template.data.description || "",
          qualifications: template.data.qualifications || "",
          responsibilities: template.data.responsibilities || "",
        }));
      }
    }
  }, [searchParams]);

  const churchName = user?.churchId ? getChurchName(user.churchId) : "Your Church";

  const handleSaveAsTemplate = () => {
    if (!templateName.trim() || !user?.churchId) return;

    setIsSavingTemplate(true);

    saveTemplate({
      churchId: user.churchId,
      name: templateName.trim(),
      data: {
        title: formData.title,
        category: formData.category,
        employmentType: formData.employmentType,
        workArrangement: formData.workArrangement,
        description: formData.description,
        qualifications: formData.qualifications,
        responsibilities: formData.responsibilities,
      },
    });

    setIsSavingTemplate(false);
    setTemplateSaveSuccess(true);

    setTimeout(() => {
      setShowTemplateModal(false);
      setTemplateName("");
      setTemplateSaveSuccess(false);
    }, 1500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      if (min > max) {
        newErrors.salary = "Minimum salary cannot be greater than maximum";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, status: "active" | "draft" = "active") => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user?.churchId) return;

    setIsSubmitting(true);

    const input: CreateJobInput = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      employmentType: formData.employmentType,
      workArrangement: formData.workArrangement,
      location: formData.location,
      churchId: user.churchId,
      churchName,
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
      salaryType: formData.salaryType,
      qualifications: formData.qualifications || undefined,
      responsibilities: formData.responsibilities || undefined,
      status,
    };

    createJob(input);
    router.push("/admin/jobs");
  };

  const formatSalary = () => {
    if (!formData.salaryMin && !formData.salaryMax) return null;
    const min = formData.salaryMin ? parseFloat(formData.salaryMin) : null;
    const max = formData.salaryMax ? parseFloat(formData.salaryMax) : null;
    const type = formData.salaryType === "hourly" ? "/hr" : "/yr";

    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}${type}`;
    } else if (min) {
      return `From $${min.toLocaleString()}${type}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}${type}`;
    }
    return null;
  };

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Job Preview</h1>
          <button
            onClick={() => setShowPreview(false)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Edit
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.title || "Job Title"}</h2>
            <p className="text-xl text-primary-600 font-medium">{churchName}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {formData.location || "Location"}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {formData.employmentType} - {formData.workArrangement}
              </span>
              {formatSalary() && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatSalary()}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {formData.category}
              </span>
            </div>
          </div>

          {formData.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Position</h3>
              <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
            </div>
          )}

          {formData.responsibilities && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsibilities</h3>
              <p className="text-gray-700 whitespace-pre-line">{formData.responsibilities}</p>
            </div>
          )}

          {formData.qualifications && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualifications</h3>
              <p className="text-gray-700 whitespace-pre-line">{formData.qualifications}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowPreview(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            Continue Editing
          </button>
          <button
            onClick={(e) => handleSubmit(e, "active")}
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job Listings
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="mt-2 text-gray-600">
          Create a new job listing for {churchName}
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, "active")} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Youth Pastor, Worship Leader"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Austin, TX or Remote"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="workArrangement" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Arrangement <span className="text-red-500">*</span>
                </label>
                <select
                  id="workArrangement"
                  name="workArrangement"
                  value={formData.workArrangement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  {WORK_ARRANGEMENTS.map((arr) => (
                    <option key={arr} value={arr}>
                      {arr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Compensation (Optional)</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Type
                </label>
                <select
                  id="salaryType"
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  <option value="annual">Annual</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>
            {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Details</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe the position, its purpose, and what makes it unique..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                Key Responsibilities
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="List the main responsibilities for this role..."
              />
            </div>

            <div>
              <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications &amp; Requirements
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="List required and preferred qualifications..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Save as Template
          </button>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isSubmitting}
              className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </div>
      </form>

      {/* Save as Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Save as Template</h3>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setTemplateName("");
                  setTemplateSaveSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {templateSaveSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium">Template saved successfully!</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Save the current form data as a reusable template for future job postings.
                </p>
                <div className="mb-6">
                  <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    placeholder="e.g., Youth Pastor Template"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setTemplateName("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    disabled={!templateName.trim() || isSavingTemplate}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSavingTemplate ? "Saving..." : "Save Template"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
