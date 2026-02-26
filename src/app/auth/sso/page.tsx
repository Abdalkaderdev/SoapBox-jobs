"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                Welcome!
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
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to SoapBox
                </a>
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
