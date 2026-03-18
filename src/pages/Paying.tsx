import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "monitor" | "plans" | "invoices" | "refunds";
type PayStatus = "Paid" | "Overdue" | "Failed" | "Pending" | "Refunded";
type PlanType = "Premium" | "Standard" | "Club";

interface Transaction {
  school: string;
  type: string;
  plan: PlanType | "—";
  amount: string;
  method: string;
  date: string;
  status: PayStatus;
}

interface Invoice {
  id: string;
  school: string;
  amount: string;
  issued: string;
  due: string;
  status: PayStatus;
}

interface PricingState {
  standard: string;
  premium: string;
  club: string;
  uploadPerPost: string;
  homepageBanner: string;
  newsFeed: string;
  profilePage: string;
  sponsoredPost: string;
}

// ── Badge ──────────────────────────────────────────────────────────
const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Paid: "bg-[#0d2b1f] text-[#22c97a]",
    Overdue: "bg-[#2a2008] text-[#f5c542]",
    Failed: "bg-[#2a0f16] text-[#ff4f6a]",
    Pending: "bg-[#2a2008] text-[#f5c542]",
    Refunded: "bg-[#13161e] text-[#6b728e]",
    Premium: "bg-[#1e0a2e] text-[#c084fc]",
    Standard: "bg-[#1a2a4a] text-[#4f8cff]",
    Club: "bg-[#0d2b1f] text-[#22c97a]",
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
    <button onClick={onClick} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none mr-1.5 hover:opacity-85 transition-opacity ${cls[variant]} ${full ? "w-full mt-2" : ""}`}>
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
const selectCls = "bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none cursor-pointer";
const labelCls = "block text-xs text-[#6b728e] font-medium mb-1.5";

// ── Data ───────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  { school: "Westville Boys High", type: "Membership", plan: "Premium", amount: "R2,500", method: "EFT", date: "2025-06-01", status: "Paid" },
  { school: "Cape FC", type: "Membership", plan: "Standard", amount: "R1,800", method: "Card", date: "2025-06-05", status: "Paid" },
  { school: "Joburg Academy", type: "News Upload", plan: "—", amount: "R150", method: "Card", date: "2025-06-10", status: "Paid" },
  { school: "Bishops", type: "Membership", plan: "Premium", amount: "R2,500", method: "EFT", date: "2025-06-11", status: "Paid" },
  { school: "Pretoria Stars", type: "Membership", plan: "Premium", amount: "R2,500", method: "EFT", date: "2025-06-12", status: "Overdue" },
  { school: "Stellenbosch Uni", type: "Membership", plan: "Standard", amount: "R1,800", method: "Card", date: "2025-06-15", status: "Failed" },
  { school: "Orange River Acad.", type: "Membership", plan: "Club", amount: "R900", method: "EFT", date: "2025-06-18", status: "Paid" },
];

const INVOICES: Invoice[] = [
  { id: "INV-2025-001", school: "Westville Boys High", amount: "R2,500", issued: "2025-06-01", due: "2025-06-15", status: "Paid" },
  { id: "INV-2025-002", school: "Cape FC", amount: "R1,800", issued: "2025-06-05", due: "2025-06-20", status: "Paid" },
  { id: "INV-2025-003", school: "Pretoria Stars", amount: "R2,500", issued: "2025-06-12", due: "2025-06-26", status: "Overdue" },
  { id: "INV-2025-004", school: "Stellenbosch Uni", amount: "R1,800", issued: "2025-06-15", due: "2025-06-29", status: "Failed" },
  { id: "INV-2025-005", school: "Orange River Acad.", amount: "R900", issued: "2025-06-18", due: "2025-07-02", status: "Paid" },
];

// ── Main Component ─────────────────────────────────────────────────
const PaymentsBillingPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("monitor");
  const [pricing, setPricing] = useState<PricingState>({
    standard: "1,800", premium: "2,500", club: "900", uploadPerPost: "15",
    homepageBanner: "2,200", newsFeed: "800", profilePage: "1,500", sponsoredPost: "350",
  });

  const updatePrice = (k: keyof PricingState, v: string) =>
    setPricing(prev => ({ ...prev, [k]: v }));

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "monitor", label: "Payment Monitoring" },
    { key: "plans", label: "Subscription Plans" },
    { key: "invoices", label: "Invoices" },
    { key: "refunds", label: "Refunds" },
  ];

  const plans = [
    { name: "Standard Plan", tag: "Standard" as PlanType, price: pricing.standard, color: "#4f8cff", borderClass: "border-t-[#4f8cff]", features: ["Up to 50 news posts/yr", "Basic school profile", "Standard listing", "Email support"], key: "standard" as keyof PricingState },
    { name: "Premium Plan", tag: "Premium" as PlanType, price: pricing.premium, color: "#c084fc", borderClass: "border-t-[#c084fc]", features: ["Unlimited news posts", "Featured school profile", "Priority listing", "Priority support", "Ad revenue share (10%)"], key: "premium" as keyof PricingState },
    { name: "Club Plan", tag: "Club" as PlanType, price: pricing.club, color: "#22c97a", borderClass: "border-t-[#22c97a]", features: ["Up to 20 news posts/yr", "Club profile page", "Standard listing", "Email support"], key: "club" as keyof PricingState },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; } input::placeholder { color: #6b728e; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>Payments & Billing</h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">Monitor transactions, manage plans, invoices, and refunds</p>
        </div>
        <button className="bg-[#1a2a4a] border border-[#4f8cff] rounded-lg px-4 py-2 text-[#4f8cff] text-xs font-semibold cursor-pointer hover:opacity-85">↓ Export Report</button>
      </header>

      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {([["Collected (Jun)", "R84,200", "border-t-[#22c97a]", "text-[#22c97a]", "+6%"], ["Pending / Overdue", "R12,800", "border-t-[#f5c542]", "text-[#f5c542]", null], ["Failed", "R3,200", "border-t-[#ff4f6a]", "text-[#ff4f6a]", null], ["Refunded", "R1,000", "border-t-[#6b728e]", "text-[#6b728e]", null]] as [string, string, string, string, string | null][]).map(([l, v, bc, tc, ch]) => (
            <div key={l} className={`bg-[#181c27] border border-[#232840] rounded-xl p-[18px] border-t-[3px] ${bc}`}>
              <div className={`text-[24px] font-extrabold leading-none mb-1 ${tc}`} style={{ fontFamily: "'Sora', sans-serif" }}>{v}</div>
              <div className="text-xs text-[#6b728e]">{l}</div>
              {ch && <div className="text-[11px] text-[#22c97a] mt-2">↑ {ch} vs last month</div>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${tab === key ? "border-[#4f8cff] bg-[#1a2a4a] text-[#4f8cff]" : "border-[#232840] bg-transparent text-[#6b728e]"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── MONITORING ── */}
        {tab === "monitor" && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Revenue Bar */}
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-1">Monthly Revenue</div>
                <div className="text-xs text-[#6b728e] mb-4">Jan – Jun 2025 (ZAR)</div>
                {[["Jan", "R62,000", 62], ["Feb", "R70,000", 70], ["Mar", "R74,000", 74], ["Apr", "R68,000", 68], ["May", "R79,000", 79], ["Jun", "R84,200", 100]].map(([m, v, pct]) => (
                  <div key={m as string} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#6b728e] w-7">{m}</span>
                    <div className="flex-1 bg-[#13161e] rounded h-2">
                      <div className={`rounded h-2 ${m === "Jun" ? "bg-[#22c97a]" : "bg-[#1a2a4a]"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-bold w-16 text-right ${m === "Jun" ? "text-[#22c97a]" : "text-[#e8eaf2]"}`}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Method Split */}
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-4">Payment Method Split</div>
                {([["EFT", 62, "text-[#4f8cff]", "bg-[#4f8cff]"], ["Card", 32, "text-[#22c97a]", "bg-[#22c97a]"], ["Other", 6, "text-[#6b728e]", "bg-[#6b728e]"]] as [string, number, string, string][]).map(([l, p, tc, bc]) => (
                  <div key={l} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px]">{l}</span>
                      <span className={`text-[13px] font-bold ${tc}`}>{p}%</span>
                    </div>
                    <div className="bg-[#13161e] rounded h-2"><div className={`${bc} rounded h-2`} style={{ width: `${p}%` }} /></div>
                  </div>
                ))}
                <div className="mt-4">
                  <div className="font-semibold text-[13px] text-white mb-2.5">Quick Actions</div>
                  <Btn label="Send Overdue Reminders" />
                  <Btn label="Retry Failed Payments" variant="ghost" />
                </div>
              </div>
            </div>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="flex justify-between items-center mb-3.5">
                <div className="font-bold text-[14px] text-white">All Transactions — June 2025</div>
                <select className={`${selectCls} w-44`}><option>All Statuses</option><option>Paid</option><option>Overdue</option><option>Failed</option></select>
              </div>
              <table className="w-full border-collapse">
                <thead><tr>{["School", "Type", "Plan", "Amount", "Method", "Date", "Status"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {TRANSACTIONS.map((t, i) => (
                    <tr key={i}>
                      <TD className="font-semibold text-white">{t.school}</TD>
                      <TD>{t.type}</TD>
                      <TD>{t.plan !== "—" ? <Badge status={t.plan} /> : "—"}</TD>
                      <TD className="font-bold">{t.amount}</TD>
                      <TD>{t.method}</TD>
                      <TD className="text-[#6b728e]">{t.date}</TD>
                      <TD><Badge status={t.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PLANS ── */}
        {tab === "plans" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {plans.map(p => (
                <div key={p.name} className={`bg-[#181c27] border border-[#232840] rounded-xl p-6 border-t-[3px] ${p.borderClass}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-[15px] text-white">{p.name}</div>
                    <Badge status={p.tag} />
                  </div>
                  <div className="text-[28px] font-extrabold leading-none mb-0.5" style={{ color: p.color, fontFamily: "'Sora', sans-serif" }}>R{p.price}</div>
                  <div className="text-xs text-[#6b728e] mb-4">per annum</div>
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 mb-2 text-[13px]">
                      <svg width="14" height="14" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" strokeWidth="2.5" stroke={p.color} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {f}
                    </div>
                  ))}
                  <div className="mt-4">
                    <label className={labelCls}>Annual Fee (ZAR)</label>
                    <input className={inputCls} value={`R${p.price}`} onChange={e => updatePrice(p.key, e.target.value.replace("R", ""))} />
                    <Btn label="Update Pricing" full />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-4">Ad Rate Configuration</div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelCls}>Homepage Banner (per month)</label><input className={inputCls} value={`R${pricing.homepageBanner}`} onChange={e => updatePrice("homepageBanner", e.target.value.replace("R", ""))} /></div>
                <div><label className={labelCls}>News Feed Ad (per month)</label><input className={inputCls} value={`R${pricing.newsFeed}`} onChange={e => updatePrice("newsFeed", e.target.value.replace("R", ""))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div><label className={labelCls}>School Profile Page (per month)</label><input className={inputCls} value={`R${pricing.profilePage}`} onChange={e => updatePrice("profilePage", e.target.value.replace("R", ""))} /></div>
                <div><label className={labelCls}>Cost per News Upload</label><input className={inputCls} value={`R${pricing.uploadPerPost}`} onChange={e => updatePrice("uploadPerPost", e.target.value.replace("R", ""))} /></div>
              </div>
              <Btn label="Save All Rates" />
            </div>
          </>
        )}

        {/* ── INVOICES ── */}
        {tab === "invoices" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-[15px] text-white">Invoices</div>
              <div className="flex gap-2">
                <input className={`${inputCls} w-48`} placeholder="Search school..." />
                <button className="bg-[#4f8cff] border-none rounded-lg px-4 py-2 text-white text-xs font-semibold cursor-pointer hover:opacity-85 whitespace-nowrap">+ Generate Invoice</button>
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead><tr>{["Invoice #", "School / User", "Amount", "Issued", "Due Date", "Status", "Actions"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <TD className="text-[#4f8cff] font-bold font-mono">{inv.id}</TD>
                    <TD className="font-semibold text-white">{inv.school}</TD>
                    <TD className="font-bold">{inv.amount}</TD>
                    <TD className="text-[#6b728e]">{inv.issued}</TD>
                    <TD className={inv.status === "Overdue" || inv.status === "Failed" ? "text-[#ff4f6a]" : "text-[#6b728e]"}>{inv.due}</TD>
                    <TD><Badge status={inv.status} /></TD>
                    <TD><Btn label="View" variant="ghost" /><Btn label="Resend" variant="ghost" /></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── REFUNDS ── */}
        {tab === "refunds" && (
          <>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5 mb-5">
              <div className="font-bold text-[15px] text-white mb-4">Pending Refund Requests</div>
              <div className="py-4 border-b border-[#232840]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-[14px] mb-1">Stellenbosch Uni Club</div>
                    <div className="text-[13px] text-[#6b728e] mb-1">Membership — duplicate charge (card charged twice on 2025-06-15)</div>
                    <div className="text-xs text-[#6b728e]">Submitted by club@sun.ac.za · 2025-06-20</div>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <div className="text-[20px] font-extrabold text-[#ff4f6a]" style={{ fontFamily: "'Sora', sans-serif" }}>R1,800</div>
                    <div>
                      <Btn label="Process Refund" variant="success" />
                      <Btn label="Deny" variant="danger" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-3.5">Refund History</div>
              <table className="w-full border-collapse">
                <thead><tr>{["School", "Reason", "Amount", "Date", "Processed By"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {[["Joburg Academy", "Cancellation within 7 days", "R1,800", "2025-05-03", "Super Admin"], ["King Edward VII", "System error — double charge", "R2,500", "2025-03-14", "Super Admin"]].map(([s, r, a, d, p]) => (
                    <tr key={s as string + (d as string)}>
                      <TD className="font-semibold text-white">{s}</TD>
                      <TD>{r}</TD>
                      <TD className="font-bold text-[#ff4f6a]">{a}</TD>
                      <TD className="text-[#6b728e]">{d}</TD>
                      <TD className="text-[#6b728e]">{p}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsBillingPage;