import type { Metadata } from "next";
import "./globals.css";
import { SavedJobsProvider } from "@/contexts/SavedJobsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SoapBox Jobs - Faith-Based Employment",
  description: "Connect with churches and faith-based organizations for meaningful ministry opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {/* Skip to main content link - visually hidden but accessible via keyboard */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <SavedJobsProvider>
            <Header />
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
          </SavedJobsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
