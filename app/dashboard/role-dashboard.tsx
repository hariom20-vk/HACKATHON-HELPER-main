// Role-based dashboard components - imported/used in main dashboard
import React from "react";

export const TeamHeadDashboard = ({
  glassStyle,
  userRole,
  pendingMembers,
  teamAnalytics,
  setNotifications,
  notifications,
  user,
}: any) => {
  const approveMember = (member: any) => {
    setNotifications([
      { id: Date.now(), message: `✅ Approved ${member.name} as ${member.appliedRole}!`, type: "success" },
      ...notifications,
    ]);
  };

  const rejectMember = (member: any) => {
    setNotifications([
      { id: Date.now(), message: `❌ Rejected application from ${member.name}.`, type: "warning" },
      ...notifications,
    ]);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Team Head Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>👥 Team Members</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#00e676", marginBottom: "8px" }}>{teamAnalytics.totalMembers}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Active in your team</div>
        </div>

        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>🚀 Active Projects</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#00bcd4", marginBottom: "8px" }}>{teamAnalytics.activeProjects}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Currently in progress</div>
        </div>

        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>✅ Completion Rate</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffd600", marginBottom: "8px" }}>{teamAnalytics.completionRate}%</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Project success rate</div>
        </div>

        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>⭐ Avg Team Score</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ff6e40", marginBottom: "8px" }}>{teamAnalytics.averageScore}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Team performance</div>
        </div>
      </div>

      {/* Pending Approvals Section */}
      <div style={{ ...glassStyle, padding: "24px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#00bcd4", marginBottom: "20px" }}>📋 Pending Member Approvals ({pendingMembers.length})</h3>
        {pendingMembers.length === 0 ? (
          <div style={{ color: "#cdeff3", textAlign: "center", padding: "20px" }}>All applications have been reviewed!</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pendingMembers.map((member) => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: "16px", background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#e8fbff", fontWeight: 800, fontSize: "0.95rem" }}>{member.name}</div>
                  <div style={{ color: "#9be7ef", fontSize: "0.85rem" }}>{member.email}</div>
                  <div style={{ color: "#cdeff3", fontSize: "0.85rem", marginTop: "4px" }}>Role: <span style={{ color: "#00e676", fontWeight: 700 }}>{member.appliedRole}</span></div>
                  <div style={{ color: "#9be7ef", fontSize: "0.8rem", marginTop: "4px" }}>Applied: {member.appliedAt}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => approveMember(member)} style={{ padding: "8px 16px", background: "linear-gradient(90deg,#00e676,#1de9b6)", color: "#022", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem" }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => rejectMember(member)} style={{ padding: "8px 16px", background: "transparent", color: "#ff7a7a", border: "1px solid rgba(255,122,122,0.3)", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem" }}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Management Section */}
      <div style={{ ...glassStyle, padding: "24px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#00bcd4", marginBottom: "20px" }}>⚙️ Team Management</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <button style={{ padding: "16px", background: "rgba(0,180,219,0.1)", border: "2px solid rgba(0,180,219,0.3)", borderRadius: "10px", color: "#9be7ef", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>
            📊 View Analytics
          </button>
          <button style={{ padding: "16px", background: "rgba(0,230,118,0.1)", border: "2px solid rgba(0,230,118,0.3)", borderRadius: "10px", color: "#00e676", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>
            👥 Manage Members
          </button>
          <button style={{ padding: "16px", background: "rgba(255,214,0,0.1)", border: "2px solid rgba(255,214,0,0.3)", borderRadius: "10px", color: "#ffd600", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>
            🎯 Assign Projects
          </button>
          <button style={{ padding: "16px", background: "rgba(255,107,107,0.1)", border: "2px solid rgba(255,107,107,0.3)", borderRadius: "10px", color: "#ff6b6b", fontWeight: 800, cursor: "pointer", fontSize: "0.95rem" }}>
            📝 Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export const TeamMemberDashboard = ({
  glassStyle,
  assignedTasks,
  user,
}: any) => {
  return (
    <div style={{ width: "100%" }}>
      {/* Member Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>📌 My Tasks</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#00bcd4", marginBottom: "8px" }}>{assignedTasks.length}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>{assignedTasks.filter((t) => t.status === "Completed").length} completed</div>
        </div>

        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>🔥 In Progress</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#00e676", marginBottom: "8px" }}>{assignedTasks.filter((t) => t.status === "In Progress").length}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Tasks actively worked on</div>
        </div>

        <div style={{ ...glassStyle, padding: "20px" }}>
          <div style={{ fontSize: "0.9rem", color: "#9be7ef", fontWeight: 700, marginBottom: "8px" }}>⏳ Pending</div>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffd600", marginBottom: "8px" }}>{assignedTasks.filter((t) => t.status === "Pending").length}</div>
          <div style={{ fontSize: "0.85rem", color: "#cdeff3" }}>Awaiting your action</div>
        </div>
      </div>

      {/* Assigned Tasks */}
      <div style={{ ...glassStyle, padding: "24px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#00bcd4", marginBottom: "20px" }}>📋 Assigned Tasks</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {assignedTasks.map((task) => (
            <div key={task.id} style={{ background: "rgba(255,255,255,0.03)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ color: "#e8fbff", fontWeight: 800, fontSize: "0.95rem" }}>{task.title}</div>
                  <span style={{ padding: "2px 8px", background: task.priority === "High" ? "rgba(255,82,82,0.15)" : task.priority === "Medium" ? "rgba(255,193,7,0.15)" : "rgba(0,230,118,0.15)", color: task.priority === "High" ? "#ff5252" : task.priority === "Medium" ? "#ffc107" : "#00e676", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {task.priority}
                  </span>
                </div>
                <div style={{ color: "#9be7ef", fontSize: "0.85rem" }}>Assigned by: <span style={{ color: "#cdeff3" }}>{task.assignedBy}</span></div>
                <div style={{ color: "#9be7ef", fontSize: "0.85rem", marginTop: "4px" }}>Due: <span style={{ color: "#cdeff3" }}>{task.dueDate}</span></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <span style={{ padding: "4px 10px", background: task.status === "Completed" ? "rgba(0,230,118,0.15)" : task.status === "In Progress" ? "rgba(0,180,219,0.15)" : "rgba(255,214,0,0.15)", color: task.status === "Completed" ? "#00e676" : task.status === "In Progress" ? "#00bcd4" : "#ffd600", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}>
                  {task.status}
                </span>
                {task.status !== "Completed" && (
                  <button style={{ padding: "6px 10px", background: "linear-gradient(90deg,#00bcd4,#00e676)", color: "#022", border: "none", borderRadius: "6px", fontWeight: 700, cursor: "pointer", fontSize: "0.8rem" }}>
                    Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning & Resources */}
      <div style={{ ...glassStyle, padding: "24px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#00bcd4", marginBottom: "20px" }}>📚 Learning Resources</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <button style={{ padding: "12px", background: "rgba(0,180,219,0.1)", border: "2px solid rgba(0,180,219,0.3)", borderRadius: "8px", color: "#9be7ef", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            📖 Documentation
          </button>
          <button style={{ padding: "12px", background: "rgba(0,230,118,0.1)", border: "2px solid rgba(0,230,118,0.3)", borderRadius: "8px", color: "#00e676", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            🎬 Tutorials
          </button>
          <button style={{ padding: "12px", background: "rgba(255,214,0,0.1)", border: "2px solid rgba(255,214,0,0.3)", borderRadius: "8px", color: "#ffd600", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            🤝 Ask Mentor
          </button>
          <button style={{ padding: "12px", background: "rgba(255,107,107,0.1)", border: "2px solid rgba(255,107,107,0.3)", borderRadius: "8px", color: "#ff6b6b", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            💡 Suggestions
          </button>
        </div>
      </div>
    </div>
  );
};
