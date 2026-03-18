import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────
type TabKey = "mass" | "push" | "history";
type ChannelType = "App Push" | "Email" | "Both";

interface NotificationRule {
  event: string;
  channel: ChannelType;
  enabled: boolean;
}

interface SentMessage {
  title: string;
  target: string;
  channel: ChannelType;
  date: string;
  recipients: number;
  openRate: string;
}

// ── Toggle Component ───────────────────────────────────────────────
const Toggle: React.FC<{ on: boolean; onToggle: () => void }> = ({ on, onToggle }) => (
  <div
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0 ${on ? "bg-[#4f8cff]" : "bg-[#232840]"}`}
  >
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
  </div>
);

// ── Channel Badge ─────────────────────────────────────────────────
const ChannelBadge: React.FC<{ channel: ChannelType }> = ({ channel }) => {
  const styles: Record<ChannelType, string> = {
    Both: "bg-[#1a2a4a] text-[#4f8cff]",
    Email: "bg-[#0d2b1f] text-[#22c97a]",
    "App Push": "bg-[#1e0a2e] text-[#c084fc]",
  };
  return <span className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${styles[channel]}`}>{channel}</span>;
};

const inputCls = "w-full bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none placeholder-[#6b728e]";
const selectCls = "bg-[#13161e] border border-[#232840] rounded-lg px-3 py-2.5 text-[13px] text-[#e8eaf2] outline-none cursor-pointer";
const labelCls = "block text-xs text-[#6b728e] font-medium mb-1.5";

const TH: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="text-left px-3.5 py-2.5 text-[11px] text-[#6b728e] border-b border-[#232840] uppercase tracking-wide whitespace-nowrap">{children}</th>
);
const TD: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <td className={`px-3.5 py-[11px] text-[13px] border-b border-[#232840] text-[#e8eaf2] ${className}`}>{children}</td>
);

// ── Data ───────────────────────────────────────────────────────────
const AUDIENCE_OPTIONS = [
  "All Schools", "Gauteng Schools", "Western Cape Schools", "KZN Schools",
  "Eastern Cape Schools", "Government Schools Only", "Independent Schools Only",
  "Sports Clubs Only", "All Advertisers", "All Users",
];

const INITIAL_RULES: NotificationRule[] = [
  { event: "New school / club signup", channel: "App Push", enabled: true },
  { event: "Payment received", channel: "Email", enabled: true },
  { event: "Payment failed / overdue", channel: "Both", enabled: true },
  { event: "News post approved", channel: "App Push", enabled: true },
  { event: "News post rejected", channel: "App Push", enabled: true },
  { event: "Ad approved / rejected", channel: "Email", enabled: true },
  { event: "Membership expiry (30 days)", channel: "Both", enabled: true },
  { event: "Policy violation flagged", channel: "Both", enabled: false },
  { event: "New advertiser registered", channel: "App Push", enabled: false },
  { event: "Weekly platform summary", channel: "Email", enabled: true },
];

const SENT_MESSAGES: SentMessage[] = [
  { title: "Platform Maintenance Notice", target: "All Schools", channel: "Email", date: "2025-06-28 09:00", recipients: 1284, openRate: "61%" },
  { title: "New Feature: Video Posts Now Available", target: "All Schools", channel: "Both", date: "2025-06-15 10:30", recipients: 1284, openRate: "74%" },
  { title: "Membership Renewal Reminder — KZN", target: "KZN", channel: "App Push", date: "2025-06-01 08:00", recipients: 312, openRate: "58%" },
  { title: "Updated Privacy Policy (v2.1)", target: "All Users", channel: "Email", date: "2025-05-15 09:00", recipients: 4821, openRate: "43%" },
  { title: "Ad Pricing Update — June 2025", target: "Advertisers", channel: "Email", date: "2025-05-01 11:00", recipients: 87, openRate: "82%" },
];

