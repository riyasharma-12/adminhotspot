// export default function Dashboard() {
//   return (
//     <div className="grid grid-cols-4 gap-4">

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-gray-500">Schools</h3>
//         <p className="text-2xl font-bold">120</p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-gray-500">News Posts</h3>
//         <p className="text-2xl font-bold">540</p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-gray-500">Active Memberships</h3>
//         <p className="text-2xl font-bold">80</p>
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-gray-500">Ad Revenue</h3>
//         <p className="text-2xl font-bold">$12,000</p>
//       </div>

//     </div>
//   );
// }

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type IconName = "school" | "check" | "content" | "dollar" | "alert" | "eye" | "bell" | "users";
type BadgeStatus = "Active" | "Pending" | "Approved" | "Failed" | "Blocked";

interface StatCardProps {
  label: string;
  value: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
  iconName: IconName;
  change?: number;
}

interface ActivityRow {
  name: string;
  event: string;
  province: string;
  date: string;
  status: BadgeStatus;
}

interface TopSchool {
  name: string;
  province: string;
  posts: number;
  colorClass: string;
  avatarClass: string;
}

interface PendingAction {
  message: string;
  iconName: IconName;
  iconColorClass: string;
}

interface SummaryItem {
  label: string;
  value: string;
  colorClass: string;
}

