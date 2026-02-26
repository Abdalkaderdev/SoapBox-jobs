/**
 * SSO Utilities for SoapBox Jobs Platform
 *
 * Handles Single Sign-On token validation and user session management
 * for seamless authentication from SoapBox Super App.
 */

export interface SSOTokenPayload {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  churchId?: string;
  type: "sso";
  targetApp: "jobs";
  iat: number;
  exp: number;
}

export interface SSOUser {
  id: string;
  email: string;
  name: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "job_seeker" | "church_admin";
  churchId?: string;
  ssoAuthenticated: boolean;
}

export interface SSOValidationResult {
  success: boolean;
  user?: SSOUser;
  token?: string;
  refreshToken?: string;
  error?: string;
  code?: string;
}

/**
 * Get the SoapBox API base URL based on environment
 */
export function getSoapBoxApiUrl(): string {
  if (process.env.SOAPBOX_API_URL) {
    return process.env.SOAPBOX_API_URL;
  }
  return process.env.NODE_ENV === "production"
    ? "https://soapboxsuperapp.com"
    : "http://localhost:5000";
}

/**
 * Validate an SSO token by calling the SoapBox Super App API
 */
export async function validateSSOToken(
  token: string
): Promise<SSOValidationResult> {
  try {
    const apiUrl = getSoapBoxApiUrl();
    const response = await fetch(`${apiUrl}/api/sso/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || "Token validation failed",
        code: data.code,
      };
    }

    // Map the role from SoapBox to jobs platform roles
    const role = mapSoapBoxRole(data.user.role, data.user.churchId);

    const ssoUser: SSOUser = {
      id: data.user.id,
      email: data.user.email,
      name: `${data.user.firstName} ${data.user.lastName}`.trim(),
      username: data.user.username,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      role,
      churchId: data.user.churchId,
      ssoAuthenticated: true,
    };

    return {
      success: true,
      user: ssoUser,
      token: data.token,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    console.error("SSO token validation error:", error);
    return {
      success: false,
      error: "Failed to validate SSO token",
      code: "VALIDATION_ERROR",
    };
  }
}

/**
 * Map SoapBox user role to jobs platform role
 */
function mapSoapBoxRole(
  soapboxRole: string,
  churchId?: string
): "job_seeker" | "church_admin" {
  // Users with churchId and admin-like roles become church_admin
  const adminRoles = [
    "admin",
    "super_admin",
    "church_admin",
    "soapbox_admin",
    "soapbox_owner",
    "platform_admin",
  ];

  if (churchId && adminRoles.includes(soapboxRole)) {
    return "church_admin";
  }

  // Everyone else is a job seeker
  return "job_seeker";
}

/**
 * Storage keys for SSO session data
 */
export const SSO_STORAGE_KEYS = {
  AUTH: "soapbox_jobs_auth",
  TOKEN: "soapbox_jobs_token",
  REFRESH_TOKEN: "soapbox_jobs_refresh_token",
} as const;

/**
 * Store SSO session data in localStorage
 */
export function storeSSOSession(
  user: SSOUser,
  token?: string,
  refreshToken?: string
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(SSO_STORAGE_KEYS.AUTH, JSON.stringify(user));

  if (token) {
    localStorage.setItem(SSO_STORAGE_KEYS.TOKEN, token);
  }

  if (refreshToken) {
    localStorage.setItem(SSO_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

/**
 * Clear SSO session data from localStorage
 */
export function clearSSOSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SSO_STORAGE_KEYS.AUTH);
  localStorage.removeItem(SSO_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(SSO_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Get stored SSO user from localStorage
 */
export function getStoredSSOUser(): SSOUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(SSO_STORAGE_KEYS.AUTH);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Get stored access token
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SSO_STORAGE_KEYS.TOKEN);
}

/**
 * Get stored refresh token
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SSO_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Build SSO login URL to redirect to SoapBox for authentication
 */
export function buildSSOLoginUrl(returnPath?: string): string {
  const soapboxUrl = getSoapBoxApiUrl();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://jobs.soapboxsuperapp.com"
      : "http://localhost:3002");

  // The return URL should go to our SSO callback page
  const callbackUrl = `${appUrl}/auth/sso${returnPath ? `?returnTo=${encodeURIComponent(returnPath)}` : ""}`;

  // Redirect to SoapBox SSO endpoint which will handle auth and redirect back
  return `${soapboxUrl}/api/sso/redirect/jobs?callback=${encodeURIComponent(callbackUrl)}`;
}
