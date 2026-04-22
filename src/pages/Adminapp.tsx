import { useState, useEffect, useCallback } from "react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: "1", name: "Arjun Mehta",   email: "arjun@example.com",  phone: "+919876543210", role: "USER",  isActive: true,  isEmailVerified: true,  createdAt: "2025-01-10T10:00:00Z" },
  { id: "2", name: "Priya Singh",   email: "priya@example.com",  phone: "+919876543211", role: "USER",  isActive: true,  isEmailVerified: true,  createdAt: "2025-01-12T10:00:00Z" },
  { id: "3", name: "Rahul Sharma",  email: "rahul@example.com",  phone: "+919876543212", role: "USER",  isActive: false, isEmailVerified: true,  createdAt: "2025-01-14T10:00:00Z" },
  { id: "4", name: "Kavya Reddy",   email: "kavya@example.com",  phone: "+919876543213", role: "USER",  isActive: true,  isEmailVerified: false, createdAt: "2025-01-16T10:00:00Z" },
  { id: "5", name: "Vikram Nair",   email: "vikram@example.com", phone: "+919876543214", role: "USER",  isActive: true,  isEmailVerified: true,  createdAt: "2025-01-18T10:00:00Z" },
  { id: "6", name: "Sneha Patel",   email: "sneha@example.com",  phone: "+919876543215", role: "USER",  isActive: false, isEmailVerified: true,  createdAt: "2025-01-20T10:00:00Z" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type User = typeof MOCK_USERS[0];
type View = "dashboard" | "users" | "blogs" | "reviews";
type ModalMode = "add" | "edit" | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const colors = ["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.33, fontWeight: 500, flexShrink: 0 }}>
      {initials(name)}
    </div>
  );
}

