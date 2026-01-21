import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Clears the user session
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set("sessionToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    console.log("🚪 User logged out");

    return response;
  } catch (error: any) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to logout" },
      { status: 500 }
    );
  }
}