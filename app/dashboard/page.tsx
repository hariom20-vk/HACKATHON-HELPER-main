"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [tab, setTab] = useState("browse");
  const [joinedTeams, setJoinedTeams] = useState<any[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Hackathon starts in 2 days!", type: "info" },
    { id: 2, message: "New team 'Web Warriors' created.", type: "success" },
    { id: 3, message: "Don't forget to submit your project by Sunday.", type: "warning" },
  ]);
  const [searchFilter, setSearchFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [userStats, setUserStats] = useState({
    projectsCompleted: 12,
    hackathonsAttended: 5,
    totalScore: 8500,
    level: "Expert"
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showProjectsPanel, setShowProjectsPanel] = useState(false);
  // Derived metric helpers for sidebar stats visualizations
  const projectsPercent = Math.min(100, Math.round((userStats.projectsCompleted / 20) * 100));
  const [projectsAnimatedPercent, setProjectsAnimatedPercent] = useState(0);
  const [scoreAnimated, setScoreAnimated] = useState(0);
  const _circleR = 24;
  const _circleC = 2 * Math.PI * _circleR;
  const projectsOffset = _circleC - (projectsAnimatedPercent / 100) * _circleC;

  // Animate sidebar stats on mount / when userStats changes
  useEffect(() => {
    let raf: number | null = null;
    let start: number | null = null;
    const duration = 700;
    const from = 0;
    const to = projectsPercent;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setProjectsAnimatedPercent(Math.round(from + (to - from) * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [projectsPercent]);

  useEffect(() => {
    let raf: number | null = null;
    let start: number | null = null;
    const duration = 700;
    const from = 0;
    const to = userStats.totalScore;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setScoreAnimated(Math.floor(from + (to - from) * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [userStats.totalScore]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session?.user) {
          // In demo mode, allow access without authentication
          setUser({ email: "demo@hackathon.io" });
        } else {
          setUser(data.session.user);
        }
      } catch (error) {
        console.log("Supabase not configured - demo mode active");
        setUser({ email: "demo@hackathon.io" });
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const sampleTeams = [
    {
      id: 1,
      name: "Web Warriors",
      skills: ["React", "Node.js", "Python"],
      members: [
        { name: "Alice", role: "Frontend", avatar: "https://randomuser.me/api/portraits/women/1.jpg", skills: ["React"] },
        { name: "Bob", role: "Backend", avatar: "https://randomuser.me/api/portraits/men/2.jpg", skills: ["Node.js", "Python"] },
      ],
      description: "Building an AI-powered social network",
      recentActivity: ["Alice pushed code", "Bob fixed bug"],
      difficulty: "Medium",
      joinedDate: "2025-11-15",
      progress: 45,
    },
    {
      id: 2,
      name: "Code Crushers",
      skills: ["Python", "Machine Learning", "Data Science"],
      members: [
        { name: "Charlie", role: "ML Engineer", avatar: "https://randomuser.me/api/portraits/men/3.jpg", skills: ["Python", "ML"] },
        { name: "Dana", role: "Data Scientist", avatar: "https://randomuser.me/api/portraits/women/4.jpg", skills: ["Data Science"] },
        { name: "Eve", role: "Fullstack", avatar: "https://randomuser.me/api/portraits/women/5.jpg", skills: ["Python", "React"] },
      ],
      description: "Creating an ML model for health prediction",
      recentActivity: ["Dana uploaded dataset", "Charlie trained model"],
      difficulty: "Hard",
      joinedDate: "2025-12-10",
      progress: 70,
    },
    {
      id: 3,
      name: "Design Legends",
      skills: ["UI/UX", "React", "Figma"],
      members: [
        { name: "Frank", role: "Designer", avatar: "https://randomuser.me/api/portraits/men/6.jpg", skills: ["UI/UX", "Figma"] },
      ],
      description: "Need developers for our design-focused app",
      recentActivity: ["Frank shared new mockups"],
      difficulty: "Easy",
      joinedDate: "2025-12-18",
      progress: 20,
    },
    {
      id: 4,
      name: "Mobile Mavericks",
      skills: ["React Native", "Swift", "Kotlin"],
      members: [
        { name: "Grace", role: "Mobile Dev", avatar: "https://randomuser.me/api/portraits/women/7.jpg", skills: ["React Native"] },
        { name: "Henry", role: "Mobile Dev", avatar: "https://randomuser.me/api/portraits/men/8.jpg", skills: ["Swift", "Kotlin"] },
      ],
      description: "Cross-platform mobile app for fitness tracking",
      recentActivity: ["Grace merged PR", "Henry fixed iOS bug"],
      difficulty: "Medium",
      joinedDate: "2026-01-14",
      progress: 55,
    },
    {
      id: 5,
      name: "DevOps Dragons",
      skills: ["Docker", "Kubernetes", "AWS"],
      members: [
        { name: "Iris", role: "DevOps Engineer", avatar: "https://randomuser.me/api/portraits/women/9.jpg", skills: ["Docker", "Kubernetes"] },
      ],
      description: "Cloud infrastructure optimization and automation",
      recentActivity: ["Iris deployed new cluster"],
      difficulty: "Hard",
      joinedDate: "2026-02-12",
      progress: 35,
    },
    {
      id: 6,
      name: "GameDev Gurus",
      skills: ["Unity", "C#", "Unreal Engine"],
      members: [
        { name: "Jack", role: "Game Dev", avatar: "https://randomuser.me/api/portraits/men/10.jpg", skills: ["Unity", "C#"] },
      ],
      description: "Building an innovative 3D multiplayer game",
      recentActivity: ["Jack added new level"],
      difficulty: "Hard",
      joinedDate: "2026-02-16",
      progress: 25,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-cyan-400 text-xl">Loading...</p>
      </div>
    );
  }

  // Hackathon stats demo
  const hackathonStats = {
    countdown: "2d 5h 30m",
    teams: sampleTeams.length,
    participants: sampleTeams.reduce((acc, t) => acc + t.members.length, 0),
    awards: ["Best Innovation", "Best Design", "Best AI"]
  };

  const handleJoinTeam = (team: any) => {
    if (!joinedTeams.find((t) => t.id === team.id)) {
      setJoinedTeams([...joinedTeams, team]);
      setNotifications([
        { id: Date.now(), message: `🎉 You joined '${team.name}'!`, type: "success" },
        ...notifications,
      ]);
    }
  };
    const sampleProjects = [
      { id: 1, name: "AI Social Platform", team: "Web Warriors", description: "AI-powered social networking features with recommendation engine.", date: "2024-11-21", status: "Submitted", link: "#" },
      { id: 2, name: "Health Predictor ML", team: "Code Crushers", description: "Prototype ML model predicting health risks from datasets.", date: "2024-11-18", status: "In Progress", link: "#" },
      { id: 3, name: "Fitness Tracker App", team: "Mobile Mavericks", description: "Cross-platform fitness tracker with offline sync.", date: "2024-11-15", status: "Completed", link: "#" },
    ];
  const handleLeaveTeam = (team: any) => {
    setJoinedTeams(joinedTeams.filter((t) => t.id !== team.id));
    setNotifications([
      { id: Date.now(), message: `👋 You left '${team.name}'.`, type: "info" },
      ...notifications,
    ]);
  };

  // Filter teams based on search and skill
  const filteredTeams = sampleTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                         team.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesSkill = !skillFilter || team.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  // Chat functions
  const openChat = (team: any) => {
    setActiveChat(team);
    // Initialize with sample messages
    setChatMessages([
      { id: 1, sender: "Alice", role: "Frontend", avatar: "https://randomuser.me/api/portraits/women/1.jpg", message: "Hey team! Let's discuss the UI design", timestamp: "10:30 AM" },
      { id: 2, sender: "Bob", role: "Backend", avatar: "https://randomuser.me/api/portraits/men/2.jpg", message: "Sure! I've already started with the API endpoints", timestamp: "10:32 AM" },
      { id: 3, sender: "Alice", role: "Frontend", avatar: "https://randomuser.me/api/portraits/women/1.jpg", message: "Great! Can you share the API docs?", timestamp: "10:33 AM" },
      { id: 4, sender: "Bob", role: "Backend", avatar: "https://randomuser.me/api/portraits/men/2.jpg", message: "Will do! Sending the link now", timestamp: "10:35 AM" },
    ]);
  };

  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: user?.email?.split("@")[0] || "You",
      role: "Developer",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };

  // UI Styles
  const glassStyle = {
    background: "rgba(10,12,18,0.65)",
    boxShadow: "0 6px 24px rgba(2,6,23,0.6)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: "14px",
    backdropFilter: "blur(6px)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #071427 0%, #0b2440 100%)", color: "#eaf6f8", display: "flex", fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      {/* Enhanced Navigation */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 36px", ...glassStyle, position: "fixed", top: 12, left: 24, right: 24, zIndex: 100, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            style={{ background: "none", border: "none", color: "#9be7ef", fontSize: "1.4rem", cursor: "pointer" }}
          >
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="34" height="28" viewBox="0 0 34 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00bcd4" />
                  <stop offset="100%" stopColor="#00e676" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="34" height="28" rx="6" fill="url(#g1)" opacity="0.12" />
              <path d="M9 20 L17 4 L25 20 H19 L17 14 L15 20 H9 Z" fill="#00e676" opacity="0.95" />
            </svg>
            <span style={{ fontFamily: "'Orbitron', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial", fontWeight: 900, fontSize: "1.05rem", color: "#e6f9fb", letterSpacing: "1px", textTransform: "uppercase" }}>Hackathon Helper</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              style={{ background: "none", border: "none", color: "#00bcd4", fontSize: "1.5rem", cursor: "pointer", position: "relative" }}
            >
              🔔
              {notifications.length > 0 && (
                <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ffd600", color: "#222", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{ background: "transparent", border: "1px solid rgba(155,231,239,0.12)", color: "#e6f9fb", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}
          >
            👤 {user?.email?.split("@")[0]}
          </button>
          <button
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch (err) {
                console.error("Logout error:", err);
              }
              router.push("/");
            }}
            style={{ padding: "8px 20px", border: "1px solid rgba(155,231,239,0.12)", color: "#e6f9fb", borderRadius: "8px", background: "transparent", fontSize: "0.95rem", cursor: "pointer", fontWeight: 700 }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Enhanced Main Content with Sidebar */}
      <div style={{ marginTop: "100px", flex: 1, display: "flex" }}>
        {/* Left Sidebar */}
        {sidebarOpen && (
          <div style={{ width: "280px", background: "rgba(8,10,14,0.7)", borderRight: "1px solid rgba(255,255,255,0.04)", padding: "20px", overflowY: "auto", maxHeight: "calc(100vh - 140px)", marginLeft: 12 }}>
            <h3 style={{ color: "#00bcd4", fontWeight: "bold", marginBottom: "14px", fontSize: "1.1rem" }}>📊 Your Stats</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
              {/* Score Card */}
              <div style={{ padding: "12px", borderRadius: "10px", background: "linear-gradient(180deg, rgba(0,188,212,0.04), rgba(0,188,212,0.02))", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#9be7ef", fontWeight: 800 }}>Score</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "6px", background: "linear-gradient(90deg,#00bcd4,#00e676)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{scoreAnimated}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#cdeff3", marginBottom: "6px" }}>Level</div>
                  <div style={{ display: "inline-block", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", fontWeight: 800, color: "#ffd600" }}>{userStats.level}</div>
                </div>
              </div>

              {/* Projects Card with circular progress */}
              <div style={{ padding: "12px", borderRadius: "10px", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", display: "flex", alignItems: "center", gap: "12px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{ flex: "0 0 64px" }}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00bcd4" />
                      <stop offset="100%" stopColor="#00e676" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
                  <circle cx="32" cy="32" r="24" stroke="url(#g2)" strokeWidth="6" fill="none" strokeDasharray={`${_circleC}`} strokeDashoffset={projectsOffset} strokeLinecap="round" transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset 0.2s linear" }} />
                  <text x="32" y="36" textAnchor="middle" fontWeight={800} fontSize={12} fill="#eaf6f8">{projectsAnimatedPercent}%</text>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "12px", color: "#9be7ef", fontWeight: 800 }}>Projects Completed</div>
                  <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "6px", color: "#eaf6f8" }}>{userStats.projectsCompleted} total</div>
                  <div style={{ fontSize: "12px", color: "#cdeff3", marginTop: "6px" }}>{projectsPercent}% of 20 projects goal</div>
                </div>
                <div style={{ marginLeft: 6 }}>
                  <button onClick={() => setShowProjectsPanel(true)} style={{ padding: "6px 10px", fontSize: "12px", fontWeight: 800, borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)", background: "transparent", color: "#9be7ef", cursor: "pointer" }}>View projects</button>
                </div>
              </div>

              {/* Hackathons small stat */}
              <div style={{ padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "12px", color: "#9be7ef", fontWeight: 800 }}>Hackathons</div>
                  <div style={{ fontSize: "16px", fontWeight: 900, marginTop: "4px", color: "#eaf6f8" }}>{userStats.hackathonsAttended}</div>
                </div>
                <div style={{ fontSize: "12px", color: "#cdeff3", textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "center" }}>Keep going — badges await 🎖️</div>
              </div>
            </div>

            <h3 style={{ color: "#00bcd4", fontWeight: "bold", marginBottom: "12px", fontSize: "1.1rem" }}>🎯 Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => setTab("browse")}
                  style={{ padding: "12px", background: tab === "browse" ? "linear-gradient(90deg,#00bcd4,#00e676)" : "transparent", color: tab === "browse" ? "#022" : "#9be7ef", border: "1px solid rgba(155,231,239,0.06)", borderRadius: "8px", cursor: "pointer", fontWeight: 700, textAlign: "left" }}
                >
                  🔍 Browse Teams
                </button>
              <button
                onClick={() => setTab("my-teams")}
                style={{ padding: "12px", background: tab === "my-teams" ? "#00bcd4" : "rgba(0,188,212,0.1)", color: tab === "my-teams" ? "#222" : "#00bcd4", border: "1px solid #00bcd4", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", textAlign: "left" }}
              >
                👥 My Teams ({joinedTeams.length})
              </button>
              <button
                onClick={() => setTab("create")}
                style={{ padding: "12px", background: tab === "create" ? "#00bcd4" : "rgba(0,188,212,0.1)", color: tab === "create" ? "#222" : "#00bcd4", border: "1px solid #00bcd4", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", textAlign: "left" }}
              >
                ➕ Create Team
              </button>
              <button
                onClick={() => setTab("leaderboard")}
                style={{ padding: "12px", background: tab === "leaderboard" ? "#00bcd4" : "rgba(0,188,212,0.1)", color: tab === "leaderboard" ? "#222" : "#00bcd4", border: "1px solid #00bcd4", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", textAlign: "left" }}
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => setTab("messages")}
                style={{ padding: "12px", background: tab === "messages" ? "#00bcd4" : "rgba(0,188,212,0.1)", color: tab === "messages" ? "#222" : "#00bcd4", border: "1px solid #00bcd4", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", textAlign: "left" }}
              >
                💬 Messages
              </button>
            </div>

            <h3 style={{ color: "#00bcd4", fontWeight: "bold", marginBottom: "12px", fontSize: "1.1rem", marginTop: "24px" }}>🏷️ Filter by Skill</h3>
            <input
              type="text"
              placeholder="e.g., React, Python..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px", color: "#e6f6f8", fontSize: "0.9rem", marginBottom: "12px" }}
            />
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
          {/* Notifications Panel */}
          {showNotificationsPanel && (
            <div style={{ ...glassStyle, padding: "24px", marginBottom: "24px", position: "fixed", top: "80px", right: "24px", width: "300px", maxHeight: "400px", overflowY: "auto", zIndex: 200 }}>
              <h3 style={{ color: "#00bcd4", fontWeight: "bold", marginBottom: "16px" }}>📬 Notifications</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px",
                      background: n.type === "warning" ? "rgba(255,214,0,0.06)" : n.type === "success" ? "rgba(126,249,201,0.06)" : "rgba(155,231,239,0.03)",
                      borderLeft: `4px solid ${n.type === "warning" ? "#ffd600" : n.type === "success" ? "#00e676" : "#9be7ef"}`,
                      borderRadius: "6px",
                      color: n.type === "warning" ? "#ffd600" : n.type === "success" ? "#00e676" : "#9be7ef",
                      fontSize: "0.9rem",
                      boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.01)"
                    }}
                  >
                    {n.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          {tab === "browse" && (
            <div style={{ marginBottom: "32px" }}>
              <input
                type="text"
                placeholder="🔍 Search teams by name or description..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ width: "100%", padding: "16px", background: "rgba(0,188,212,0.1)", border: "1px solid #00bcd4", borderRadius: "12px", color: "#fff", fontSize: "1rem", boxSizing: "border-box" }}
              />
              <div style={{ marginTop: "12px", color: "#b2ebf2", fontSize: "0.9rem" }}>
                Found {filteredTeams.length} team{filteredTeams.length !== 1 ? "s" : ""} {skillFilter && `with ${skillFilter}`}
              </div>
            </div>
          )}

          {/* Browse Teams Tab */}
          {tab === "browse" && (
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#00bcd4", marginBottom: "24px" }}>🔍 Browse All Teams</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    style={{
                      ...glassStyle,
                      padding: "20px",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.22s, box-shadow 0.22s",
                      transform: selectedTeam?.id === team.id ? "scale(1.01)" : "scale(1)",
                    }}
                    onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#e8fbff", margin: 0 }}>{team.name}</h3>
                      <span
                        style={{
                          background: team.difficulty === "Easy" ? "rgba(0,230,118,0.12)" : team.difficulty === "Medium" ? "rgba(255,193,7,0.10)" : "rgba(255,82,82,0.10)",
                          color: team.difficulty === "Easy" ? "#00e676" : team.difficulty === "Medium" ? "#ffc107" : "#ff5252",
                          padding: "6px 10px",
                          borderRadius: "12px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        {team.difficulty}
                      </span>
                    </div>

                    <p style={{ color: "#cdeff3", marginBottom: "12px", fontSize: "0.95rem" }}>{team.description}</p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                        <span style={{ color: "#cdeff3" }}>Progress</span>
                        <span style={{ color: "#9be7ef", fontWeight: 800 }}>{team.progress}%</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", height: "8px", overflow: "hidden" }}>
                        <div style={{ background: "linear-gradient(90deg, #00bcd4, #00e676)", height: "100%", width: `${team.progress}%`, transition: "width 0.3s" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <b style={{ color: "#9be7ef", fontSize: "0.9rem" }}>Required Skills:</b>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                        {team.skills.map((skill) => (
                          <span key={skill} style={{ padding: "6px 10px", background: "rgba(255,255,255,0.02)", color: "#9be7ef", borderRadius: "12px", fontSize: "0.78rem", fontWeight: 700, border: "1px solid rgba(255,255,255,0.03)" }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {team.members.slice(0, 3).map((member: any) => (
                        <img key={member.name} src={member.avatar} alt={member.name} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.06)" }} title={`${member.name} - ${member.role}`} />
                      ))}
                      {team.members.length > 3 && (
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(255,255,255,0.02)", border: "2px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#9be7ef" }}>
                          +{team.members.length - 3}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: "12px", color: "#cdeff3", fontSize: "0.85rem" }}>
                      {team.members.length} member{team.members.length !== 1 ? "s" : ""} • Joined {team.joinedDate}
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                      {joinedTeams.find((t) => t.id === team.id) ? (
                        <>
                          <button onClick={() => setSelectedTeam(team)} style={{ flex: 1, padding: "10px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#042024", borderRadius: "8px", fontWeight: 800, cursor: "pointer", border: "none", fontSize: "0.9rem" }}>
                            👁️ View
                          </button>
                          <button onClick={() => handleLeaveTeam(team)} style={{ flex: 1, padding: "10px", background: "transparent", color: "#ff7a7a", borderRadius: "8px", fontWeight: 800, cursor: "pointer", border: "1px solid rgba(255,122,122,0.12)", fontSize: "0.9rem" }}>
                            Leave
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleJoinTeam(team)} style={{ flex: 1, padding: "10px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#042024", borderRadius: "8px", fontWeight: 800, cursor: "pointer", border: "none", fontSize: "0.9rem" }}>
                          Join Team
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Teams Tab */}
          {tab === "my-teams" && (
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#00bcd4", marginBottom: "24px" }}>👥 My Teams</h2>
              {joinedTeams.length === 0 ? (
                <div style={{ ...glassStyle, padding: "44px", textAlign: "center" }}>
                  <p style={{ color: "#cdeff3", marginBottom: "20px", fontSize: "1.05rem" }}>You haven't joined any teams yet.</p>
                  <button
                    onClick={() => setTab("browse")}
                    style={{ padding: "12px 28px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#042024", borderRadius: "10px", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem", border: "none" }}
                  >
                    Browse Teams
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
                  {joinedTeams.map((team) => (
                    <div key={team.id} style={{ ...glassStyle, padding: "20px", position: "relative" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#e8fbff", marginBottom: "10px" }}>{team.name}</h3>
                      <p style={{ color: "#cdeff3", marginBottom: "12px" }}>{team.description}</p>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "6px" }}>
                          <span style={{ color: "#cdeff3" }}>Progress</span>
                          <span style={{ color: "#9be7ef", fontWeight: 800 }}>{team.progress}%</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", height: "8px", overflow: "hidden" }}>
                          <div style={{ background: "linear-gradient(90deg, #00bcd4, #00e676)", height: "100%", width: `${team.progress}%` }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <b style={{ color: "#9be7ef" }}>Team Members:</b>
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                          {team.members.map((member: any) => (
                            <div key={member.name} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "6px 10px" }}>
                              <img src={member.avatar} alt={member.name} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
                              <div>
                                <div style={{ color: "#eaf6f8", fontWeight: 800, fontSize: "0.85rem" }}>{member.name}</div>
                                <div style={{ color: "#cdeff3", fontSize: "0.75rem" }}>{member.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <b style={{ color: "#9be7ef" }}>Recent Activity:</b>
                        <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
                          {team.recentActivity.map((act: string, idx: number) => (
                            <li key={idx} style={{ color: "#cdeff3", fontSize: "0.9rem" }}>✓ {act}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ display: "flex", gap: "12px" }}>
                        <button onClick={() => openChat(team)} style={{ flex: 1, padding: "10px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#042024", borderRadius: "8px", fontWeight: 800, cursor: "pointer", border: "none" }}>
                          📝 Chat
                        </button>
                        <button onClick={() => handleLeaveTeam(team)} style={{ flex: 1, padding: "10px", background: "transparent", color: "#ff7a7a", borderRadius: "8px", fontWeight: 800, cursor: "pointer", border: "1px solid rgba(255,122,122,0.12)" }}>
                          Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Team Tab */}
          {tab === "create" && (
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#00bcd4", marginBottom: "24px" }}>➕ Create a New Team</h2>
              <div style={{ ...glassStyle, maxWidth: "700px", padding: "32px" }}>
                <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#00bcd4" }}>Team Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Code Warriors"
                      style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", color: "#e6f6f8", fontSize: "1rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#00bcd4" }}>Description *</label>
                    <textarea
                      placeholder="What is your team working on?"
                      rows={4}
                      style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", color: "#e6f6f8", fontSize: "1rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#00bcd4" }}>Required Skills *</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Python, Machine Learning (comma separated)"
                      style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", color: "#e6f6f8", fontSize: "1rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", color: "#00bcd4" }}>Difficulty Level</label>
                    <select style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", color: "#e6f6f8", fontSize: "1rem" }}>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    style={{ width: "100%", padding: "14px", background: "linear-gradient(90deg, #00bcd4, #00e676)", color: "#042024", borderRadius: "10px", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", border: "none", marginTop: "12px" }}
                  >
                    🚀 Create Team
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {tab === "leaderboard" && (
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#00bcd4", marginBottom: "24px" }}>🏆 Leaderboard</h2>
              <div style={{ ...glassStyle, padding: "24px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <th style={{ padding: "12px", textAlign: "left", color: "#9be7ef", fontWeight: 800 }}>Rank</th>
                      <th style={{ padding: "12px", textAlign: "left", color: "#9be7ef", fontWeight: 800 }}>Team</th>
                      <th style={{ padding: "12px", textAlign: "center", color: "#9be7ef", fontWeight: 800 }}>Score</th>
                      <th style={{ padding: "12px", textAlign: "center", color: "#9be7ef", fontWeight: 800 }}>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleTeams.map((team, idx) => (
                      <tr key={team.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.18s" }}>
                        <td style={{ padding: "12px", color: idx === 0 ? "#ffd600" : idx === 1 ? "#c0c0c0" : idx === 2 ? "#cd7f32" : "#cdeff3", fontWeight: 800, fontSize: "1.05rem" }}>
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                        </td>
                        <td style={{ padding: "12px", color: "#eaf6f8", fontWeight: 800 }}>{team.name}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#7ef9c9", fontWeight: 800 }}>{8000 - idx * 500}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#cdeff3" }}>{team.members.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {tab === "messages" && (
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#00bcd4", marginBottom: "24px" }}>💬 Messages</h2>
              <div style={{ ...glassStyle, padding: "24px", textAlign: "center" }}>
                <p style={{ color: "#cdeff3", fontSize: "1.05rem", marginBottom: "16px" }}>📭 No messages yet</p>
                <p style={{ color: "#cdeff3", fontSize: "0.95rem" }}>Join a team to start chatting with members!</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Modal */}
        {showProjectsPanel && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
            <div style={{ width: "760px", maxWidth: "96%", maxHeight: "80vh", overflowY: "auto", padding: "18px", ...glassStyle }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0, color: "#e6f9fb", fontWeight: 800 }}>Previous Projects</h3>
                <button onClick={() => setShowProjectsPanel(false)} style={{ background: "transparent", border: "none", color: "#9be7ef", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {sampleProjects.map((p) => (
                  <div key={p.id} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#eaf6f8" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#cdeff3", marginTop: 6 }}>{p.description}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: "#9be7ef", fontWeight: 800 }}>{p.team}</div>
                        <div style={{ fontSize: 12, color: "#cdeff3", marginTop: 6 }}>{p.date}</div>
                        <div style={{ marginTop: 8 }}>
                          <a href={p.link} style={{ color: "#00e676", fontWeight: 800, textDecoration: "none", marginRight: 10 }}>Open</a>
                          <span style={{ fontSize: 12, color: p.status === "Completed" ? "#7ef9c9" : p.status === "Submitted" ? "#ffd600" : "#9be7ef" }}>{p.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeChat && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 1000 }}>
            <div style={{ width: "420px", height: "100vh", background: "linear-gradient(180deg,#071427 0%, #0b2440 100%)", display: "flex", flexDirection: "column", borderLeft: "2px solid rgba(255,255,255,0.04)" }}>
              {/* Chat Header */}
              <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ color: "#e6f9fb", fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>{activeChat.name}</h3>
                  <p style={{ color: "#cdeff3", fontSize: "0.82rem", margin: "6px 0 0 0" }}>👥 {activeChat.members.length} members</p>
                </div>
                <button
                  onClick={() => setActiveChat(null)}
                  aria-label="Close chat"
                  style={{ background: "transparent", border: "none", color: "#9be7ef", fontSize: "1.25rem", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
                    <img src={msg.avatar} alt={msg.sender} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ color: "#eaf6f8", fontWeight: 800, fontSize: "0.9rem" }}>{msg.sender}</span>
                        <span style={{ color: "#cdeff3", fontSize: "0.78rem" }}>{msg.timestamp}</span>
                      </div>
                      <p style={{ color: "#e6f9fb", fontSize: "0.92rem", margin: 0, background: "rgba(255,255,255,0.02)", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.02)" }}>
                        {msg.message}
                      </p>
                      <p style={{ color: "#cdeff3", fontSize: "0.75rem", margin: "6px 0 0 0" }}>{msg.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.03)", display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", color: "#e6f6f8", fontSize: "0.95rem" }}
                />
                <button
                  onClick={sendMessage}
                  style={{ padding: "10px 14px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#042024", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.98rem" }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
