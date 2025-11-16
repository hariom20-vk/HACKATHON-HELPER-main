/**
 * Shared OTP Store
 * This file is imported by both send-otp and verify-otp routes
 * Ensures OTPs are stored globally across requests
 */

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

// Global in-memory store for OTPs
// In production, this should be moved to Redis or a database
export const otpStore = new Map<string, OtpEntry>();

// Cleanup expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(email);
      console.log(`🗑️  Cleaned up expired OTP for ${email}`);
    }
  }
}, 60000); // Run every 60 seconds

/**
 * Store OTP for an email
 */
export function storeOtp(email: string, otp: string, expiryMinutes: number = 10): void {
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt,
    attempts: 0,
  });
  console.log(`💾 OTP stored for ${email}. Expires in ${expiryMinutes} minutes.`);
}

/**
 * Retrieve and verify OTP
 */
export function verifyOtp(email: string, otp: string): { success: boolean; error?: string } {
  const key = email.toLowerCase();
  const entry = otpStore.get(key);

  if (!entry) {
    return { success: false, error: "OTP not found. Please request a new one." };
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  // Check max attempts
  if (entry.attempts >= 5) {
    otpStore.delete(key);
    return { success: false, error: "Too many failed attempts. Please request a new OTP." };
  }

  // Verify OTP
  if (entry.otp !== otp) {
    entry.attempts += 1;
    return { success: false, error: `Invalid OTP. ${5 - entry.attempts} attempts remaining.` };
  }

  // OTP is valid - delete it
  otpStore.delete(key);
  console.log(`✅ OTP verified for ${email}`);
  return { success: true };
}

/**
 * Delete OTP (used after verification)
 */
export function deleteOtp(email: string): void {
  otpStore.delete(email.toLowerCase());
  console.log(`🗑️  OTP deleted for ${email}`);
}

/**
 * Get OTP info (for debugging)
 */
export function getOtpInfo(email: string): OtpEntry | null {
  return otpStore.get(email.toLowerCase()) || null;
}

/**
 * Clear all OTPs (for testing/debugging)
 */
export function clearAllOtps(): void {
  otpStore.clear();
  console.log(`🗑️  All OTPs cleared`);
}
