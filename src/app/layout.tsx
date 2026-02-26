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
        <AuthProvider>
          <SavedJobsProvider>
            <Header />
            <main>{children}</main>
          </SavedJobsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
