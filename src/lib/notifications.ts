const NOTIFICATION_PREFS_KEY = "soapbox_notification_preferences";

export interface NotificationPreferences {
  userId: string;
  applicationStatusChange: boolean;
  newMessage: boolean;
  jobAlerts: boolean;
  frequency: "immediate" | "daily" | "weekly" | "never";
}

export function getDefaultPreferences(userId: string): NotificationPreferences {
  return {
    userId,
    applicationStatusChange: true,
    newMessage: true,
    jobAlerts: true,
    frequency: "immediate",
  };
}

export function getPreferences(userId: string): NotificationPreferences {
  if (typeof window === "undefined") {
    return getDefaultPreferences(userId);
  }

  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!stored) {
      return getDefaultPreferences(userId);
    }

    const allPrefs: Record<string, NotificationPreferences> = JSON.parse(stored);
    const userPrefs = allPrefs[userId];

    if (!userPrefs) {
      return getDefaultPreferences(userId);
    }

    return userPrefs;
  } catch {
    return getDefaultPreferences(userId);
  }
}

export function savePreferences(
  userId: string,
  prefs: Omit<NotificationPreferences, "userId">
): NotificationPreferences {
  if (typeof window === "undefined") {
    return { ...prefs, userId };
  }

  try {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    const allPrefs: Record<string, NotificationPreferences> = stored
      ? JSON.parse(stored)
      : {};

    const fullPrefs: NotificationPreferences = {
      ...prefs,
      userId,
    };

    allPrefs[userId] = fullPrefs;
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(allPrefs));

    return fullPrefs;
  } catch {
    return { ...prefs, userId };
  }
}

export function mockSendEmail(to: string, subject: string, body: string): void {
  console.log("=== MOCK EMAIL ===");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log("==================");
}
