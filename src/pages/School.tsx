import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "list" | "onboard" | "membership";
type SchoolStatus = "Active" | "Pending" | "Blocked" | "Expired";
type PlanType = "Premium" | "Standard" | "Club";

interface School {
  name: string;
  type: string;
  province: string;
  city: string;
  contact: string;
  status: SchoolStatus;
  plan: PlanType;
  start: string;
  renewal: string;
}

// ── Badge ──────────────────────────────────────────────────────────
const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Active: "bg-[#0d2b1f] text-[#22c97a]",
    Pending: "bg-[#2a2008] text-[#f5c542]",
    Blocked: "bg-[#2a0f16] text-[#ff4f6a]",
    Expired: "bg-[#13161e] text-[#6b728e]",
    Premium: "bg-[#1e0a2e] text-[#c084fc]",
    Standard: "bg-[#1a2a4a] text-[#4f8cff]",
    Club: "bg-[#0d2b1f] text-[#22c97a]",
  };
  return (
    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? "bg-[#13161e] text-[#6b728e]"}`}>
      {status}
    </span>
  );
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

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left px-3.5 py-2.5 text-[11px] text-[#6b728e] border-b border-[#232840] uppercase tracking-wide whitespace-nowrap">{children}</th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-3.5 py-[11px] text-[13px] border-b border-[#232840] text-[#e8eaf2] ${className}`}>{children}</td>
);

const inputCls = "w-full bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none placeholder-[#6b728e]";
const selectCls = "w-full bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none cursor-pointer";
const labelCls = "block text-xs text-[#6b728e] font-medium mb-1.5";

// ── Data ───────────────────────────────────────────────────────────
const SCHOOLS: School[] = [
  { name: "Westville Boys High", type: "Government School", province: "KZN", city: "Durban", contact: "admin@westville.co.za", status: "Active", plan: "Premium", start: "2025-01-01", renewal: "2026-01-01" },
  { name: "Cape FC", type: "Sports Club", province: "WC", city: "Cape Town", contact: "info@capefc.co.za", status: "Active", plan: "Standard", start: "2025-03-01", renewal: "2026-03-01" },
  { name: "Joburg Academy", type: "Independent School", province: "GP", city: "Johannesburg", contact: "head@joburgacad.co.za", status: "Pending", plan: "Standard", start: "2024-07-01", renewal: "2025-07-01" },
  { name: "Pretoria Stars", type: "Sports Club", province: "GP", city: "Pretoria", contact: "stars@pretoria.co.za", status: "Blocked", plan: "Premium", start: "2024-06-01", renewal: "2025-06-01" },
  { name: "Stellenbosch Uni Club", type: "Community Org", province: "WC", city: "Stellenbosch", contact: "club@sun.ac.za", status: "Expired", plan: "Standard", start: "2024-01-01", renewal: "2025-01-01" },
  { name: "King Edward VII", type: "Government School", province: "KZN", city: "Durban", contact: "admin@kevii.co.za", status: "Active", plan: "Premium", start: "2025-01-01", renewal: "2026-01-01" },
];

const PENDING_SIGNUPS = ["Pretoria Youth FC", "Orange River Academy", "Nelspruit Community Club", "Vaal Tech Alumni"];
const PROVINCES = ["Gauteng", "Western Cape", "KZN", "Eastern Cape", "Limpopo", "Mpumalanga", "Free State", "North West", "Northern Cape"];