// ── Main Component ─────────────────────────────────────────────────
const NotificationsPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("mass");
  const [audience, setAudience] = useState<string[]>(["All Schools"]);
  const [channel, setChannel] = useState<ChannelType>("Both");
  const [rules, setRules] = useState<NotificationRule[]>(INITIAL_RULES);

  const toggleAudience = (a: string) =>
    setAudience(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const toggleRule = (i: number) =>
    setRules(prev => prev.map((r, idx) => idx === i ? { ...r, enabled: !r.enabled } : r));

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "mass", label: "Mass Messaging" },
    { key: "push", label: "Push Notification Rules" },
    { key: "history", label: "Message History" },
  ];

  const channels: ChannelType[] = ["App Push", "Email", "Both"];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing: border-box; } tr:hover td { background: rgba(255,255,255,0.02); } button:hover { opacity: 0.85; } input::placeholder, textarea::placeholder { color: #6b728e; }`}</style>

      {/* Header */}
      <header className="bg-[#13161e] border-b border-[#232840] px-8 py-5">
        <h1 className="text-[22px] font-extrabold text-white m-0" style={{ fontFamily: "'Sora', sans-serif" }}>Notifications & Messaging</h1>
        <p className="mt-1 text-[13px] text-[#6b728e]">Mass announcements, push notification rules, and message history</p>
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {([["Messages Sent (Jun)", "284", "border-t-[#4f8cff]", "text-[#4f8cff]"], ["Avg Open Rate", "64%", "border-t-[#22c97a]", "text-[#22c97a]"], ["Push Subscribers", "3,812", "border-t-[#f5c542]", "text-[#f5c542]"], ["Active Rules", "8", "border-t-[#c084fc]", "text-[#c084fc]"]] as [string, string, string, string][]).map(([l, v, bc, tc]) => (
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

        {/* ── MASS MESSAGING ── */}
        {tab === "mass" && (
          <div className="grid grid-cols-[1.4fr_1fr] gap-5">
            {/* Compose */}
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-6">
              <div className="font-bold text-[15px] text-white mb-5">Compose Announcement</div>

              {/* Audience */}
              <div className="mb-4">
                <label className={labelCls}>Target Audience (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCE_OPTIONS.map(a => (
                    <button key={a} onClick={() => toggleAudience(a)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${audience.includes(a) ? "border-[#4f8cff] bg-[#1a2a4a] text-[#4f8cff]" : "border-[#232840] bg-transparent text-[#6b728e]"}`}>
                      {a}
                    </button>
                  ))}
                </div>
                {audience.length > 0 && (
                  <div className="mt-2 text-xs text-[#4f8cff]">Sending to: {audience.join(", ")}</div>
                )}
              </div>

              {/* Channel */}
              <div className="mb-4">
                <label className={labelCls}>Notification Channel</label>
                <div className="flex gap-4">
                  {channels.map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer text-[13px]">
                      <div onClick={() => setChannel(c)}
                        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${channel === c ? "border-[#4f8cff] bg-[#4f8cff]" : "border-[#232840] bg-transparent"}`}>
                        {channel === c && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-3"><label className={labelCls}>Subject / Notification Title *</label><input className={inputCls} placeholder="e.g. Important: Platform Update — July 2025" /></div>
              <div className="mb-3"><label className={labelCls}>Message Body *</label><textarea className={`${inputCls} h-32 resize-none leading-relaxed`} placeholder="Write your announcement here. Keep it clear and concise..." /></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div><label className={labelCls}>Schedule Date (optional)</label><input type="date" className={inputCls} /></div>
                <div><label className={labelCls}>Schedule Time</label><input type="time" className={inputCls} /></div>
              </div>
              <div className="flex gap-2.5">
                <button className="bg-[#4f8cff] border-none rounded-lg px-5 py-2 text-white text-[13px] font-semibold cursor-pointer hover:opacity-85">Send Now</button>
                <button className="bg-[#232840] border-none rounded-lg px-5 py-2 text-[#e8eaf2] text-[13px] font-semibold cursor-pointer hover:opacity-85">Schedule</button>
                <button className="bg-transparent border border-[#232840] rounded-lg px-5 py-2 text-[#6b728e] text-[13px] font-semibold cursor-pointer hover:opacity-85">Save Draft</button>
              </div>
            </div>

            {/* Preview & Summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-3">Notification Preview</div>
                {/* Push Preview */}
                <div className="bg-[#13161e] rounded-xl p-3.5 mb-3 border border-[#232840]">
                  <div className="text-[10px] text-[#6b728e] mb-2 uppercase tracking-wider">App Push Preview</div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-9 h-9 rounded-lg bg-[#1a2a4a] flex items-center justify-center text-lg flex-shrink-0">🏫</div>
                    <div>
                      <div className="font-semibold text-[13px] text-white">SchoolHub Platform</div>
                      <div className="text-xs text-[#6b728e]">Your announcement title will appear here...</div>
                    </div>
                  </div>
                </div>
                {/* Email Preview */}
                <div className="bg-[#13161e] rounded-xl p-3.5 border border-[#232840]">
                  <div className="text-[10px] text-[#6b728e] mb-2 uppercase tracking-wider">Email Preview</div>
                  <div className="text-[11px] text-[#6b728e]">From: noreply@schoolhub.co.za</div>
                  <div className="text-[11px] text-[#6b728e]">To: {audience[0] ?? "All Schools"}</div>
                  <div className="text-xs font-semibold text-white mt-2">Subject: [Your subject here]</div>
                </div>
              </div>
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-3">Send Summary</div>
                <div className="text-[13px] text-[#6b728e] mb-1.5">Audience: <span className="text-[#e8eaf2]">{audience.length ? audience.join(", ") : "None selected"}</span></div>
                <div className="text-[13px] text-[#6b728e] mb-1.5">Channel: <span className="text-[#e8eaf2]">{channel}</span></div>
                <div className="text-[13px] text-[#6b728e]">Est. recipients: <span className="text-[#4f8cff] font-bold">{audience.includes("All Users") ? "4,821" : audience.includes("All Schools") ? "1,284" : "—"}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── PUSH RULES ── */}
        {tab === "push" && (
          <div className="grid grid-cols-[1.5fr_1fr] gap-5">
            <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
              <div className="font-bold text-[15px] text-white mb-1">Notification Trigger Rules</div>
              <div className="text-xs text-[#6b728e] mb-4">Configure which events send notifications and via which channel</div>
              {rules.map((r, i) => (
                <div key={r.event} className="flex items-center gap-3.5 py-3 border-b border-[#232840]">
                  <div className="flex-1">
                    <div className={`font-medium ${r.enabled ? "text-white" : "text-[#6b728e]"}`}>{r.event}</div>
                    <div className="text-[11px] text-[#6b728e] mt-0.5">{r.channel}</div>
                  </div>
                  <select className="bg-[#13161e] border border-[#232840] rounded-md px-2 py-1.5 text-[11px] text-[#e8eaf2] outline-none cursor-pointer">
                    <option>App Push</option><option>Email</option><option>Both</option>
                  </select>
                  <Toggle on={r.enabled} onToggle={() => toggleRule(i)} />
                </div>
              ))}
              <button className="mt-4 bg-[#4f8cff] border-none rounded-lg px-5 py-2 text-white text-[13px] font-semibold cursor-pointer hover:opacity-85">Save Rules</button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-3">Rules Summary</div>
                {[["Enabled rules", rules.filter(r => r.enabled).length.toString(), "text-[#22c97a]"], ["Disabled rules", rules.filter(r => !r.enabled).length.toString(), "text-[#6b728e]"], ["Total rules", rules.length.toString(), "text-[#e8eaf2]"]].map(([l, v, tc]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-[#232840]">
                    <span className="text-[13px] text-[#6b728e]">{l}</span>
                    <span className={`font-bold ${tc}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
                <div className="font-bold text-[14px] text-white mb-2.5">Opt-out Management</div>
                <div className="text-xs text-[#6b728e] mb-3">Schools and users who have opted out</div>
                <div className="py-2.5 border-b border-[#232840]">
                  <div className="text-[13px] font-medium">Email notifications</div>
                  <div className="text-xs text-[#6b728e]">42 schools opted out</div>
                </div>
                <div className="py-2.5">
                  <div className="text-[13px] font-medium">App push notifications</div>
                  <div className="text-xs text-[#6b728e]">127 users opted out</div>
                </div>
                <button className="mt-2 bg-[#232840] border-none rounded-lg px-3.5 py-1.5 text-[#e8eaf2] text-xs font-semibold cursor-pointer hover:opacity-85">Manage Opt-outs</button>
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div className="bg-[#181c27] border border-[#232840] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-[15px] text-white">Sent Announcements</div>
              <input className={`${inputCls} w-56`} placeholder="Search messages..." />
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>{["Title", "Target", "Channel", "Sent At", "Recipients", "Open Rate"].map(h => <TH key={h}>{h}</TH>)}</tr>
              </thead>
              <tbody>
                {SENT_MESSAGES.map(m => (
                  <tr key={m.title}>
                    <TD className="font-semibold text-white">{m.title}</TD>
                    <TD>{m.target}</TD>
                    <TD><ChannelBadge channel={m.channel} /></TD>
                    <TD className="text-xs text-[#6b728e]">{m.date}</TD>
                    <TD className="font-bold text-[#4f8cff]">{m.recipients.toLocaleString()}</TD>
                    <TD className="font-bold text-[#22c97a]">{m.openRate}</TD>
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

export default NotificationsPage;