"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

function SSOCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithSSO } = useAuth();
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleSSO = async () => {
      const ssoToken = searchParams.get("sso_token");
      const returnTo = searchParams.get("returnTo") || "/jobs";

      if (!ssoToken) {
        setStatus("error");
        setErrorMessage("No SSO token provided");
        return;
      }

      try {
        const response = await fetch("/api/auth/sso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: ssoToken }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus("error");
          if (data.code === "TOKEN_EXPIRED") {
            setErrorMessage(
              "Your login session has expired. Please try again from SoapBox."
            );
          } else {
            setErrorMessage(data.error || "Authentication failed");
          }
          return;
        }

        await loginWithSSO(data.user, data.token, data.refreshToken);

        setStatus("success");

        setTimeout(() => {
          router.push(returnTo);
        }, 500);
      } catch (error) {
        console.error("SSO authentication error:", error);
        setStatus("error");
        setErrorMessage("An error occurred during authentication");
      }
    };

    handleSSO();
  }, [searchParams, loginWithSSO, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Image
              src="/soapbox-logo-new.png"
              alt="SoapBox"
              width={64}
              height={64}
              className="w-16 h-16"
            />
          </div>

          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Signing you in...
              </h2>
              <p className="text-gray-600">
                Please wait while we authenticate your SoapBox account.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to <span className="text-primary-600">SoapBox</span> <span className="text-gray-500 font-light">Jobs</span>!
              </h2>
              <p className="text-gray-600">Redirecting you to the dashboard...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <a
                  href="https://soapboxsuperapp.com"
                  className="block w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  Go to SoapBox
                </a>
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Sign in with email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SSOCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Loading...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <SSOCallbackContent />
    </Suspense>
  );
}