// ── Main Component ─────────────────────────────────────────────────
const SchoolManagementPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("list");
  const [search, setSearch] = useState("");
  const [filterProvince, setFilterProvince] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = SCHOOLS.filter(s =>
    (filterProvince === "All" || s.province === filterProvince) &&
    (filterStatus === "All" || s.status === filterStatus) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()))
  );

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "list", label: "All Schools" },
    { key: "onboard", label: "Onboarding" },
    { key: "membership", label: "Memberships" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; } input::placeholder, textarea::placeholder { color: #6b728e; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>School / Club Management</h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">Manage school profiles, onboarding, and membership</p>
        </div>
        <button onClick={() => setTab("onboard")} className="bg-[#4f8cff] border-none rounded-lg px-4 py-2 text-white text-[13px] font-semibold cursor-pointer hover:opacity-85">
          + Add School / Club
        </button>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {([["Total Schools", "1,284", "border-t-[#4f8cff]", "text-[#4f8cff]"], ["Active", "976", "border-t-[#22c97a]", "text-[#22c97a]"], ["Pending Approval", "14", "border-t-[#f5c542]", "text-[#f5c542]"], ["Blocked", "3", "border-t-[#ff4f6a]", "text-[#ff4f6a]"]] as [string, string, string, string][]).map(([l, v, bc, tc]) => (
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

        {/* ── ALL SCHOOLS ── */}
        {tab === "list" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 stroke-[#6b728e]" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" strokeWidth="1.5" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} placeholder="Search by name or city..." />
              </div>
              <select className={`${selectCls} w-40`} value={filterProvince} onChange={e => setFilterProvince(e.target.value)}>
                {["All", "GP", "WC", "KZN", "EC", "LP"].map(p => <option key={p}>{p}</option>)}
              </select>
              <select className={`${selectCls} w-40`} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {["All", "Active", "Pending", "Blocked", "Expired"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <table className="w-full border-collapse">
              <thead><tr>{["School / Club", "Type", "Province", "City", "Contact", "Status", "Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.name}>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1a2a4a] flex items-center justify-center font-bold text-[13px] text-[#4f8cff]">{s.name[0]}</div>
                        <span className="font-semibold text-white">{s.name}</span>
                      </div>
                    </TD>
                    <TD className="text-[11px] text-[#6b728e]">{s.type}</TD>
                    <TD>{s.province}</TD>
                    <TD>{s.city}</TD>
                    <TD className="text-[#6b728e]">{s.contact}</TD>
                    <TD><Badge status={s.status} /></TD>
                    <TD>
                      <Btn label="Edit" variant="ghost" />
                      <Btn label={s.status === "Blocked" ? "Unblock" : "Block"} variant="danger" />
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-3 text-xs text-[#6b728e]">{filtered.length} of {SCHOOLS.length} schools shown</div>
          </div>
        )}

        {/* ── ONBOARDING ── */}
        {tab === "onboard" && (
          <div className="grid grid-cols-2 gap-5">
            {/* Add Form */}
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6">
              <div className="font-bold text-[15px] text-white mb-5">Add New School / Club</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelCls}>School / Club Name *</label><input className={inputCls} placeholder="e.g. Cape Town High School" /></div>
                <div><label className={labelCls}>Type *</label>
                  <select className={selectCls}><option>Government School</option><option>Independent School</option><option>Sports Club</option><option>Community Org</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelCls}>Province *</label>
                  <select className={selectCls}>{PROVINCES.map(p => <option key={p}>{p}</option>)}</select>
                </div>
                <div><label className={labelCls}>City *</label><input className={inputCls} placeholder="e.g. Cape Town" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelCls}>Contact Email *</label><input className={inputCls} placeholder="admin@school.co.za" /></div>
                <div><label className={labelCls}>Phone Number</label><input className={inputCls} placeholder="+27 XX XXX XXXX" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelCls}>Membership Plan</label>
                  <select className={selectCls}><option>Standard</option><option>Premium</option><option>Club</option></select>
                </div>
                <div><label className={labelCls}>Principal / Contact Person</label><input className={inputCls} placeholder="Full name" /></div>
              </div>
              <div className="mb-4">
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} h-20 resize-none`} placeholder="Brief description of the school or club..." />
              </div>
              <div className="flex gap-2.5">
                <Btn label="+ Add School / Club" />
                <Btn label="Cancel" variant="ghost" />
              </div>
            </div>

            {/* Pending Signups */}
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6">
              <div className="font-bold text-[15px] text-white mb-1">Pending Signups</div>
              <div className="text-xs text-[#6b728e] mb-5">Schools awaiting admin approval</div>
              {PENDING_SIGNUPS.map((name, i) => (
                <div key={name} className="py-3.5 border-b border-[#232840]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1e0a2e] flex items-center justify-center font-bold text-[14px] text-[#c084fc]">{name[0]}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-[13px]">{name}</div>
                      <div className="text-[11px] text-[#6b728e]">Submitted {i + 1} day{i > 0 ? "s" : ""} ago</div>
                    </div>
                    <Btn label="Approve" variant="success" />
                    <Btn label="Reject" variant="danger" />
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#13161e] rounded-lg text-xs text-[#6b728e]">
                💡 Approving a school will send them a welcome email and activate their account.
              </div>
            </div>
          </div>
        )}

        {/* ── MEMBERSHIP ── */}
        {tab === "membership" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-[15px] text-white">Membership Status</div>
              <div className="flex gap-2">
                <select className={`${selectCls} w-40`}><option>All Plans</option><option>Premium</option><option>Standard</option></select>
                <select className={`${selectCls} w-40`}><option>All Statuses</option><option>Active</option><option>Expired</option><option>Blocked</option></select>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead><tr>{["School / Club", "Plan", "Start Date", "Renewal Date", "Status", "Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {SCHOOLS.map(s => (
                  <tr key={s.name}>
                    <TD className="font-semibold text-white">{s.name}</TD>
                    <TD><Badge status={s.plan} /></TD>
                    <TD className="text-[#6b728e]">{s.start}</TD>
                    <TD className={s.status === "Expired" ? "text-[#ff4f6a]" : ""}>{s.renewal}</TD>
                    <TD><Badge status={s.status} /></TD>
                    <TD>
                      <Btn label="Remind" variant="ghost" />
                      {s.status === "Active" && <Btn label="Cancel" variant="danger" />}
                      {s.status === "Expired" && <Btn label="Renew" />}
                      {s.status === "Blocked" && <Btn label="Unblock" variant="success" />}
                    </TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolManagementPage;