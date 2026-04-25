import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { toast } from "sonner";

const AdminMaintenance = () => {
  const [progress, setProgress] = useState(45);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 1)), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell navSet="admin" title="System Maintenance" rightAction={
      <button className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary" aria-label="Notifications">
        <Icon name="notifications" filled size={22} />
      </button>
    }>
      <section className="px-6 pt-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>

        <div className="mt-5 rounded-[1.5rem] bg-surface-container ghost-border p-6">
          <div className="flex items-center justify-between">
            <p className="text-foreground font-bold uppercase tracking-[0.2em] text-sm">Backup In Progress...</p>
            <p className="font-serif text-primary text-3xl">{progress}%</p>
          </div>
          <div className="mt-4 h-3 rounded-full bg-surface-high overflow-hidden">
            <div className="h-full stripe-progress" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Icon name="dns" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Backup Size</p>
                <p className="font-serif text-foreground text-xl">1.25 TB</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <Icon name="schedule" filled size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Estimated Time Remaining</p>
                <p className="font-serif text-foreground text-xl">14:18 PM</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="absolute -mt-12 right-7 w-14 h-14 rounded-full bg-secondary/30 text-secondary flex items-center justify-center hover:bg-secondary/50 ghost-border"
            aria-label="Confirm"
          >
            <Icon name="check" size={26} />
          </button>
        </div>

        <p className="text-center font-serif text-foreground text-xl mt-10">
          Verify backup and notify team?
        </p>
        <div className="mx-auto mt-2 w-12 h-px bg-primary/60" />

        <div className="grid grid-cols-2 gap-3 mt-6 mb-10">
          <div className="rounded-2xl p-4 bg-surface-container ghost-border">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Target Cluster</p>
            <p className="font-serif text-foreground mt-2">ARCHIVE_NODE_07</p>
          </div>
          <div className="rounded-2xl p-4 bg-surface-container ghost-border">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Integrity Check</p>
            <p className="text-secondary mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary glow-soft" /> Verified
            </p>
          </div>
        </div>
      </section>

      {showConfirm && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[2rem] bg-surface-container ghost-border p-7 text-center shadow-elevated sheet-rise"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center glow-soft">
              <Icon name="check_circle" filled size={36} />
            </div>
            <h2 className="font-serif font-bold text-foreground text-2xl mt-4">Backup Confirmed</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              ARCHIVE_NODE_07 is verified and the team has been notified. The ledger remains intact.
            </p>
            <button
              onClick={() => { setShowConfirm(false); toast.success("Team notified"); }}
              className="mt-6 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold glow-gold hover:bg-primary-glow transition-all"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AdminMaintenance;
