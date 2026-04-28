import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";

interface Submission {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-primary/15 text-primary",
  approved: "bg-secondary/15 text-secondary",
  rejected: "bg-crimson/15 text-crimson",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  approved: "Verified",
  rejected: "Rejected",
};

const Archive = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      const { data } = await supabase
        .from("submissions")
        .select("id,title,status,created_at")
        .eq("user_id", session.userId)
        .order("created_at", { ascending: false });
      setItems((data ?? []) as Submission[]);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel("archive-submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session?.userId]);

  const counts = {
    submitted: items.length,
    verified: items.filter((i) => i.status === "approved").length,
    pending: items.filter((i) => i.status === "pending").length,
  };

  return (
    <AppShell>
      <section className="px-6 pt-2 pb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Personal Vault</p>
        <h1 className="font-serif font-bold text-foreground text-[2.5rem] leading-[1.05]">My Archive</h1>
        <p className="text-muted-foreground text-sm mt-3">Every thread you've added to the living ledger.</p>
      </section>

      <section className="px-6 grid grid-cols-3 gap-3 mb-6">
        {[
          { l: "Submitted", v: counts.submitted },
          { l: "Verified", v: counts.verified },
          { l: "Pending", v: counts.pending },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl p-4 bg-surface-container ghost-border text-center">
            <p className="font-serif text-3xl text-primary">{s.v}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl text-foreground">Ledger</h2>
          <button className="text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-1">
            <Icon name="filter_list" size={16} /> Filter
          </button>
        </div>
        <div className="rounded-[1.5rem] bg-surface-container ghost-border overflow-hidden">
          {loading && (
            <p className="text-center text-sm text-muted-foreground py-10">Loading…</p>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center py-10 px-6">
              <Icon name="inbox" size={36} className="text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No memories yet. Begin your archive below.</p>
            </div>
          )}
          {items.map((it) => (
            <Link
              key={it.id}
              to="/submissions"
              className="ledger-row flex items-center gap-4 px-5 py-4 hover:bg-surface-high/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-primary">
                <Icon name="inventory_2" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-foreground truncate">{it.title}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  ID #{it.id.slice(0, 8).toUpperCase()} • {new Date(it.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 ${statusStyles[it.status]}`}>
                {statusLabel[it.status]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Link
        to="/contribute"
        className="fixed bottom-28 left-1/2 -translate-x-1/2 max-w-[420px] w-[calc(100%-3rem)] mx-auto"
      >
        <div className="ml-auto w-fit flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground glow-gold font-serif font-semibold">
          <Icon name="add" size={20} /> New Memory
        </div>
      </Link>
    </AppShell>
  );
};

export default Archive;