// ── Icon Component ─────────────────────────────────────────────────
const Icon: React.FC<{ name: IconName; size?: number; className?: string }> = ({
  name,
  size = 16,
  className = "stroke-current",
}) => {
  const paths: Record<IconName, React.ReactNode> = {
    school: (
      <path
        d="M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    check: (
      <polyline
        points="20 6 9 17 4 12"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    content: (
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    dollar: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    alert: (
      <>
        <path
          d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" strokeWidth="1.5" fill="none" />
      </>
    ),
    bell: (
      <path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    users: (
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ display: "block" }}
    >
      {paths[name]}
    </svg>
  );
};

// ── Badge Component ────────────────────────────────────────────────
const Badge: React.FC<{ status: BadgeStatus }> = ({ status }) => {
  const styles: Record<BadgeStatus, string> = {
    Active: "bg-[#0d2b1f] text-[#22c97a]",
    Pending: "bg-[#2a2008] text-[#f5c542]",
    Approved: "bg-[#0d2b1f] text-[#22c97a]",
    Failed: "bg-[#2a0f16] text-[#ff4f6a]",
    Blocked: "bg-[#2a0f16] text-[#ff4f6a]",
  };
  return (
    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

// ── StatCard Component ─────────────────────────────────────────────
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  colorClass,
  borderClass,
  textClass,
  iconName,
  change,
}) => (
  <div className={`bg-[#181c27] border border-[#232840] rounded-xl p-[18px] border-t-[3px] ${borderClass}`}>
    <div className="flex justify-between items-start">
      <div>
        <div className={`text-[26px] font-extrabold leading-none mb-1 ${textClass}`}
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {value}
        </div>
        <div className="text-xs text-[#6b728e]">{label}</div>
      </div>
      <div className="bg-[#13161e] rounded-lg p-2">
        <Icon name={iconName} size={18} className={colorClass} />
      </div>
    </div>
    {change !== undefined && (
      <div className={`text-[11px] mt-2 ${change >= 0 ? "text-[#22c97a]" : "text-[#ff4f6a]"}`}>
        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs last month
      </div>
    )}
  </div>
);

// ── Main Dashboard Page ────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const MONTHS: string[] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const BAR_DATA: number[] = [40, 65, 50, 80, 70, 95, 60, 110, 85, 100, 120, 98];
  const MAX_BAR: number = Math.max(...BAR_DATA);
  const currentMonth: number = new Date().getMonth();

  const today: string = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statCards: StatCardProps[] = [
    { label: "Total Schools / Clubs", value: "1,284", colorClass: "stroke-[#4f8cff]", borderClass: "border-t-[#4f8cff]", textClass: "text-[#4f8cff]", iconName: "school", change: 8 },
    { label: "Active Memberships", value: "976", colorClass: "stroke-[#22c97a]", borderClass: "border-t-[#22c97a]", textClass: "text-[#22c97a]", iconName: "check", change: 5 },
    { label: "News Posts (this month)", value: "3,412", colorClass: "stroke-[#f5c542]", borderClass: "border-t-[#f5c542]", textClass: "text-[#f5c542]", iconName: "content", change: 12 },
    { label: "Ad Revenue (ZAR)", value: "R84,200", colorClass: "stroke-[#c084fc]", borderClass: "border-t-[#c084fc]", textClass: "text-[#c084fc]", iconName: "dollar", change: -2 },
  ];

  const activityRows: ActivityRow[] = [
    { name: "Durban High School", event: "Membership Renewed", province: "KZN", date: "2025-07-01", status: "Active" },
    { name: "Cape FC", event: "News Post Submitted", province: "WC", date: "2025-07-01", status: "Pending" },
    { name: "Joburg Academy", event: "Ad Approved", province: "GP", date: "2025-06-30", status: "Approved" },
    { name: "Pretoria Stars", event: "New Signup", province: "GP", date: "2025-06-29", status: "Pending" },
    { name: "Stellenbosch Uni Club", event: "Payment Failed", province: "WC", date: "2025-06-28", status: "Failed" },
    { name: "Westville Boys High", event: "News Post Published", province: "KZN", date: "2025-06-28", status: "Active" },
  ];

  const pendingActions: PendingAction[] = [
    { message: "7 news posts awaiting moderation", iconName: "alert", iconColorClass: "stroke-[#f5c542]" },
    { message: "3 school signups to approve", iconName: "school", iconColorClass: "stroke-[#4f8cff]" },
    { message: "2 ad submissions to review", iconName: "eye", iconColorClass: "stroke-[#c084fc]" },
    { message: "1 refund request pending", iconName: "dollar", iconColorClass: "stroke-[#ff4f6a]" },
  ];

  const topSchools: TopSchool[] = [
    { name: "Westville Boys High", province: "KZN", posts: 142, colorClass: "text-[#4f8cff]", avatarClass: "bg-[#4f8cff]/20 text-[#4f8cff]" },
    { name: "SACS Cape Town", province: "WC", posts: 118, colorClass: "text-[#22c97a]", avatarClass: "bg-[#22c97a]/20 text-[#22c97a]" },
    { name: "King Edward VII", province: "KZN", posts: 97, colorClass: "text-[#f5c542]", avatarClass: "bg-[#f5c542]/20 text-[#f5c542]" },
    { name: "Bishops", province: "WC", posts: 84, colorClass: "text-[#c084fc]", avatarClass: "bg-[#c084fc]/20 text-[#c084fc]" },
  ];

  const summaryItems: SummaryItem[] = [
    { label: "Total Users", value: "4,821", colorClass: "text-[#4f8cff]" },
    { label: "School Admins", value: "1,284", colorClass: "text-[#22c97a]" },
    { label: "Advertisers", value: "87", colorClass: "text-[#c084fc]" },
    { label: "Content Moderated", value: "3,384", colorClass: "text-[#f5c542]" },
    { label: "POPI Consents Recorded", value: "4,810", colorClass: "text-[#22c97a]" },
    { label: "Avg Posts / School / Month", value: "2.7", colorClass: "text-[#4f8cff]" },
  ];

  const revenueBreakdown: Array<[string, number, string, string]> = [
    ["Membership Fees", 55, "text-[#4f8cff]", "bg-[#4f8cff]"],
    ["Ad Revenue", 30, "text-[#c084fc]", "bg-[#c084fc]"],
    ["News Upload Fees", 15, "text-[#f5c542]", "bg-[#f5c542]"],
  ];

  return (
    <div
      className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #232840; border-radius: 4px; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; }`}</style>

      {/* ── Header ── */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1
            className="text-[22px] font-extrabold text-white m-0"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">
            Platform overview — {today}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="bg-[#2a0f16] border border-[#ff4f6a] rounded-full px-3.5 py-1.5 text-xs text-[#ff4f6a] font-semibold">
            7 pending actions
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#1a2a4a] flex items-center justify-center cursor-pointer">
            <Icon name="bell" size={16} className="stroke-[#4f8cff]" />
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Bar Chart */}
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="font-bold text-[14px] text-white mb-1">
              Schools Joined — By Month
            </div>
            <div className="text-xs text-[#6b728e] mb-4">2025 full year</div>
            <div className="flex items-end gap-1.5 h-[100px]">
              {BAR_DATA.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all duration-300"
                    style={{
                      height: (h / MAX_BAR) * 80,
                      background: i === currentMonth ? "#4f8cff" : "#1a2a4a",
                    }}
                  />
                  <span className="text-[9px] text-[#6b728e]">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="font-bold text-[14px] text-white mb-4">
              Revenue Breakdown
            </div>
            {revenueBreakdown.map(([label, pct, textCls, bgCls]) => (
              <div key={label} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px]">{label}</span>
                  <span className={`text-[13px] font-bold ${textCls}`}>{pct}%</span>
                </div>
                <div className="bg-[#13161e] rounded h-2">
                  <div
                    className={`${bgCls} rounded h-2`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-5 p-3 bg-[#13161e] rounded-lg flex justify-between items-center">
              <span className="text-xs text-[#6b728e]">Total Revenue (Jun)</span>
              <span
                className="text-[14px] font-extrabold text-[#22c97a]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                R84,200
              </span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default DashboardPage;