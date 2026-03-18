import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "news" | "ads" | "compliance";
type PostStatus = "Pending" | "Approved" | "Rejected";
type AdStatus = "Pending" | "Approved" | "Rejected";
type ComplianceStatus = "Review" | "Compliant" | "Rejected";
type SeverityLevel = "High" | "Medium" | "Low";

interface NewsPost {
  school: string;
  title: string;
  type: string;
  date: string;
  preview: string;
  status: PostStatus;
}

interface AdSubmission {
  company: string;
  title: string;
  placement: string;
  amount: string;
  duration: string;
  status: AdStatus;
}

interface ComplianceFlag {
  school: string;
  content: string;
  issue: string;
  severity: SeverityLevel;
  date: string;
  status: ComplianceStatus;
}

// ── Badge ──────────────────────────────────────────────────────────
const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Pending: "bg-[#2a2008] text-[#f5c542]",
    Approved: "bg-[#0d2b1f] text-[#22c97a]",
    Rejected: "bg-[#2a0f16] text-[#ff4f6a]",
    Review: "bg-[#2a2008] text-[#f5c542]",
    Compliant: "bg-[#0d2b1f] text-[#22c97a]",
  };
  return <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? "bg-[#13161e] text-[#6b728e]"}`}>{status}</span>;
};

// ── Btn ────────────────────────────────────────────────────────────
const Btn: React.FC<{ label: string; variant?: "primary" | "danger" | "success" | "ghost" | "warn"; onClick?: () => void }> = ({
  label, variant = "primary", onClick,
}) => {
  const cls: Record<string, string> = {
    primary: "bg-[#4f8cff] text-white",
    danger: "bg-[#ff4f6a] text-white",
    success: "bg-[#22c97a] text-white",
    ghost: "bg-[#232840] text-[#e8eaf2]",
    warn: "bg-[#f5c542] text-[#0d0f14]",
  };
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none mr-1.5 hover:opacity-85 transition-opacity ${cls[variant]}`}>
      {label}
    </button>
  );
};

// ── Severity Badge ────────────────────────────────────────────────
const SeverityBadge: React.FC<{ level: SeverityLevel }> = ({ level }) => {
  const styles: Record<SeverityLevel, string> = {
    High: "bg-[#2a0f16] text-[#ff4f6a]",
    Medium: "bg-[#2a2008] text-[#f5c542]",
    Low: "bg-[#13161e] text-[#6b728e]",
  };
  return <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${styles[level]}`}>{level}</span>;
};

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left px-3.5 py-2.5 text-[11px] text-[#6b728e] border-b border-[#232840] uppercase tracking-wide whitespace-nowrap">{children}</th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-3.5 py-[11px] text-[13px] border-b border-[#232840] text-[#e8eaf2] ${className}`}>{children}</td>
);

// ── Data ───────────────────────────────────────────────────────────
const NEWS_POSTS: NewsPost[] = [
  { school: "Westville Boys High", title: "Sports Day 2025 Recap", type: "Event Report", date: "2025-07-01 09:15", preview: "Our annual Sports Day was held on June 28th. Over 600 learners participated across 14 sporting codes...", status: "Pending" },
  { school: "Cape FC", title: "U17 League Final Results", type: "Match Report", date: "2025-07-01 10:30", preview: "Cape FC U17s won the Western Province League Final 3-1 against Bellville United in a thrilling final...", status: "Pending" },
  { school: "Joburg Academy", title: "Academic Excellence Awards", type: "Announcement", date: "2025-06-30 14:00", preview: "Congratulations to our Grade 12 class for achieving an outstanding 98.2% pass rate in the June mock exams...", status: "Pending" },
  { school: "Bishops", title: "Annual Drama Production Photos", type: "Gallery", date: "2025-06-30 16:45", preview: "Photos from our production of 'The Crucible' are now available to view. The cast did a phenomenal job...", status: "Pending" },
  { school: "King Edward VII", title: "Cricket Tour to England", type: "Announcement", date: "2025-06-29 08:00", preview: "We are excited to announce that our 1st XI cricket team will tour England in August 2025...", status: "Approved" },
];

const ADS: AdSubmission[] = [
  { company: "Sportsmans Warehouse", title: "Sports Equipment Sale", placement: "Homepage Banner", amount: "R2,200", duration: "July 2025", status: "Pending" },
  { company: "Bounce Academy", title: "Holiday Camp Registration", placement: "News Feed", amount: "R800", duration: "Jul–Aug 2025", status: "Pending" },
  { company: "Edgars Kids", title: "Back to School Promo", placement: "School Profile Page", amount: "R1,500", duration: "Jan 2026", status: "Approved" },
  { company: "Pick n Pay", title: "School Lunch Box Deals", placement: "News Feed", amount: "R800", duration: "Aug 2025", status: "Rejected" },
];

