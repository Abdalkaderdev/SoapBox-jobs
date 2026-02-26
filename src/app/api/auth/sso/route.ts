import { NextRequest, NextResponse } from "next/server";

/**
 * SSO Token Validation API Route
 *
 * POST /api/auth/sso
 *
 * Validates an SSO token from SoapBox Super App and returns user data.
 */

interface SSOValidationRequest {
  token: string;
}

function getSoapBoxApiUrl(): string {
  if (process.env.SOAPBOX_API_URL) {
    return process.env.SOAPBOX_API_URL;
  }
  return process.env.NODE_ENV === "production"
    ? "https://soapboxsuperapp.com"
    : "http://localhost:5000";
}

export async function POST(request: NextRequest) {
  try {
    const body: SSOValidationRequest = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "SSO token is required" },
        { status: 400 }
      );
    }

    // Validate token with SoapBox Super App
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
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Token validation failed",
          code: data.code,
        },
        { status: 401 }
      );
    }

    // Map the role for jobs platform
    const adminRoles = [
      "admin",
      "super_admin",
      "church_admin",
      "soapbox_admin",
      "soapbox_owner",
      "platform_admin",
    ];
    const role =
      data.user.churchId && adminRoles.includes(data.user.role)
        ? "church_admin"
        : "job_seeker";

    // Return user data for client-side session
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`.trim(),
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role,
        churchId: data.user.churchId,
        profileImageUrl: data.user.profileImageUrl,
        ssoAuthenticated: true,
      },
      token: data.token,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    console.error("SSO validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate SSO token" },
      { status: 500 }
    );
  }
}
