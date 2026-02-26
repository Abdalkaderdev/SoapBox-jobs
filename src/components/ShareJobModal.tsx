"use client";

import { useState, useEffect } from "react";

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobUrl: string;
}

export default function ShareJobModal({
  isOpen,
  onClose,
  jobTitle,
  jobUrl: initialJobUrl,
}: ShareJobModalProps) {
  const [copied, setCopied] = useState(false);
  const [jobUrl, setJobUrl] = useState(initialJobUrl);

  useEffect(() => {
    // Update with the actual window location when running on client
    if (typeof window !== "undefined") {
      setJobUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: handleCopyLink,
      bgColor: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-gray-700",
    },
    {
      name: "Email",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      href: `mailto:?subject=${encodeURIComponent(jobTitle)}&body=${encodeURIComponent(`Check out this job opportunity: ${jobUrl}`)}`,
      bgColor: "bg-blue-100 hover:bg-blue-200",
      textColor: "text-blue-700",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`,
      bgColor: "bg-[#0077B5]/10 hover:bg-[#0077B5]/20",
      textColor: "text-[#0077B5]",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`,
      bgColor: "bg-[#1877F2]/10 hover:bg-[#1877F2]/20",
      textColor: "text-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(`Check out this job opportunity: ${jobTitle}`)}`,
      bgColor: "bg-gray-900/10 hover:bg-gray-900/20",
      textColor: "text-gray-900",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Share this job</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{jobTitle}</p>
        </div>

        {/* Share options */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => {
              const content = (
                <>
                  <span
                    className={`w-12 h-12 rounded-full ${option.bgColor} ${option.textColor} flex items-center justify-center transition-colors`}
                  >
                    {option.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700 mt-2">
                    {option.name === "Copy Link" && copied ? "Link copied!" : option.name}
                  </span>
                </>
              );

              if (option.onClick) {
                return (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {content}
                </a>
              );
            })}
          </div>

          {/* Success message for copy */}
          {copied && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
