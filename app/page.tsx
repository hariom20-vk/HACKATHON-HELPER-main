"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      if (supabase && typeof supabase.auth?.getSession === "function") {
        supabase.auth.getSession().then((res: any) => setUser(res?.data?.session?.user || null)).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleGetStarted = () => {
    router.push(user ? "/dashboard" : "/login");
  };

  return (
    <div style={{ background: "#071426", color: "#e6f7fb", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "60px 20px" }}>
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ background: "rgba(0, 188, 212, 0.1)", border: "1px solid rgba(0, 188, 212, 0.3)", borderRadius: "30px", display: "inline-block", padding: "8px 20px", marginBottom: "24px" }}>
            <span style={{ color: "#00bcd4", fontSize: "0.9rem", fontWeight: "600" }}>🚀 Join the Hackathon Revolution</span>
          </div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", marginBottom: "20px", lineHeight: "1.2" }}>
            Find Your Perfect <span style={{ background: "linear-gradient(90deg, #00bcd4, #00e676)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hackathon Team</span>
          </h1>
          <p style={{ fontSize: "18px", color: "#bfeff6", maxWidth: "700px", margin: "0 auto 40px", lineHeight: "1.6" }}>
            Connect with talented developers, designers, and innovators. Build award-winning projects, learn new skills, and launch your career at hackathons worldwide.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "60px" }}>
            <button onClick={handleGetStarted} style={{ padding: "14px 36px", background: "linear-gradient(135deg, #00bcd4, #00e676)", color: "#000", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
              {user ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "14px 36px", border: "2px solid #00bcd4", color: "#00bcd4", borderRadius: "8px", background: "transparent", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
              Learn More
            </button>
          </div>
        </section>

        {/* Stats */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "28px", marginBottom: "80px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(0, 188, 212, 0.15), rgba(0, 188, 212, 0.05))", border: "1.5px solid rgba(0, 188, 212, 0.3)", padding: "40px 24px", borderRadius: "16px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 188, 212, 0.2)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "48px", fontWeight: "900", background: "linear-gradient(135deg, #00bcd4, #0097a7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "12px" }}>1000+</div>
            <p style={{ color: "#bfeff6", fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Developers Connected</p>
            <p style={{ color: "#80deea", fontSize: "0.85rem" }}>Building together</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(0, 230, 118, 0.05))", border: "1.5px solid rgba(0, 230, 118, 0.3)", padding: "40px 24px", borderRadius: "16px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 230, 118, 0.2)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "48px", fontWeight: "900", background: "linear-gradient(135deg, #00e676, #00c853)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "12px" }}>500+</div>
            <p style={{ color: "#bfeff6", fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Teams Formed</p>
            <p style={{ color: "#69f0ae", fontSize: "0.85rem" }}>Winning connections</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(255, 214, 0, 0.15), rgba(255, 214, 0, 0.05))", border: "1.5px solid rgba(255, 214, 0, 0.3)", padding: "40px 24px", borderRadius: "16px", textAlign: "center", transition: "all 0.3s ease", cursor: "pointer" }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(255, 214, 0, 0.2)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ fontSize: "48px", fontWeight: "900", background: "linear-gradient(135deg, #ffd600, #ffb300)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "12px" }}>100+</div>
            <p style={{ color: "#bfeff6", fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>Winning Projects</p>
            <p style={{ color: "#ffed4e", fontSize: "0.85rem" }}>Prize-worthy ideas</p>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "40px", textAlign: "center" }}>Key Features</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px" }}>
              <h3 style={{ color: "#00bcd4", marginBottom: "12px" }}>Smart Team Matching</h3>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>Our algorithm matches you with developers based on skills, interests, and experience level.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px" }}>
              <h3 style={{ color: "#00e676", marginBottom: "12px" }}>Real-time Chat</h3>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>Communicate with your team instantly. Share ideas, code snippets, and stay coordinated.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px" }}>
              <h3 style={{ color: "#ffd600", marginBottom: "12px" }}>Mentor Connect</h3>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>Get guidance from experienced hackathon veterans and industry experts.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "40px", textAlign: "center" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#00bcd4", marginBottom: "12px" }}>1</p>
              <h3 style={{ marginBottom: "12px" }}>Create Profile</h3>
              <p style={{ color: "#bfeff6", fontSize: "0.95rem" }}>Add your skills, experience, and interests.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#00e676", marginBottom: "12px" }}>2</p>
              <h3 style={{ marginBottom: "12px" }}>Browse Teams</h3>
              <p style={{ color: "#bfeff6", fontSize: "0.95rem" }}>Find teams that match your interests.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "32px", borderRadius: "12px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "900", color: "#ffd600", marginBottom: "12px" }}>3</p>
              <h3 style={{ marginBottom: "12px" }}>Build & Win</h3>
              <p style={{ color: "#bfeff6", fontSize: "0.95rem" }}>Collaborate and compete in hackathons.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "40px", textAlign: "center" }}>Frequently Asked Questions</h2>
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "24px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "24px", borderRadius: "12px" }}>
              <h4 style={{ color: "#00bcd4", marginBottom: "12px" }}>Is Hackathon Helper free?</h4>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>Yes! Our core platform is completely free to use. We believe everyone should have access to team formation tools.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "24px", borderRadius: "12px" }}>
              <h4 style={{ color: "#00bcd4", marginBottom: "12px" }}>Can I join multiple teams?</h4>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>Absolutely! You can join multiple teams across different hackathons to maximize your opportunities.</p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(0, 188, 212, 0.1)", padding: "24px", borderRadius: "12px" }}>
              <h4 style={{ color: "#00bcd4", marginBottom: "12px" }}>How are teams matched?</h4>
              <p style={{ color: "#bfeff6", lineHeight: "1.6" }}>We use skill-matching algorithms combined with your preferences to suggest compatible teammates.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(0, 188, 212, 0.2)", padding: "40px 20px", textAlign: "center", color: "#9fbec6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>© 2024 Hackathon Helper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}