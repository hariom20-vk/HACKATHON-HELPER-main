import { NextRequest, NextResponse } from "next/server";
import { verifyOtp as verifyOtpFromStore } from "@/lib/otp-store";

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP and creates a session for the user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate inputs
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP format. Please enter 6 digits." },
        { status: 400 }
      );
    }

    // Verify OTP using shared store
    const verificationResult = verifyOtpFromStore(email, otp);

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.error || "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is valid - generate session token
    const sessionToken = Buffer.from(
      `${email}:${Date.now()}:${Math.random()}`
    ).toString("base64");

    // Create response with session token
    const response = NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        sessionToken,
        email,
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    console.log(`✅ OTP verified for ${email}`);

    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
