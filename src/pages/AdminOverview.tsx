import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

const AdminOverview = () => {
  return (
    <AppShell navSet="admin" title="THAKIRA" rightAction={
      <Link to="/admin/maintenance" className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary" aria-label="Settings">
        <Icon name="settings" size={22} />
      </Link>
    }>
      <section className="px-6 pt-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
        <h1 className="font-serif font-bold text-primary text-[2.5rem] leading-[1.05] text-shadow-gold">
          System<br />Maintenance
        </h1>

        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 border border-secondary/40">
          <span className="w-2 h-2 rounded-full bg-secondary glow-soft" />
          <span className="text-secondary text-xs font-bold uppercase tracking-[0.25em]">Systems Nominal</span>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-surface-container ghost-border p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Uptime %</p>
            <Icon name="bolt" filled className="text-secondary" size={20} />
          </div>
          <p className="font-serif text-primary text-5xl mt-2">99.98%</p>
          <div className="mt-3 h-1.5 rounded-full bg-surface-high overflow-hidden">
            <div className="h-full bg-secondary" style={{ width: "99%" }} />
          </div>
        </div>

        <div className="mt-4 rounded-[1.5rem] bg-surface-container ghost-border p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Last Backup</p>
            <Icon name="schedule" filled className="text-primary" size={20} />
          </div>
          <p className="font-serif text-primary text-3xl mt-2">14:02 PM</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Oct 26, 2026</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary/70">Archival Sync</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.5rem] bg-surface-container ghost-border p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Active Users</p>
            <Icon name="person" filled className="text-primary" size={20} />
          </div>
          <p className="font-serif text-primary text-4xl mt-2">
            1,248 <span className="text-secondary text-base align-middle">+12%</span>
          </p>
        </div>

        <Link to="/admin/maintenance" className="block mt-6 mb-8 rounded-2xl bg-primary text-primary-foreground py-4 text-center font-serif font-bold glow-gold hover:bg-primary-glow transition-colors">
          Open Maintenance Console →
        </Link>
      </section>
    </AppShell>
  );
};

export default AdminOverview;