function Badge({ active }: { active: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: active ? "#d1fae5" : "#fee2e2", color: active ? "#065f46" : "#991b1b" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#10b981" : "#ef4444", display: "inline-block" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: type === "success" ? "#ecfdf5" : "#fef2f2", border: `1px solid ${type === "success" ? "#6ee7b7" : "#fca5a5"}`, color: type === "success" ? "#065f46" : "#991b1b", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", maxWidth: 320 }}>
      {msg}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@yopmail.com");
  const [password, setPassword] = useState("StrongPassword@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@yopmail.com" && password === "StrongPassword@123") {
        onLogin();
      } else {
        setError("Invalid email or password");
      }
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-background-tertiary)" }}>
      <div style={{ width: 400, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 16, padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: "#4f46e5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, color: "#fff", fontWeight: 700 }}>A</div>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 6px", color: "var(--color-text-primary)" }}>Admin Portal</h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>Sign in to your admin account</p>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@example.com" style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" style={{ width: "100%", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 16, background: "#fef2f2", padding: "8px 12px", borderRadius: 8 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px 0", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 20 }}>Demo: admin@yopmail.com / StrongPassword@123</p>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",       icon: "⊞" },
  { id: "users",     label: "User management", icon: "👥" },
  { id: "blogs",     label: "Blog management", icon: "📝" },
  { id: "reviews",   label: "Review management", icon: "⭐" },
] as const;

function Sidebar({ view, setView, onLogout }: { view: View; setView: (v: View) => void; onLogout: () => void }) {
  return (
    <aside style={{ width: 220, flexShrink: 0, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#4f46e5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>A</div>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>Admin Panel</span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {NAV_ITEMS.map(item => {
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id as View)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", background: active ? "#eef2ff" : "transparent", color: active ? "#4f46e5" : "var(--color-text-secondary)", fontSize: 14, fontWeight: active ? 500 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "16px 10px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
          <Avatar name="Super Admin" size={30} />
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Super Admin</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Administrator</p>
          </div>
        </div>
        <button onClick={onLogout} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-secondary)", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardView({ setView }: { setView: (v: View) => void }) {
  const cards = [
    { label: "Total users",    value: "6",  sub: "+2 this week",  color: "#4f46e5", view: "users"   },
    { label: "Blog posts",     value: "24", sub: "3 drafts",      color: "#0891b2", view: "blogs"   },
    { label: "Reviews",        value: "91", sub: "12 pending",    color: "#059669", view: "reviews" },
    { label: "Active users",   value: "4",  sub: "2 deactivated", color: "#d97706", view: "users"   },
  ];

  const recent = MOCK_USERS.slice(0, 4);

  return (
    <div style={{ padding: "32px 32px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 500 }}>Dashboard</h2>
      <p style={{ margin: "0 0 28px", color: "var(--color-text-secondary)", fontSize: 14 }}>Welcome back, Super Admin</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <button key={c.label} onClick={() => setView(c.view as View)} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "20px", textAlign: "left", cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, background: c.color + "18", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.color }} />
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--color-text-secondary)" }}>{c.label}</p>
            <p style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{c.value}</p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-tertiary)" }}>{c.sub}</p>
          </button>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Recent users</h3>
          <button onClick={() => setView("users")} style={{ fontSize: 13, color: "#4f46e5", background: "none", border: "none", cursor: "pointer" }}>View all →</button>
        </div>
        {recent.map(u => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <Avatar name={u.name} size={34} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{u.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{u.email}</p>
            </div>
            <Badge active={u.isActive} />
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{fmtDate(u.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

function UserModal({ mode, user, onSave, onClose }: {
  mode: "add" | "edit";
  user?: User;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [loading, setLoading] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSave(form); }, 700);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 440, background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", padding: "28px 28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>{mode === "add" ? "Add new user" : "Edit user"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--color-text-secondary)", lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={submit}>
          {[
            { label: "Full name",     key: "name",  type: "text",  ph: "Arjun Mehta" },
            { label: "Email address", key: "email", type: "email", ph: "arjun@example.com" },
            { label: "Phone number",  key: "phone", type: "text",  ph: "+919876543210" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.ph} required style={{ width: "100%", boxSizing: "border-box" }} />
            </div>
          ))}
          {mode === "add" && (
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px", marginBottom: 20 }}>
              A secure password will be auto-generated and sent to the user via email.
            </p>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "transparent", fontSize: 14, cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#4f46e5", color: "#fff", fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving…" : mode === "add" ? "Create user" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── User Management Page ─────────────────────────────────────────────────────

function UserManagementView() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<User | undefined>();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? u.isActive : !u.isActive);
    return matchSearch && matchFilter;
  });

  const handleSave = (data: Partial<User>) => {
    if (modal === "add") {
      const newUser: User = { id: String(Date.now()), role: "USER", isEmailVerified: true, isActive: true, createdAt: new Date().toISOString(), ...data } as User;
      setUsers(u => [newUser, ...u]);
      showToast("User created. Credentials sent via email.");
    } else if (modal === "edit" && editing) {
      setUsers(u => u.map(x => x.id === editing.id ? { ...x, ...data } : x));
      showToast("User updated successfully.");
    }
    setModal(null);
    setEditing(undefined);
  };

  const toggleStatus = (user: User) => {
    setUsers(u => u.map(x => x.id === user.id ? { ...x, isActive: !x.isActive } : x));
    showToast(user.isActive ? "User deactivated." : "User activated.");
  };

  const openEdit = (user: User) => { setEditing(user); setModal("edit"); };

  const stats = { total: users.length, active: users.filter(u => u.isActive).length, inactive: users.filter(u => !u.isActive).length };

  return (
    <div style={{ padding: "32px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {modal && <UserModal mode={modal} user={editing} onSave={handleSave} onClose={() => { setModal(null); setEditing(undefined); }} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 500 }}>User management</h2>
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 14 }}>Manage all user accounts on the platform</p>
        </div>
        <button onClick={() => setModal("add")} style={{ padding: "9px 18px", borderRadius: 8, background: "#4f46e5", color: "#fff", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          + Add user
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total users",   value: stats.total,    color: "#4f46e5" },
          { label: "Active",        value: stats.active,   color: "#059669" },
          { label: "Deactivated",   value: stats.inactive, color: "#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--color-text-secondary)" }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 500, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", gap: 12, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" style={{ flex: 1, maxWidth: 300 }} />
          <div style={{ display: "flex", gap: 4 }}>
            {(["all", "active", "inactive"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 7, border: "0.5px solid var(--color-border-secondary)", background: filter === f ? "#eef2ff" : "transparent", color: filter === f ? "#4f46e5" : "var(--color-text-secondary)", fontSize: 13, fontWeight: filter === f ? 500 : 400, cursor: "pointer", textTransform: "capitalize" }}>
                {f}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "var(--color-background-secondary)" }}>
              {["User", "Phone", "Role", "Status", "Joined", "Actions"].map((h, i) => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", borderBottom: "0.5px solid var(--color-border-tertiary)", width: i === 0 ? "28%" : i === 5 ? "14%" : "auto" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>No users found</td>
              </tr>
            )}
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.name} size={34} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--color-text-secondary)" }}>{u.phone}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: u.role === "ADMIN" ? "#ede9fe" : "#f1f5f9", color: u.role === "ADMIN" ? "#5b21b6" : "#475569", fontWeight: 500 }}>{u.role}</span>
                </td>
                <td style={{ padding: "14px 20px" }}><Badge active={u.isActive} /></td>
                <td style={{ padding: "14px 20px", fontSize: 12, color: "var(--color-text-tertiary)" }}>{fmtDate(u.createdAt)}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(u)} style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--color-text-secondary)" }}>Edit</button>
                    <button onClick={() => toggleStatus(u)} style={{ padding: "5px 12px", borderRadius: 6, border: `0.5px solid ${u.isActive ? "#fca5a5" : "#6ee7b7"}`, background: u.isActive ? "#fef2f2" : "#ecfdf5", fontSize: 12, cursor: "pointer", color: u.isActive ? "#dc2626" : "#059669", fontWeight: 500 }}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Placeholder views ────────────────────────────────────────────────────────

function PlaceholderView({ title, icon }: { title: string; icon: string }) {
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 500 }}>{title}</h2>
      <p style={{ margin: "0 0 40px", color: "var(--color-text-secondary)", fontSize: 14 }}>Manage all {title.toLowerCase()} on the platform</p>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "60px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
        <p style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-primary)" }}>{title} coming soon</p>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>This section is under development</p>
      </div>
    </div>
  );
}

// ─── Root app ──────────────────────────────────────────────────────────────────

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <Sidebar view={view} setView={setView} onLogout={() => { setLoggedIn(false); setView("dashboard"); }} />
      <main style={{ flex: 1, overflow: "auto" }}>
        {view === "dashboard" && <DashboardView setView={setView} />}
        {view === "users"     && <UserManagementView />}
        {view === "blogs"     && <PlaceholderView title="Blog management"   icon="📝" />}
        {view === "reviews"   && <PlaceholderView title="Review management" icon="⭐" />}
      </main>
    </div>
  );
}