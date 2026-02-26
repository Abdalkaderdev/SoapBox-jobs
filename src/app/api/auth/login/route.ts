import { NextRequest, NextResponse } from "next/server";

/**
 * Login API Route
 * Authenticates against SoapBox Super App API
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Determine SoapBox API URL based on environment
    const soapboxApiUrl =
      process.env.SOAPBOX_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://soapboxsuperapp.com"
        : "http://localhost:5000");

    // Call SoapBox Super App login endpoint
    const response = await fetch(`${soapboxApiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrUsername: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.user) {
      // Map SoapBox user to Jobs app user format
      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.firstName && data.user.lastName
          ? `${data.user.firstName} ${data.user.lastName}`
          : data.user.username || data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role === "church_admin" || data.user.role === "admin"
          ? "church_admin"
          : "job_seeker",
        churchId: data.user.churchId,
        profilePhoto: data.user.profileImageUrl,
        ssoAuthenticated: false, // This is direct login, not SSO
      };

      return NextResponse.json({
        success: true,
        user,
      });
    } else {
      // Return the error from SoapBox API
      return NextResponse.json(
        {
          success: false,
          error: data.message || data.error || "Invalid email or password",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication service unavailable" },
      { status: 500 }
    );
  }
}
