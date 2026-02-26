"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Login Page - SSO Handler
 *
 * This page handles SSO tokens from SoapBox redirects.
 * If there's an sso_token in the URL, redirect to /auth/sso for processing.
 * Otherwise, redirect to /auth/signin for regular login.
 */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ssoToken = searchParams.get("sso_token");

    if (ssoToken) {
      // Redirect to SSO callback page with the token
      router.replace(`/auth/sso?sso_token=${encodeURIComponent(ssoToken)}`);
    } else {
      // No SSO token, redirect to regular signin
      router.replace("/auth/signin");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