const FLAGS: ComplianceFlag[] = [
  { school: "Cape FC", content: "Sponsor Banner", issue: "Copyright — unlicensed Nike logo", severity: "High", date: "2025-06-28", status: "Review" },
  { school: "Joburg Academy", content: "News Post", issue: "POPI — student faces visible without consent", severity: "High", date: "2025-06-27", status: "Review" },
  { school: "Pretoria Stars", content: "Ad Content", issue: "Inappropriate language in ad copy", severity: "Medium", date: "2025-06-25", status: "Rejected" },
  { school: "Orange River Acad.", content: "Profile Photo", issue: "Possible copyright — watermarked image", severity: "Low", date: "2025-06-22", status: "Compliant" },
];

// ── Main Component ─────────────────────────────────────────────────
const ContentModerationPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("news");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "news", label: "News Posts" },
    { key: "ads", label: "Advertisements" },
    { key: "compliance", label: "Compliance Checks" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; } textarea::placeholder { color: #6b728e; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>Content Moderation</h1>
          <p className="mt-1 text-[13px] text-[#6b728e]">Review and approve news posts, ads, and compliance flags</p>
        </div>
        <div className="flex gap-2.5">
          <div className="bg-[#2a2008] border border-[#f5c542] rounded-full px-3.5 py-1.5 text-xs text-[#f5c542] font-semibold">4 news pending</div>
          <div className="bg-[#2a0f16] border border-[#ff4f6a] rounded-full px-3.5 py-1.5 text-xs text-[#ff4f6a] font-semibold">2 compliance flags</div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {([["Pending News Posts", "4", "border-t-[#f5c542]", "text-[#f5c542]"], ["Pending Ad Reviews", "2", "border-t-[#c084fc]", "text-[#c084fc]"], ["Compliance Flags", "2", "border-t-[#ff4f6a]", "text-[#ff4f6a]"], ["Approved Today", "12", "border-t-[#22c97a]", "text-[#22c97a]"]] as [string, string, string, string][]).map(([l, v, bc, tc]) => (
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

        {/* ── NEWS POSTS ── */}
        {tab === "news" && (
          <div className={`grid gap-5 ${selectedPost !== null ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-4">Submitted News Posts</div>
              {NEWS_POSTS.map((n, i) => (
                <div key={n.title} onClick={() => setSelectedPost(selectedPost === i ? null : i)}
                  className={`py-3.5 border-b border-[#232840] cursor-pointer rounded transition-colors ${selectedPost === i ? "bg-[#4f8cff]/5" : ""}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <div className="font-semibold text-white text-[14px]">{n.title}</div>
                      <div className="text-xs text-[#6b728e] mt-1">
                        {n.school} · <span className="text-[#4f8cff]">{n.type}</span> · {n.date}
                      </div>
                    </div>
                    <Badge status={n.status} />
                  </div>
                  <div className="text-xs text-[#6b728e] mb-2.5">{n.preview.substring(0, 90)}...</div>
                  {n.status === "Pending" && (
                    <div onClick={e => e.stopPropagation()}>
                      <Btn label="✓ Approve" variant="success" />
                      <Btn label="✗ Reject" variant="danger" />
                      <Btn label="✎ Request Edits" variant="ghost" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preview Panel */}
            {selectedPost !== null && (
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5 sticky top-5 max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-bold text-[15px] text-white">Post Preview</div>
                  <button onClick={() => setSelectedPost(null)} className="bg-transparent border-none text-[#6b728e] text-xl cursor-pointer hover:text-white">×</button>
                </div>
                {(["School", "Title", "Type", "Submitted"] as const).map((field) => {
                  const val = field === "School" ? NEWS_POSTS[selectedPost].school : field === "Title" ? NEWS_POSTS[selectedPost].title : field === "Type" ? NEWS_POSTS[selectedPost].type : NEWS_POSTS[selectedPost].date;
                  return (
                    <div key={field} className="mb-3 p-3 bg-[#13161e] rounded-lg">
                      <div className="text-[11px] text-[#6b728e] uppercase tracking-wider mb-1">{field}</div>
                      <div className="font-semibold text-[13px]">{val}</div>
                    </div>
                  );
                })}
                <div className="mb-3 p-3 bg-[#13161e] rounded-lg">
                  <div className="text-[11px] text-[#6b728e] uppercase tracking-wider mb-1">Content Preview</div>
                  <div className="text-[13px] leading-relaxed">{NEWS_POSTS[selectedPost].preview}</div>
                </div>
                <div className="mb-4 p-3 bg-[#13161e] rounded-lg">
                  <div className="text-[11px] text-[#6b728e] uppercase tracking-wider mb-1">Moderation Notes</div>
                  <textarea className="bg-transparent border-none w-full text-[#e8eaf2] text-[13px] resize-none h-14 outline-none placeholder-[#6b728e]" placeholder="Add notes before approving or rejecting..." />
                </div>
                <Btn label="✓ Approve" variant="success" />
                <Btn label="✗ Reject" variant="danger" />
                <Btn label="✎ Request Edits" variant="ghost" />
              </div>
            )}
          </div>
        )}

        {/* ── ADS ── */}
        {tab === "ads" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="font-bold text-[15px] text-white mb-4">Advertisement Submissions</div>
            {ADS.map(a => (
              <div key={a.title} className="py-4 border-b border-[#232840]">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1e0a2e] flex items-center justify-center font-bold text-[16px] text-[#c084fc] flex-shrink-0">{a.company[0]}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <div className="font-bold text-white text-[14px]">{a.title}</div>
                        <div className="text-xs text-[#6b728e] mt-0.5">{a.company}</div>
                      </div>
                      <Badge status={a.status} />
                    </div>
                    <div className="flex gap-4 text-xs mt-2 mb-2.5">
                      <span className="text-[#6b728e]">Placement: <span className="text-[#e8eaf2]">{a.placement}</span></span>
                      <span className="text-[#6b728e]">Rate: <span className="text-[#22c97a] font-bold">{a.amount}/mo</span></span>
                      <span className="text-[#6b728e]">Duration: <span className="text-[#e8eaf2]">{a.duration}</span></span>
                    </div>
                    {a.status === "Pending" && (
                      <div>
                        <Btn label="✓ Approve Ad" variant="success" />
                        <Btn label="✗ Reject" variant="danger" />
                        <Btn label="Preview" variant="ghost" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── COMPLIANCE ── */}
        {tab === "compliance" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {([["Compliant Posts", "3,184", "border-t-[#22c97a]", "text-[#22c97a]"], ["Under Review", "42", "border-t-[#f5c542]", "text-[#f5c542]"], ["Policy Violations", "7", "border-t-[#ff4f6a]", "text-[#ff4f6a]"]] as [string, string, string, string][]).map(([l, v, bc, tc]) => (
                <div key={l} className={`bg-[#181c27] border border-[#232840] rounded-xl p-[18px] border-t-[3px] ${bc}`}>
                  <div className={`text-[26px] font-extrabold leading-none mb-1 ${tc}`} style={{ fontFamily: "'Sora', sans-serif" }}>{v}</div>
                  <div className="text-xs text-[#6b728e]">{l}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5 mb-5">
              <div className="font-bold text-[15px] text-white mb-4">Compliance Flags</div>
              {FLAGS.map(f => (
                <div key={f.content + f.school} className="py-3.5 border-b border-[#232840]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-[14px]">{f.school}</span>
                        <SeverityBadge level={f.severity} />
                      </div>
                      <div className="text-[13px] text-[#6b728e]">{f.content} · <span className="text-[#f5c542]">{f.issue}</span></div>
                      <div className="text-[11px] text-[#6b728e] mt-1">{f.date}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge status={f.status} />
                      {f.status === "Review" && (
                        <div>
                          <Btn label="Mark Compliant" variant="success" />
                          <Btn label="Remove Content" variant="danger" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-3.5">Compliance Checklist Reference</div>
              {([["POPI Act (Act 4 of 2013)", "No personal information of minors without guardian consent. No personal data shared without POPI consent.", "#4f8cff"], ["Copyright", "All images, logos, and media must be licensed or owned by the school.", "#22c97a"], ["Acceptable Content Policy", "No hate speech, offensive language, discriminatory content, or graphic imagery.", "#f5c542"], ["Advertising Standards", "Ads must be truthful, not misleading, and comply with ASA guidelines.", "#c084fc"]] as [string, string, string][]).map(([title, desc, color]) => (
                <div key={title} className="py-3 border-b border-[#232840] flex gap-3">
                  <div className="w-1 rounded flex-shrink-0" style={{ background: color }} />
                  <div>
                    <div className="font-semibold text-white mb-1">{title}</div>
                    <div className="text-xs text-[#6b728e]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentModerationPage;