import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

const logs = [
  { time: "14:23 PM", sev: "Critical", msg: "Database query timeout in 'JAFFA_Groves' table." },
  { time: "14:18 PM", sev: "High", msg: "API connection error with Oral_History module." },
  { time: "14:15 PM", sev: "Medium", msg: "User profile update failed for 'Layla_A.'" },
  { time: "14:12 PM", sev: "Low", msg: "Log file compression initiated." },
];

const sevStyles: Record<string, string> = {
  Critical: "bg-crimson text-destructive-foreground glow-crimson",
  High: "bg-primary text-primary-foreground",
  Medium: "bg-primary/30 text-primary",
  Low: "bg-surface-high text-muted-foreground",
};

const AdminLogs = () => {
  return (
    <AppShell navSet="admin" title="System Maintenance">
      <section className="px-6 pt-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl p-4 bg-surface-container ghost-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary glow-soft" /> Uptime
            </p>
            <p className="font-serif text-primary text-2xl mt-2">99.98%</p>
          </div>
          <div className="rounded-2xl p-4 bg-surface-container ghost-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Backup</p>
            <p className="font-serif text-foreground text-xl mt-2">14:02 PM</p>
            <p className="text-[10px] text-muted-foreground mt-1">Oct 26, 2026</p>
          </div>
          <div className="rounded-2xl p-4 bg-surface-container ghost-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active Users</p>
            <p className="font-serif text-primary text-2xl mt-2">1,248</p>
          </div>
        </div>

        <h2 className="font-serif font-bold text-foreground text-3xl mt-7">Error Archives</h2>
        <div className="w-12 h-px bg-primary/60 mt-1" />

        <div className="mt-4 rounded-[1.5rem] bg-surface-container ghost-border overflow-hidden">
          <div className="grid grid-cols-[80px_90px_1fr] px-5 py-3 bg-surface-high text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Time</span><span>Severity</span><span>Message</span>
          </div>
          {logs.map((l, i) => (
            <div key={i} className="ledger-row grid grid-cols-[80px_90px_1fr] gap-2 px-5 py-4 items-center">
              <span className="text-xs text-muted-foreground">{l.time}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 w-fit ${sevStyles[l.sev]}`}>
                {l.sev}
              </span>
              <span className="text-sm text-foreground leading-snug">{l.msg}</span>
            </div>
          ))}
        </div>

        <Link
          to="/daleel"
          className="mt-6 mb-10 flex items-center gap-3 px-5 py-4 rounded-2xl bg-surface-container ghost-border hover:border-primary/40"
        >
          <Icon name="auto_awesome" filled className="text-primary" size={22} />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Ask Daleel</p>
            <p className="font-serif text-foreground italic">"The past is a living ledger."</p>
          </div>
          <Icon name="chevron_right" className="text-muted-foreground" />
        </Link>
      </section>
    </AppShell>
  );
};

export default AdminLogs;
