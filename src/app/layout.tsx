import type { Metadata } from "next";
import "./globals.css";

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
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-primary-600">SoapBox</span>
                  <span className="text-2xl font-light text-gray-600 ml-1">Jobs</span>
                </a>
              </div>
              <nav className="flex items-center space-x-4">
                <a href="/jobs" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Browse Jobs
                </a>
                <a href="#" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  For Churches
                </a>
                <a href="#" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                  Sign In
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
