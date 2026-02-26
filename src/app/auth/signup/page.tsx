"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const result = await signup(email, password, name);

    if (result.success) {
      router.push("/jobs");
    } else {
      setError(result.error || "Signup failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary-600 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              id="signup-error"
              role="alert"
              aria-live="assertive"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-required="true"
                aria-describedby={error ? "signup-error" : undefined}
                aria-invalid={error ? "true" : "false"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-describedby={error ? "signup-error" : undefined}
                aria-invalid={error ? "true" : "false"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <p id="password-hint" className="text-xs text-gray-500 mt-0.5">
                Must be at least 6 characters
              </p>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-describedby={`password-hint${error ? " signup-error" : ""}`}
                aria-invalid={error ? "true" : "false"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                aria-required="true"
                aria-describedby={error ? "signup-error" : undefined}
                aria-invalid={error ? "true" : "false"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-primary-600 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary-600 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
