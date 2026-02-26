"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithSSO, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  // Handle SSO token from URL (when redirected from SoapBox)
  useEffect(() => {
    const ssoToken = searchParams.get("sso_token");
    if (ssoToken) {
      handleSSOToken(ssoToken);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/jobs";
      router.push(returnTo);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSSOToken = async (token: string) => {
    setSsoLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/sso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        await loginWithSSO(data.user, data.token, data.refreshToken);
        const returnTo = searchParams.get("returnTo") || "/jobs";
        router.push(returnTo);
      } else {
        if (data.code === "TOKEN_EXPIRED") {
          setError(
            "Your login session has expired. Please sign in again from SoapBox."
          );
        } else {
          setError(data.error || "SSO authentication failed");
        }
      }
    } catch (err) {
      setError("Failed to authenticate with SoapBox");
    } finally {
      setSsoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/jobs");
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  const handleSSOLogin = () => {
    // Determine the SoapBox URL based on environment
    const soapboxUrl =
      process.env.NODE_ENV === "production"
        ? "https://soapboxsuperapp.com"
        : "http://localhost:5000";

    // Redirect to SoapBox SSO endpoint
    window.location.href = `${soapboxUrl}/api/sso/redirect/jobs`;
  };

  // Show loading state while processing SSO token
  if (ssoLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" aria-hidden="true"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Signing you in...
          </h2>
          <p className="text-gray-600">
            Authenticating with your SoapBox account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo/Title */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Image
                src="/soapbox-logo-new.png"
                alt="SoapBox"
                width={64}
                height={64}
                className="w-16 h-16"
              />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-primary-600">SoapBox</span>
              <span className="text-gray-500 font-light ml-1">Jobs</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to find your next opportunity
            </p>
          </div>

          {/* SSO Login Button - Primary Action */}
          <div>
            <button
              type="button"
              onClick={handleSSOLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 transition-colors shadow-md hover:shadow-lg"
              aria-label="Continue with SoapBox single sign-on"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Continue with SoapBox
            </button>
          </div>

          <div className="relative" role="separator" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                id="signin-error"
                role="alert"
                aria-live="assertive"
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-describedby={error ? "signin-error" : undefined}
                  aria-invalid={error ? "true" : "false"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-describedby={error ? "signin-error" : undefined}
                  aria-invalid={error ? "true" : "false"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                aria-disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign in with Email"}
              </button>
            </div>

            <div className="text-sm text-center text-gray-500 bg-gray-50 rounded-xl p-3" aria-label="Demo account information">
              <p className="font-medium text-gray-700 mb-1">Demo accounts:</p>
              <p>Job Seeker: john@example.com / password123</p>
              <p>Church Admin: admin@gracechurch.com / password123</p>
            </div>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-50 flex items-center justify-center" role="status" aria-label="Loading sign in page">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" aria-hidden="true"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
