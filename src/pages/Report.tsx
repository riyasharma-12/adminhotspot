import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "schools" | "payments" | "engagement";
type BadgeStatus = "Paid" | "Overdue" | "Failed" | "Active";

interface StatCardProps {
  label: string;
  value: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
  change?: number;
  sub?: string;
}

interface PaymentRow {
  school: string;
  type: string;
  amount: string;
  method: string;
  date: string;
  status: BadgeStatus;
}

interface ProvinceRow {
  province: string;
  jan: number; feb: number; mar: number;
  apr: number; may: number; jun: number;
  total: number;
}

interface EngagementRow {
  rank: number;
  school: string;
  province: string;
  type: string;
  postsMonth: number;
  totalPosts: number;
  compliance: string;
}

// ── Badge ──────────────────────────────────────────────────────────
const Badge: React.FC<{ status: BadgeStatus }> = ({ status }) => {
  const styles: Record<BadgeStatus, string> = {
    Paid: "bg-[#0d2b1f] text-[#22c97a]",
    Overdue: "bg-[#2a2008] text-[#f5c542]",
    Failed: "bg-[#2a0f16] text-[#ff4f6a]",
    Active: "bg-[#0d2b1f] text-[#22c97a]",
  };
  return (
    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

// ── StatCard ───────────────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({ label, value, colorClass, borderClass, textClass, change, sub }) => (
  <div className={`bg-[#181c27] border border-[#232840] rounded-xl p-[18px] border-t-[3px] ${borderClass}`}>
    <div className={`text-[26px] font-extrabold leading-none mb-1 ${textClass}`}
      style={{ fontFamily: "'Sora', sans-serif" }}>{value}</div>
    <div className="text-xs text-[#6b728e]">{label}</div>
    {sub && <div className="text-[11px] text-[#6b728e] mt-0.5">{sub}</div>}
    {change !== undefined && (
      <div className={`text-[11px] mt-2 ${change >= 0 ? "text-[#22c97a]" : "text-[#ff4f6a]"}`}>
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs last month
      </div>
    )}
  </div>
);

// ── Bar Chart ──────────────────────────────────────────────────────
const BarChart: React.FC<{ data: number[]; labels: string[]; color: string }> = ({ data, labels, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-[100px]">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-300"
            style={{ height: (v / max) * 80, background: i === data.length - 1 ? color : color + "66" }}
          />
          <span className="text-[9px] text-[#6b728e]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left px-3.5 py-2.5 text-[11px] text-[#6b728e] border-b border-[#232840] uppercase tracking-wide whitespace-nowrap">
    {children}
  </th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-3.5 py-[11px] text-[13px] border-b border-[#232840] text-[#e8eaf2] ${className}`}>
    {children}
  </td>
);

// ── Main Component ─────────────────────────────────────────────────
const ReportsPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("schools");

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const provinceRows: ProvinceRow[] = [
    { province: "Gauteng", jan: 8, feb: 6, mar: 9, apr: 7, may: 10, jun: 8, total: 48 },
    { province: "Western Cape", jan: 5, feb: 4, mar: 6, apr: 5, may: 7, jun: 6, total: 33 },
    { province: "KZN", jan: 3, feb: 4, mar: 3, apr: 4, may: 5, jun: 4, total: 23 },
    { province: "Eastern Cape", jan: 2, feb: 1, mar: 3, apr: 2, may: 3, jun: 2, total: 13 },
    { province: "Free State", jan: 2, feb: 2, mar: 3, apr: 2, may: 4, jun: 2, total: 15 },
    { province: "Limpopo", jan: 1, feb: 2, mar: 2, apr: 2, may: 2, jun: 3, total: 12 },
  ];

  const paymentRows: PaymentRow[] = [
    { school: "Westville Boys High", type: "Membership", amount: "R2,500", method: "EFT", date: "2025-06-01", status: "Paid" },
    { school: "Cape FC", type: "Membership", amount: "R2,500", method: "Card", date: "2025-06-05", status: "Paid" },
    { school: "Joburg Academy", type: "News Upload", amount: "R150", method: "Card", date: "2025-06-10", status: "Paid" },
    { school: "Bishops", type: "Membership", amount: "R2,500", method: "EFT", date: "2025-06-11", status: "Paid" },
    { school: "Pretoria Stars", type: "Membership", amount: "R2,500", method: "EFT", date: "2025-06-12", status: "Overdue" },
    { school: "Stellenbosch Uni", type: "Membership", amount: "R2,500", method: "Card", date: "2025-06-15", status: "Failed" },
  ];

  const engagementRows: EngagementRow[] = [
    { rank: 1, school: "Westville Boys High", province: "KZN", type: "Government", postsMonth: 42, totalPosts: 312, compliance: "100%" },
    { rank: 2, school: "SACS Cape Town", province: "WC", type: "Independent", postsMonth: 38, totalPosts: 287, compliance: "100%" },
    { rank: 3, school: "King Edward VII", province: "KZN", type: "Government", postsMonth: 31, totalPosts: 244, compliance: "99%" },
    { rank: 4, school: "Bishops", province: "WC", type: "Independent", postsMonth: 28, totalPosts: 198, compliance: "100%" },
    { rank: 5, school: "St John's College", province: "GP", type: "Independent", postsMonth: 24, totalPosts: 176, compliance: "98%" },
  ];

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "schools", label: "Schools Joined" },
    { key: "payments", label: "Payment Report" },
    // { key: "engagement", label: "Engagement" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>Reports</h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">Analytics & reporting for schools, payments, and engagement</p>
        </div>
        <button className="bg-[#1a2a4a] border border-[#4f8cff] rounded-lg px-4 py-2 text-[#4f8cff] text-xs font-semibold cursor-pointer">
          ↓ Export CSV
        </button>
      </header>

      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${tab === key ? "border-[#4f8cff] bg-[#1a2a4a] text-[#4f8cff]" : "border-[#232840] bg-transparent text-[#6b728e]"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── SCHOOLS TAB ── */}
        {tab === "schools" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Schools (all time)" value="1,284" colorClass="" borderClass="border-t-[#4f8cff]" textClass="text-[#4f8cff]" change={8} />
              <StatCard label="Joined This Month" value="42" colorClass="" borderClass="border-t-[#22c97a]" textClass="text-[#22c97a]" change={3} />
              <StatCard label="Gauteng (YTD)" value="318" colorClass="" borderClass="border-t-[#f5c542]" textClass="text-[#f5c542]" />
              <StatCard label="Western Cape (YTD)" value="247" colorClass="" borderClass="border-t-[#c084fc]" textClass="text-[#c084fc]" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-1">Schools Joined by Month</div>
                <div className="text-xs text-[#6b728e] mb-4">Jan – Jun 2025</div>
                <BarChart data={[28, 34, 42, 38, 56, 42]} labels={MONTHS} color="#4f8cff" />
              </div>
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-4">Breakdown by Province</div>
                {([["Gauteng", 318, "text-[#4f8cff]", "bg-[#4f8cff]"], ["Western Cape", 247, "text-[#22c97a]", "bg-[#22c97a]"], ["KZN", 198, "text-[#f5c542]", "bg-[#f5c542]"], ["Eastern Cape", 134, "text-[#c084fc]", "bg-[#c084fc]"], ["Other", 387, "text-[#6b728e]", "bg-[#6b728e]"]] as [string, number, string, string][]).map(([p, v, tc, bc]) => (
                  <div key={p} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">{p}</span>
                      <span className={`text-xs font-bold ${tc}`}>{v}</span>
                    </div>
                    <div className="bg-[#13161e] rounded h-1.5">
                      <div className={`${bc} rounded h-1.5`} style={{ width: `${(v / 1284) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[14px] text-white mb-3.5">Schools Joined by Province — Monthly Table</div>
              <table className="w-full border-collapse">
                <thead><tr>{["Province", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Total"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {provinceRows.map(r => (
                    <tr key={r.province}>
                      <TD className="font-semibold text-white">{r.province}</TD>
                      {[r.jan, r.feb, r.mar, r.apr, r.may, r.jun].map((v, i) => <TD key={i}>{v}</TD>)}
                      <TD className="font-bold text-[#4f8cff]">{r.total}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PAYMENTS TAB ── */}
        {tab === "payments" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Collected (Jun)" value="R84,200" colorClass="" borderClass="border-t-[#22c97a]" textClass="text-[#22c97a]" change={6} />
              <StatCard label="Membership Revenue" value="R68,000" colorClass="" borderClass="border-t-[#4f8cff]" textClass="text-[#4f8cff]" />
              <StatCard label="Pending / Overdue" value="R12,800" colorClass="" borderClass="border-t-[#f5c542]" textClass="text-[#f5c542]" />
              <StatCard label="Failed Transactions" value="R3,200" colorClass="" borderClass="border-t-[#ff4f6a]" textClass="text-[#ff4f6a]" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-1">Monthly Revenue (ZAR)</div>
                <div className="text-xs text-[#6b728e] mb-4">Jan – Jun 2025</div>
                <BarChart data={[62000, 70000, 74000, 68000, 79000, 84200]} labels={MONTHS} color="#22c97a" />
              </div>
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-4">Revenue by Type (Jun)</div>
                {([["Membership Fees", "R68,000", 81, "text-[#4f8cff]", "bg-[#4f8cff]"], ["Ad Revenue", "R12,400", 15, "text-[#c084fc]", "bg-[#c084fc]"], ["News Upload Fees", "R3,800", 4, "text-[#f5c542]", "bg-[#f5c542]"]] as [string, string, number, string, string][]).map(([l, v, p, tc, bc]) => (
                  <div key={l} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px]">{l}</span>
                      <span className={`text-[13px] font-bold ${tc}`}>{v}</span>
                    </div>
                    <div className="bg-[#13161e] rounded h-2">
                      <div className={`${bc} rounded h-2`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[14px] text-white mb-3.5">Payment Transactions — June 2025</div>
              <table className="w-full border-collapse">
                <thead><tr>{["School", "Type", "Amount", "Method", "Date", "Status"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {paymentRows.map((r, i) => (
                    <tr key={i}>
                      <TD className="font-semibold text-white">{r.school}</TD>
                      <TD>{r.type}</TD>
                      <TD className="font-bold">{r.amount}</TD>
                      <TD>{r.method}</TD>
                      <TD className="text-[#6b728e]">{r.date}</TD>
                      <TD><Badge status={r.status} /></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ENGAGEMENT TAB ── */}
        {/* {tab === "engagement" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard label="Total News Posts" value="3,412" colorClass="" borderClass="border-t-[#4f8cff]" textClass="text-[#4f8cff]" change={12} />
              <StatCard label="Avg Posts / School / Month" value="2.7" colorClass="" borderClass="border-t-[#22c97a]" textClass="text-[#22c97a]" />
              <StatCard label="Most Active Province" value="Gauteng" colorClass="" borderClass="border-t-[#f5c542]" textClass="text-[#f5c542]" sub="1,022 posts" />
              <StatCard label="Compliance Rate" value="98.2%" colorClass="" borderClass="border-t-[#c084fc]" textClass="text-[#c084fc]" change={1} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-4">Posts by School Type</div>
                {([["Government School", 70, "text-[#4f8cff]", "bg-[#4f8cff]"], ["Independent School", 90, "text-[#22c97a]", "bg-[#22c97a]"], ["Sports Club", 55, "text-[#f5c542]", "bg-[#f5c542]"], ["Community Org", 35, "text-[#c084fc]", "bg-[#c084fc]"]] as [string, number, string, string][]).map(([l, p, tc, bc]) => (
                  <div key={l} className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px]">{l}</span>
                      <span className={`text-[13px] font-bold ${tc}`}>{p}%</span>
                    </div>
                    <div className="bg-[#13161e] rounded h-2">
                      <div className={`${bc} rounded h-2`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-1">News Posts by Month</div>
                <div className="text-xs text-[#6b728e] mb-4">Jan – Jun 2025</div>
                <BarChart data={[420, 510, 490, 580, 560, 620]} labels={MONTHS} color="#f5c542" />
              </div>
            </div>

            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[14px] text-white mb-3.5">Top Engaging Schools</div>
              <table className="w-full border-collapse">
                <thead><tr>{["#", "School", "Province", "Type", "Posts/Month", "Total Posts", "Compliance"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
                <tbody>
                  {engagementRows.map(r => (
                    <tr key={r.rank}>
                      <TD className="text-[#4f8cff] font-bold">{r.rank}</TD>
                      <TD className="font-semibold text-white">{r.school}</TD>
                      <TD>{r.province}</TD>
                      <TD>{r.type}</TD>
                      <TD className="font-bold text-[#4f8cff]">{r.postsMonth}</TD>
                      <TD>{r.totalPosts}</TD>
                      <TD className="font-semibold text-[#22c97a]">{r.compliance}</TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
};

export default ReportsPage;