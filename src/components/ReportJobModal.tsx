"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveReport, REPORT_REASONS, ReportReason } from "@/lib/reports";

interface ReportJobModalProps {
  jobId: string;
  jobTitle: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportJobModal({
  jobId,
  jobTitle,
  userId,
  isOpen,
  onClose,
  onSuccess,
}: ReportJobModalProps) {
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap and keyboard handling for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen || showConfirmation) return;

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
  }, [isOpen, showConfirmation, onClose]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      saveReport(userId, jobId, reason, details || undefined);

      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        onSuccess();
        onClose();
        // Reset form
        setReason("");
        setDetails("");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !showConfirmation) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!showConfirmation) {
      setReason("");
      setDetails("");
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
        aria-labelledby="report-modal-title"
        aria-describedby={showConfirmation ? "report-confirmation" : "report-modal-description"}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        {showConfirmation ? (
          // Confirmation message
          <div className="p-8 text-center" role="status" aria-live="polite">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 id="report-confirmation" className="text-xl font-semibold text-gray-900 mb-2">
              Report Submitted
            </h3>
            <p className="text-gray-600">
              Thank you for helping keep our community safe. We will review your
              report and take appropriate action.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="report-modal-title" className="text-xl font-semibold text-gray-900">
                    Report Job Listing
                  </h2>
                  <p id="report-modal-description" className="text-sm text-gray-500 mt-1 truncate max-w-[250px]">
                    {jobTitle}
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label="Close report modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for reporting <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  required
                  aria-required="true"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <option value="">Select a reason</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional details (optional)
                </label>
                <p id="details-hint" className="sr-only">
                  Provide any additional information that may help us investigate this report
                </p>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  aria-describedby="details-hint"
                  placeholder="Please provide any additional information that may help us investigate this report..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600" role="note">
                <p>
                  Your report will be reviewed by our team. We take all reports
                  seriously and will take appropriate action if the listing
                  violates our community guidelines.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason}
                  aria-disabled={isSubmitting || !reason}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
