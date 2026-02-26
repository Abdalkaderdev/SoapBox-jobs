"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getTemplateById, updateTemplate, JobTemplate } from "@/lib/templates";
import {
  JOB_CATEGORIES,
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  JobCategory,
  EmploymentType,
  WorkArrangement,
} from "@/types/job";

interface FormData {
  name: string;
  title: string;
  category: JobCategory;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  description: string;
  qualifications: string;
  responsibilities: string;
}

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<JobTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    category: "Pastoral",
    employmentType: "Full-time",
    workArrangement: "On-site",
    description: "",
    qualifications: "",
    responsibilities: "",
  });

  useEffect(() => {
    const templateId = params.id as string;
    const foundTemplate = getTemplateById(templateId);

    if (foundTemplate) {
      if (foundTemplate.churchId !== user?.churchId) {
        router.push("/admin/templates");
        return;
      }
      setTemplate(foundTemplate);
      setFormData({
        name: foundTemplate.name,
        title: foundTemplate.data.title,
        category: foundTemplate.data.category as JobCategory,
        employmentType: foundTemplate.data.employmentType as EmploymentType,
        workArrangement: foundTemplate.data.workArrangement as WorkArrangement,
        description: foundTemplate.data.description,
        qualifications: foundTemplate.data.qualifications,
        responsibilities: foundTemplate.data.responsibilities,
      });
    }
    setIsLoading(false);
  }, [params.id, user?.churchId, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!template || !formData.name.trim()) return;

    setIsSaving(true);

    updateTemplate(template.id, {
      name: formData.name,
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

    router.push("/admin/templates");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Template not found</h3>
          <p className="mt-2 text-gray-600">
            The template you are looking for does not exist or has been deleted.
          </p>
          <Link
            href="/admin/templates"
            className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/admin/templates"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Templates
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Template</h1>
        <p className="mt-2 text-gray-600">Update your job posting template.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Template Name */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Template Name</h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              placeholder="e.g., Youth Pastor Template"
              required
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="e.g., Youth Pastor, Worship Leader"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
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
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
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
                  Work Arrangement
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

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Job Details</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                placeholder="Describe the position, its purpose, and what makes it unique..."
              />
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
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link
            href="/admin/templates"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving || !formData.name.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
