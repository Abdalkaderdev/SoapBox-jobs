"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getApplication, updateApplicationStatus } from "@/lib/applications";
import { getApplicationMessages, addMessage, markMessagesAsRead } from "@/lib/messages";
import { mockJobs } from "@/lib/mock-data";
import { mockUsers } from "@/lib/mock-users";
import {
  Application,
  ApplicationStatus,
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_COLORS,
} from "@/types/application";
import { Message } from "@/types/message";

interface AdminApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminApplicationDetailPage({ params }: AdminApplicationDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin");
      } else if (user?.role !== "church_admin") {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user && id) {
      const app = getApplication(id);
      if (app) {
        // Verify this application is for a job at the admin's church
        const job = mockJobs.find((j) => j.id === app.jobId);
        if (job && job.church.id === user.churchId) {
          setApplication(app);
          setMessages(getApplicationMessages(id));
          markMessagesAsRead(id, user.id);
        } else {
          router.push("/admin/applications");
        }
      } else {
        router.push("/admin/applications");
      }
    }
  }, [user, id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !application || !newMessage.trim()) return;

    setIsSending(true);

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addMessage(application.id, user.id, user.name, "employer", newMessage.trim());
    setMessages(getApplicationMessages(application.id));
    setNewMessage("");
    setIsSending(false);
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    setIsUpdatingStatus(true);

    // Simulate update delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updated = updateApplicationStatus(application.id, newStatus);
    if (updated) {
      setApplication(updated);
    }

    setIsUpdatingStatus(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get applicant info from mock users
  const getApplicant = () => {
    if (!application) return null;
    return mockUsers.find((u) => u.id === application.userId);
  };

  if (isLoading || !application) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const job = mockJobs.find((j) => j.id === application.jobId);
  const applicant = getApplicant();

  if (!job) {
    router.push("/admin/applications");
    return null;
  }

  const statusOptions: ApplicationStatus[] = [
    "submitted",
    "under_review",
    "interview_requested",
    "offer_extended",
    "hired",
    "not_selected",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/admin/applications"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Applications
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Profile Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                {applicant?.profilePhoto ? (
                  <img
                    src={applicant.profilePhoto}
                    alt={applicant.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary-600">
                    {applicant?.name?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {applicant?.name || "Unknown Applicant"}
                </h1>
                <p className="text-gray-600">{applicant?.email || "No email available"}</p>
                {applicant?.ministryStatement && (
                  <p className="mt-2 text-sm text-gray-700 italic">
                    &ldquo;{applicant.ministryStatement}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Applied for: {job.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Applied: {formatDate(application.appliedAt)}</span>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h2>
            <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>
          </div>

          {/* Resume */}
          {application.resumeFilename && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-gray-600"
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
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{application.resumeFilename}</p>
                  <p className="text-sm text-gray-500">Attached resume</p>
                </div>
                {application.resumeUrl && (
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Messaging Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === "employer" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.senderType === "employer"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium ${
                              message.senderType === "employer"
                                ? "text-primary-200"
                                : "text-gray-600"
                            }`}
                          >
                            {message.senderName}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderType === "employer" ? "text-primary-200" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No messages yet. Send a message to the applicant.
                </p>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Update Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>

            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  APPLICATION_STATUS_COLORS[application.status]
                }`}
              >
                {APPLICATION_STATUS_LABELS[application.status]}
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Update Status</label>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                disabled={isUpdatingStatus}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 disabled:opacity-50"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {APPLICATION_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              {isUpdatingStatus && (
                <p className="text-sm text-gray-500">Updating status...</p>
              )}
            </div>

            {application.lastStatusChangeAt && (
              <p className="mt-4 text-xs text-gray-500">
                Last updated: {formatDate(application.lastStatusChangeAt)}
              </p>
            )}
          </div>

          {/* Job Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium text-gray-900">{job.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Church</p>
                <p className="font-medium text-gray-900">{job.church.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{job.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="font-medium text-gray-900">{job.employmentType}</p>
              </div>
            </div>

            <Link
              href={`/jobs/${job.id}`}
              className="mt-4 block w-full text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              View Job Posting
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleStatusChange("interview_requested")}
                disabled={isUpdatingStatus || application.status === "interview_requested"}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Request Interview
              </button>
              <button
                onClick={() => handleStatusChange("offer_extended")}
                disabled={isUpdatingStatus || application.status === "offer_extended"}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Extend Offer
              </button>
              <button
                onClick={() => handleStatusChange("not_selected")}
                disabled={isUpdatingStatus || application.status === "not_selected"}
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Mark Not Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
