import { JobAlert } from "@/types/alert";

const ALERTS_STORAGE_KEY = "soapbox_job_alerts";

export function getAlerts(): JobAlert[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAlerts(alerts: JobAlert[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
}

export function getUserAlerts(userId: string): JobAlert[] {
  return getAlerts().filter((alert) => alert.userId === userId);
}

export function createAlert(
  alert: Omit<JobAlert, "id" | "createdAt">
): JobAlert {
  const alerts = getAlerts();
  const newAlert: JobAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

export function deleteAlert(alertId: string): void {
  const alerts = getAlerts().filter((alert) => alert.id !== alertId);
  saveAlerts(alerts);
}

export function toggleAlert(alertId: string): JobAlert | null {
  const alerts = getAlerts();
  const alertIndex = alerts.findIndex((alert) => alert.id === alertId);

  if (alertIndex === -1) return null;

  alerts[alertIndex].isActive = !alerts[alertIndex].isActive;
  saveAlerts(alerts);
  return alerts[alertIndex];
}

export function getAlertById(alertId: string): JobAlert | null {
  const alerts = getAlerts();
  return alerts.find((alert) => alert.id === alertId) || null;
}

export function updateAlert(
  alertId: string,
  updates: Partial<Omit<JobAlert, "id" | "userId" | "createdAt">>
): JobAlert | null {
  const alerts = getAlerts();
  const alertIndex = alerts.findIndex((alert) => alert.id === alertId);

  if (alertIndex === -1) return null;

  alerts[alertIndex] = { ...alerts[alertIndex], ...updates };
  saveAlerts(alerts);
  return alerts[alertIndex];
}
