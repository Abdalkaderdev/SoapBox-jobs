"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  NotificationPreferences,
  getPreferences,
  savePreferences,
} from "@/lib/notifications";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ministryStatement, setMinistryStatement] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationSaveMessage, setNotificationSaveMessage] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setMinistryStatement(user.ministryStatement || "");
      // Load notification preferences
      const prefs = getPreferences(user.id);
      setNotificationPrefs(prefs);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    updateProfile({
      name,
      ministryStatement,
    });

    setIsSaving(false);
    setSaveMessage("Profile saved successfully!");

    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationPrefsChange = (
    field: keyof Omit<NotificationPreferences, "userId">
  ) => {
    if (!notificationPrefs) return;

    if (field === "frequency") {
      // This is handled by the select onChange
      return;
    }

    setNotificationPrefs({
      ...notificationPrefs,
      [field]: !notificationPrefs[field],
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!notificationPrefs) return;

    setNotificationPrefs({
      ...notificationPrefs,
      frequency: e.target.value as NotificationPreferences["frequency"],
    });
  };

  const handleSaveNotificationPrefs = async () => {
    if (!notificationPrefs || !user) return;

    setIsSavingNotifications(true);
    setNotificationSaveMessage("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    savePreferences(user.id, {
      applicationStatusChange: notificationPrefs.applicationStatusChange,
      newMessage: notificationPrefs.newMessage,
      jobAlerts: notificationPrefs.jobAlerts,
      frequency: notificationPrefs.frequency,
    });

    setIsSavingNotifications(false);
    setNotificationSaveMessage("Notification preferences saved!");

    setTimeout(() => setNotificationSaveMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Profile photo placeholder */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-600">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
              {user?.role === "church_admin" ? "Church Admin" : "Job Seeker"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {saveMessage}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="ministryStatement" className="block text-sm font-medium text-gray-700">
              Ministry Statement
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Share your calling and passion for ministry (max 2000 characters)
            </p>
            <textarea
              id="ministryStatement"
              value={ministryStatement}
              onChange={(e) => setMinistryStatement(e.target.value.slice(0, 2000))}
              rows={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              placeholder="Tell potential employers about your faith journey and calling to ministry..."
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {ministryStatement.length}/2000 characters
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Notification Preferences
        </h2>

        {notificationSaveMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {notificationSaveMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Email notification checkboxes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Email Notifications
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs?.applicationStatusChange ?? true}
                  onChange={() =>
                    handleNotificationPrefsChange("applicationStatusChange")
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Email on application status change
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs?.newMessage ?? true}
                  onChange={() => handleNotificationPrefsChange("newMessage")}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Email on new message
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationPrefs?.jobAlerts ?? true}
                  onChange={() => handleNotificationPrefsChange("jobAlerts")}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Job alert emails</span>
              </label>
            </div>
          </div>

          {/* Frequency dropdown */}
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Frequency
            </label>
            <select
              id="frequency"
              value={notificationPrefs?.frequency ?? "immediate"}
              onChange={handleFrequencyChange}
              className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
              <option value="never">Never</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose how often you want to receive email notifications
            </p>
          </div>

          {/* Save button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSaveNotificationPrefs}
              disabled={isSavingNotifications}
              className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingNotifications
                ? "Saving..."
                : "Save Notification Preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
