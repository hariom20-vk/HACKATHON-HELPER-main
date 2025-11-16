#!/usr/bin/env node

/**
 * Quick test script to verify email sending
 * Run: npx ts-node test-email.ts
 */

import { Resend } from "resend";

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;

  console.log("🧪 Testing Email Configuration...\n");

  if (!apiKey) {
    console.log("❌ RESEND_API_KEY is not set in .env.local");
    console.log("   Get a free key from https://resend.com/api-keys\n");
    process.exit(1);
  }

  console.log("✅ RESEND_API_KEY is set");
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(-5)}\n`);

  try {
    console.log("📤 Attempting to send test email...\n");

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: "Hackathon Helper <onboarding@resend.dev>",
      to: "delivered@resend.dev", // Resend test email
      subject: "Test OTP Email",
      html: `
        <h1>Test OTP: 123456</h1>
        <p>If you see this, emails are working!</p>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("Response:", response);
    console.log("\n📧 Check your inbox (or spam folder) for the test email.\n");
    console.log("To test with your own email, use: delivered@resend.dev\n");
  } catch (error: any) {
    console.log("❌ Failed to send email:");
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    console.log(`   Status: ${error.statusCode}\n`);

    if (error.message.includes("Invalid API key")) {
      console.log("💡 Tip: Check that your API key is correct.");
      console.log("   Get it from: https://resend.com/api-keys\n");
    }
  }
}

testEmail();
