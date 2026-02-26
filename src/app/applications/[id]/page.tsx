"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getApplication, withdrawApplication } from "@/lib/applications";
import { getApplicationMessages, addMessage, markMessagesAsRead } from "@/lib/messages";
import { mockJobs } from "@/lib/mock-data";
import { Application, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from "@/types/application";
import { Message } from "@/types/message";
import { use } from "react";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user && id) {
      const app = getApplication(id);
      if (app && app.userId === user.id) {
        setApplication(app);
        setMessages(getApplicationMessages(id));
        markMessagesAsRead(id, user.id);
      } else {
        router.push("/applications");
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

    addMessage(application.id, user.id, user.name, "applicant", newMessage.trim());
    setMessages(getApplicationMessages(application.id));
    setNewMessage("");
    setIsSending(false);
  };

  const handleWithdraw = () => {
    if (!application) return;
    if (confirm("Are you sure you want to withdraw this application?")) {
      withdrawApplication(application.id);
      router.push("/applications");
    }
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

  if (isLoading || !application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const job = mockJobs.find((j) => j.id === application.jobId);
  if (!job) {
    router.push("/applications");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/applications"
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
          {/* Application info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-2xl font-bold text-gray-900 hover:text-primary-600"
                >
                  {job.title}
                </Link>
                <p className="text-primary-600 font-medium text-lg">{job.church.name}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  APPLICATION_STATUS_COLORS[application.status]
                }`}
              >
                {APPLICATION_STATUS_LABELS[application.status]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Applied</p>
                <p className="font-medium text-gray-900">{formatDate(application.appliedAt)}</p>
              </div>
              {application.reviewedAt && (
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDate(application.reviewedAt)}</p>
                </div>
              )}
            </div>

            {["submitted", "under_review"].includes(application.status) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleWithdraw}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Withdraw Application
                </button>
              </div>
            )}
          </div>

          {/* Cover letter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Cover Letter</h2>
            <p className="text-gray-700 whitespace-pre-line">{application.coverLetter}</p>

            {application.resumeFilename && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Resume attached:</p>
                <p className="text-sm font-medium text-gray-900">{application.resumeFilename}</p>
              </div>
            )}
          </div>

          {/* Messages */}
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
                        message.senderType === "applicant" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.senderType === "applicant"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderType === "applicant"
                              ? "text-primary-200"
                              : "text-gray-500"
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
                  No messages yet. Send a message to {job.church.name}.
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

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {job.church.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{job.church.name}</h3>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>

            <Link
              href={`/jobs/${job.id}`}
              className="block w-full text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              View Job Posting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
