"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email"); // "email" or "otp"
  const [demoOtp, setDemoOtp] = useState<string>("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer for OTP countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  // Generate random OTP for demo
  const generateDemoOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // Validate email
      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        setBusy(false);
        return;
      }

      // Call backend API to send OTP
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // Store demo OTP for display (backend sends this for development)
      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
      }

      setTimer(60);

      // Show success and move to OTP step
      setTimeout(() => {
        setStep("otp");
        setBusy(false);
      }, 600);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      setBusy(false);
      console.error("Send OTP error:", err);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      // Validate OTP format
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        setError("Please enter a valid 6-digit OTP");
        setBusy(false);
        return;
      }

      // Call backend API to verify OTP
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // OTP verified successfully
      console.log("✅ OTP verified successfully");

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
      setBusy(false);
      console.error("Verify OTP error:", err);
    }
  };

  const handleResendOtp = () => {
    // Resend OTP by calling send-otp API again
    const resendOtp = async () => {
      setBusy(true);
      try {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to resend OTP");
        }

        // Update demo OTP display
        if (data.demoOtp) {
          setDemoOtp(data.demoOtp);
        }

        setTimer(60);
        setOtp("");
        setBusy(false);
      } catch (err: any) {
        setError(err.message || "Failed to resend OTP");
        setBusy(false);
      }
    };

    resendOtp();
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError(null);
    setDemoOtp("");
    setTimer(0);
  };

  const handleDemoLogin = async () => {
    setBusy(true);
    // Demo mode - just redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #0f0f1e 50%, #1a0033 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-100px",
          left: "-100px",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-50px",
          right: "-50px",
          animation: "pulse 10s ease-in-out infinite 2s",
        }}
      />

      {/* Main login container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "420px",
          padding: "20px",
        }}
      >
        {/* Logo and title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            animation: "fadeInDown 0.6s ease-out",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            ⚡ HACKATHON HELPER
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Connect. Collaborate. Create.
          </p>
        </div>

        {/* Login form card */}
        <div
          style={{
            background: "rgba(15, 15, 30, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(34, 211, 238, 0.2)",
            borderRadius: "16px",
            padding: "40px 32px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            animation: "fadeInUp 0.6s ease-out 0.2s both",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", marginBottom: "24px" }}>
            Welcome Back
          </h2>

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                color: "#fca5a5",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", color: "#d1d5db", marginBottom: "8px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    opacity: busy ? 0.7 : 1,
                  }}
                  onFocus={(e) => {
                    if (!busy) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.6)";
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.3)";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: busy ? "rgba(34, 211, 238, 0.5)" : "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: busy ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: busy ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!busy) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 16px rgba(34, 211, 238, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                {busy ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", color: "#d1d5db", marginBottom: "8px" }}>
                  OTP Code
                </label>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                  Enter the 6-digit code sent to <strong>{email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  required
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.3)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "18px",
                    letterSpacing: "6px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                    opacity: busy ? 0.7 : 1,
                  }}
                  onFocus={(e) => {
                    if (!busy) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.6)";
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.3)";
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  disabled={busy || otp.length !== 6}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: busy || otp.length !== 6 ? "rgba(34, 211, 238, 0.5)" : "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: busy || otp.length !== 6 ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: busy || otp.length !== 6 ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!busy && otp.length === 6) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 16px rgba(34, 211, 238, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  {busy ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  disabled={busy}
                  style={{
                    padding: "12px 16px",
                    background: "transparent",
                    color: "#22d3ee",
                    border: "1px solid rgba(34, 211, 238, 0.5)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: busy ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!busy) {
                      e.currentTarget.style.background = "rgba(34, 211, 238, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Back
                </button>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || busy}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: timer > 0 ? "#9ca3af" : "#22d3ee",
                    fontSize: "14px",
                    cursor: timer > 0 || busy ? "not-allowed" : "pointer",
                    opacity: timer > 0 ? 0.5 : 1,
                  }}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          <div style={{ margin: "20px 0", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
            <span style={{ color: "#6b7280", fontSize: "13px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
          </div>

          {step === "email" && (
            <button
              onClick={handleDemoLogin}
              type="button"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "transparent",
                color: "#22d3ee",
                border: "1px solid rgba(34, 211, 238, 0.5)",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(34, 211, 238, 0.1)";
                e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.5)";
              }}
            >
              Continue as Demo
            </button>
          )}
        </div>

        {/* Footer text */}
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: "13px",
            marginTop: "24px",
            animation: "fadeIn 0.6s ease-out 0.4s both",
          }}
        >
          {step === "email" 
            ? "Enter any email to get started with OTP verification" 
            : `Demo OTP: ${demoOtp || "loading..."}`
          }
        </p>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

