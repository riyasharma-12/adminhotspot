import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "directory" | "roles" | "consent";
type UserRole = "School Admin" | "Advertiser" | "Admin";
type UserStatus = "Active" | "Inactive";
type ConsentStatus = "Consented" | "Pending";

interface User {
  name: string;
  email: string;
  role: UserRole;
  school: string;
  joined: string;
  status: UserStatus;
  avatarColor: string;
  avatarBg: string;
}

interface ConsentRecord {
  name: string;
  role: UserRole;
  date: string;
  version: string;
  ip: string;
  status: ConsentStatus;
}

interface Permission {
  name: string;
  schoolAdmin: boolean;
  advertiser: boolean;
  admin: boolean;
}

// ── Badge ──────────────────────────────────────────────────────────
const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Active: "bg-[#0d2b1f] text-[#22c97a]",
    Inactive: "bg-[#13161e] text-[#6b728e]",
    "School Admin": "bg-[#0d2b1f] text-[#22c97a]",
    Admin: "bg-[#2a0f16] text-[#ff4f6a]",
    Advertiser: "bg-[#1e0a2e] text-[#c084fc]",
    Consented: "bg-[#0d2b1f] text-[#22c97a]",
    Pending: "bg-[#2a2008] text-[#f5c542]",
  };
  return <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? "bg-[#13161e] text-[#6b728e]"}`}>{status}</span>;
};

// ── Btn ────────────────────────────────────────────────────────────
const Btn: React.FC<{ label: string; variant?: "primary" | "danger" | "success" | "ghost"; onClick?: () => void; full?: boolean }> = ({
  label, variant = "primary", onClick, full,
}) => {
  const cls: Record<string, string> = {
    primary: "bg-[#4f8cff] text-white",
    danger: "bg-[#ff4f6a] text-white",
    success: "bg-[#22c97a] text-white",
    ghost: "bg-[#232840] text-[#e8eaf2]",
  };
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none mr-1.5 hover:opacity-85 transition-opacity ${cls[variant]} ${full ? "w-full" : ""}`}>
      {label}
    </button>
  );
};

