"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Job } from "@/types/job";
import { createApplication } from "@/lib/applications";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationModal({
  job,
  isOpen,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      onClose();
      return;
    }

    // Focus trap
    if (e.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 0);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Add keyboard listener
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to previously focused element
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setError("");
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      createApplication(user.id, job.id, coverLetter, resumeFile?.name);

      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-modal-title"
        aria-describedby="application-modal-description"
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="application-modal-title" className="text-xl font-semibold text-gray-900">
                Apply for Position
              </h2>
              <p id="application-modal-description" className="text-sm text-gray-500 mt-1">
                {job.title} at {job.church.name}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Close application modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          {error && (
            <div
              id="application-error"
              role="alert"
              aria-live="polite"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </div>
          )}

          {/* Applicant info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Applying as:</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-sm font-medium text-primary-600">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              Cover Letter <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <p id="coverLetter-hint" className="text-sm text-gray-500 mb-2">
              Introduce yourself and explain why you&apos;re a great fit for this role
            </p>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              required
              aria-required="true"
              aria-describedby={`coverLetter-hint${error ? " application-error" : ""}`}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              placeholder="Dear Hiring Team,&#10;&#10;I am excited to apply for this position because..."
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700">
              Resume (Optional)
            </label>
            <p id="resume-hint" className="text-sm text-gray-500 mb-2">
              Upload your resume in PDF or Word format (max 10MB)
            </p>
            <div className="mt-1 flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
                <svg
                  className="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Choose File
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  aria-describedby="resume-hint"
                  className="sr-only"
                />
              </label>
              {resumeFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span aria-live="polite">{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="text-red-500 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
                    aria-label={`Remove uploaded file ${resumeFile.name}`}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !coverLetter.trim()}
              aria-disabled={isSubmitting || !coverLetter.trim()}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            By submitting, you agree to share your profile and application with {job.church.name}
          </p>
        </form>
      </div>
    </div>
  );
}
