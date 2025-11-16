import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { storeOtp } from "@/lib/otp-store";

/**
 * POST /api/auth/send-otp
 * Sends an OTP to the provided email address
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in shared store
    storeOtp(email, otp, 10);

    // Log OTP to console (for debugging)
    console.log(`📧 OTP generated for ${email}: ${otp}`);
    console.log(`🔑 RESEND_API_KEY configured: ${process.env.RESEND_API_KEY ? "YES" : "NO"}`);

    // If Resend API key is configured, send email
    if (process.env.RESEND_API_KEY) {
      try {
        console.log("📤 Attempting to send email via Resend...");
        
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const response = await resend.emails.send({
          from: "Hackathon Helper <onboarding@resend.dev>",
          to: email,
          subject: "Your Hackathon Helper OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">⚡ HACKATHON HELPER</h1>
              </div>
              <div style="background: #f8f9fa; padding: 40px; text-align: center;">
                <h2 style="color: #333; margin-bottom: 20px;">Your One-Time Password</h2>
                <p style="color: #666; margin-bottom: 30px;">Enter this code to verify your email:</p>
                <div style="background: white; border: 2px solid #667eea; padding: 20px; border-radius: 8px; display: inline-block;">
                  <h1 style="color: #667eea; font-size: 48px; letter-spacing: 10px; margin: 0; font-weight: bold;">${otp}</h1>
                </div>
                <p style="color: #999; margin-top: 30px; font-size: 14px;">This code expires in 10 minutes.</p>
              </div>
              <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 10px 10px;">
                <p>If you didn't request this code, please ignore this email.</p>
              </div>
            </div>
          `,
        });

        console.log(`✅ Email sent successfully to ${email}:`, response);
        
        return NextResponse.json(
          {
            success: true,
            message: `OTP sent to ${email}. Check your email!`,
            demoOtp: otp,
          },
          { status: 200 }
        );
      } catch (emailError: any) {
        console.error("❌ Failed to send email with Resend:", {
          error: emailError.message,
          code: emailError.code,
          statusCode: emailError.statusCode,
        });
        
        // Return error response
        return NextResponse.json(
          { 
            success: false, 
            error: `Email service error: ${emailError.message}`,
            demoOtp: otp, // Still provide OTP for testing
          },
          { status: 500 }
        );
      }
    } else {
      console.warn("⚠️ RESEND_API_KEY not configured. OTP available in console only.");
      return NextResponse.json(
        {
          success: true,
          message: "OTP generated. Check the console for the OTP code.",
          demoOtp: otp,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error in send-otp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