const TH: React.FC<{ children: React.ReactNode; colorClass?: string }> = ({ children, colorClass = "text-[#6b728e]" }) => (
  <th className={`text-left px-3.5 py-2.5 text-[11px] border-b border-[#232840] uppercase tracking-wide whitespace-nowrap ${colorClass}`}>{children}</th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-3.5 py-[11px] text-[13px] border-b border-[#232840] text-[#e8eaf2] ${className}`}>{children}</td>
);

const inputCls = "w-full bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none placeholder-[#6b728e]";
const selectCls = "bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none cursor-pointer";
const labelCls = "block text-xs text-[#6b728e] font-medium mb-1.5";

// ── Data ───────────────────────────────────────────────────────────
const USERS: User[] = [
  { name: "Thabo Nkosi", email: "thabo@westville.co.za", role: "School Admin", school: "Westville Boys High", joined: "2024-01-15", status: "Active", avatarColor: "text-[#22c97a]", avatarBg: "bg-[#22c97a]/20" },
  { name: "Sarah van der Berg", email: "sarah@capefc.co.za", role: "School Admin", school: "Cape FC", joined: "2024-03-10", status: "Active", avatarColor: "text-[#22c97a]", avatarBg: "bg-[#22c97a]/20" },
  { name: "Mike Johnson", email: "mike@adco.co.za", role: "Advertiser", school: "—", joined: "2024-05-20", status: "Active", avatarColor: "text-[#c084fc]", avatarBg: "bg-[#c084fc]/20" },
  { name: "Super Admin", email: "admin@platform.co.za", role: "Admin", school: "—", joined: "2023-12-01", status: "Active", avatarColor: "text-[#ff4f6a]", avatarBg: "bg-[#ff4f6a]/20" },
  { name: "Lindiwe Dlamini", email: "lindiwe@joburgacad.co.za", role: "School Admin", school: "Joburg Academy", joined: "2024-06-01", status: "Active", avatarColor: "text-[#22c97a]", avatarBg: "bg-[#22c97a]/20" },
  { name: "Ruan Botha", email: "ruan@pretoriastars.co.za", role: "School Admin", school: "Pretoria Stars", joined: "2024-04-14", status: "Inactive", avatarColor: "text-[#f5c542]", avatarBg: "bg-[#f5c542]/20" },
];

const CONSENT_RECORDS: ConsentRecord[] = [
  { name: "Thabo Nkosi", role: "School Admin", date: "2024-01-15 08:32", version: "v2.1", ip: "41.13.x.x", status: "Consented" },
  { name: "Sarah van der Berg", role: "School Admin", date: "2024-03-10 09:01", version: "v2.1", ip: "196.22.x.x", status: "Consented" },
  { name: "Mike Johnson", role: "Advertiser", date: "2024-05-20 14:45", version: "v2.0", ip: "102.65.x.x", status: "Consented" },
  { name: "Ruan Botha", role: "School Admin", date: "—", version: "—", ip: "—", status: "Pending" },
];

const PERMISSIONS: Permission[] = [
  { name: "Post News", schoolAdmin: true, advertiser: false, admin: true },
  { name: "Submit Ads", schoolAdmin: false, advertiser: true, admin: true },
  { name: "View Own Payment History", schoolAdmin: true, advertiser: true, admin: true },
  { name: "View All Payments", schoolAdmin: false, advertiser: false, admin: true },
  { name: "Moderate Content", schoolAdmin: false, advertiser: false, admin: true },
  { name: "Manage Users", schoolAdmin: false, advertiser: false, admin: true },
  { name: "Edit School Profile", schoolAdmin: true, advertiser: false, admin: true },
  { name: "View Platform Analytics", schoolAdmin: false, advertiser: false, admin: true },
  { name: "Send Announcements", schoolAdmin: false, advertiser: false, admin: true },
  { name: "Manage Pricing", schoolAdmin: false, advertiser: false, admin: true },
];

// ── Check/X Icon ──────────────────────────────────────────────────
const PermIcon: React.FC<{ allowed: boolean }> = ({ allowed }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="mx-auto block">
    {allowed
      ? <polyline points="20 6 9 17 4 12" strokeWidth="2.5" stroke="#22c97a" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      : (<><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" stroke="#ff4f6a" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" stroke="#ff4f6a" strokeLinecap="round" /></>)
    }
  </svg>
);

// ── Main Component ─────────────────────────────────────────────────
const UserManagementPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("directory");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = USERS.filter(u =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "directory", label: "User Directory" },
    { key: "roles", label: "Role Assignment" },
    { key: "consent", label: "Consent Records" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; } input::placeholder, textarea::placeholder { color: #6b728e; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>User Management</h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">Manage users, roles, and POPI consent records</p>
        </div>
        <div className="bg-[#181c27] border border-[#232840] rounded-lg px-4 py-2 text-center">
          <div className="text-[18px] font-extrabold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>4,821</div>
          <div className="text-[11px] text-[#6b728e]">Total Users</div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {([["School Admins", "1,284", "border-t-[#22c97a]", "text-[#22c97a]"], ["Advertisers", "87", "border-t-[#c084fc]", "text-[#c084fc]"], ["Platform Admins", "3", "border-t-[#ff4f6a]", "text-[#ff4f6a]"], ["Inactive Accounts", "124", "border-t-[#6b728e]", "text-[#6b728e]"]] as [string, string, string, string][]).map(([l, v, bc, tc]) => (
            <div key={l} className={`bg-[#181c27] border border-[#232840] rounded-xl p-[18px] border-t-[3px] ${bc}`}>
              <div className={`text-[26px] font-extrabold leading-none mb-1 ${tc}`} style={{ fontFamily: "'Sora', sans-serif" }}>{v}</div>
              <div className="text-xs text-[#6b728e]">{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${tab === key ? "border-[#4f8cff] bg-[#1a2a4a] text-[#4f8cff]" : "border-[#232840] bg-transparent text-[#6b728e]"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── USER DIRECTORY ── */}
        {tab === "directory" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 stroke-[#6b728e]" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" strokeWidth="1.5" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} placeholder="Search by name or email..." />
              </div>
              <select className={`${selectCls} w-44`} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                {["All", "School Admin", "Advertiser", "Admin"].map(r => <option key={r}>{r}</option>)}
              </select>
              <button className="bg-[#4f8cff] border-none rounded-lg px-4 py-2 text-white text-xs font-semibold cursor-pointer hover:opacity-85 whitespace-nowrap flex-shrink-0">
                + Invite User
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["User", "Role", "School", "Joined", "Status", "Actions"].map(h => <TH key={h}>{h}</TH>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.email}>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center font-bold text-[13px] ${u.avatarBg} ${u.avatarColor}`}>
                          {u.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-[#6b728e]">{u.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD><Badge status={u.role} /></TD>
                    <TD className="text-[#6b728e]">{u.school}</TD>
                    <TD className="text-[#6b728e]">{u.joined}</TD>
                    <TD><Badge status={u.status} /></TD>
                    <TD>
                      <Btn label="Edit" variant="ghost" />
                      <Btn label={u.status === "Active" ? "Deactivate" : "Activate"} variant={u.status === "Active" ? "danger" : "success"} />
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-3 text-xs text-[#6b728e]">{filtered.length} users shown</div>
          </div>
        )}

        {/* ── ROLE ASSIGNMENT ── */}
        {tab === "roles" && (
          <div className="grid grid-cols-2 gap-5">
            <div>
              {/* Assign Form */}
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6 mb-5">
                <div className="font-bold text-[15px] text-white mb-4">Assign Role to User</div>
                <div className="mb-3"><label className={labelCls}>Select User *</label><input className={inputCls} placeholder="Search user by name or email..." /></div>
                <div className="mb-3"><label className={labelCls}>New Role *</label>
                  <select className={`${selectCls} w-full`}><option>School Admin</option><option>Advertiser</option><option>Admin</option></select>
                </div>
                <div className="mb-4"><label className={labelCls}>Reason for Change</label><textarea className={`${inputCls} h-16 resize-none`} placeholder="Optional: document reason..." /></div>
                <Btn label="Save Role Change" />
              </div>

              {/* Recent Changes */}
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6">
                <div className="font-bold text-[15px] text-white mb-3.5">Recent Role Changes</div>
                {[["Ruan Botha", "School Admin → Inactive", "2025-06-25"], ["Amanda Pretorius", "User → Advertiser", "2025-06-10"], ["Super Admin", "User → Admin", "2023-12-01"]].map(([name, change, date]) => (
                  <div key={name} className="py-2.5 border-b border-[#232840]">
                    <div className="font-semibold text-[13px] text-white">{name}</div>
                    <div className="text-xs text-[#6b728e]">{change} · {date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6">
              <div className="font-bold text-[15px] text-white mb-1">Role Permissions Matrix</div>
              <div className="text-xs text-[#6b728e] mb-4">What each role can do in the platform</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <TH>Permission</TH>
                    <TH colorClass="text-[#22c97a]">School Admin</TH>
                    <TH colorClass="text-[#c084fc]">Advertiser</TH>
                    <TH colorClass="text-[#ff4f6a]">Platform Admin</TH>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map(p => (
                    <tr key={p.name}>
                      <TD className="text-xs">{p.name}</TD>
                      <TD className="text-center"><PermIcon allowed={p.schoolAdmin} /></TD>
                      <TD className="text-center"><PermIcon allowed={p.advertiser} /></TD>
                      <TD className="text-center"><PermIcon allowed={p.admin} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mt-4 px-4 py-2 rounded-lg bg-[#232840] text-[#e8eaf2] text-xs font-semibold cursor-pointer border-none hover:opacity-85">Edit Permissions</button>
            </div>
          </div>
        )}

        {/* ── CONSENT RECORDS ── */}
        {tab === "consent" && (
          <>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5 mb-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-bold text-[15px] text-white">POPI Consent Records</div>
                  <div className="text-xs text-[#6b728e] mt-1">All recorded user consents under the Protection of Personal Information Act</div>
                </div>
                <button className="bg-[#1a2a4a] border border-[#4f8cff] rounded-lg px-4 py-2 text-[#4f8cff] text-xs font-semibold cursor-pointer hover:opacity-85">↓ Export Records</button>
              </div>
              <table className="w-full border-collapse">
                <thead><tr>{["User", "Role", "Consent Date", "Policy Version", "IP Address", "Status", "Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {CONSENT_RECORDS.map(c => (
                    <tr key={c.name}>
                      <TD className="font-semibold text-white">{c.name}</TD>
                      <TD><Badge status={c.role} /></TD>
                      <TD className="text-[#6b728e]">{c.date}</TD>
                      <TD className="text-[#4f8cff] font-semibold">{c.version}</TD>
                      <TD className="font-mono text-xs text-[#6b728e]">{c.ip}</TD>
                      <TD><Badge status={c.status} /></TD>
                      <TD>
                        <Btn label="Delete Data" variant="danger" />
                        <Btn label="Correct" variant="ghost" />
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Data Subject Requests */}
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-3.5">Data Subject Request Management</div>
              <div className="grid grid-cols-3 gap-3">
                {([["Right to Access", "Request a copy of all personal data held for a specific user.", "#4f8cff", "border-t-[#4f8cff]", "Process Request"], ["Right to Correction", "Correct inaccurate or outdated personal data.", "#22c97a", "border-t-[#22c97a]", "Process Request"], ["Right to Deletion", "Permanently delete a user's personal data from the platform.", "#ff4f6a", "border-t-[#ff4f6a]", "Delete Data"]] as [string, string, string, string, string][]).map(([title, desc, color, bc, btn]) => (
                  <div key={title} className={`bg-[#13161e] rounded-xl p-4 border-t-[3px] ${bc}`}>
                    <div className="font-semibold text-white mb-1.5">{title}</div>
                    <div className="text-xs text-[#6b728e] mb-3.5 leading-relaxed">{desc}</div>
                    <input className={`${inputCls} mb-2.5`} placeholder="Enter user email..." />
                    <button className="px-3.5 py-1.5 rounded-lg border-none text-white text-xs font-semibold cursor-pointer hover:opacity-85" style={{ background: color }}>{btn}</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;