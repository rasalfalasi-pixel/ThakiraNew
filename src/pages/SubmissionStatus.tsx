import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";

interface Submission {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string | null;
  created_at: string;
}

const statusBadge: Record<Submission["status"], { label: string; cls: string; icon: string }> = {
  pending: { label: "Pending Review", cls: "bg-primary text-primary-foreground", icon: "more_horiz" },
  approved: { label: "Approved", cls: "bg-secondary text-secondary-foreground", icon: "check_circle" },
  rejected: { label: "Rejected", cls: "bg-crimson text-white", icon: "cancel" },
};

const SubmissionStatus = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!session) return;
    const { data } = await supabase
      .from("submissions")
      .select("id,title,description,category,status,reviewer_notes,created_at")
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("my-submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.userId]);

  const cancel = async (id: string) => {
    const { error } = await supabase.from("submissions").update({ status: "rejected", reviewer_notes: "Withdrawn by author" }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Submission withdrawn");
  };

  return (
    <AppShell
      customHeader={
        <header className="relative z-30 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon name="account_balance" filled className="text-primary" size={22} />
            <h1 className="font-serif font-bold text-primary tracking-wider">
              Thakira <span className="text-foreground/70 font-normal">/ Heritage Preserved</span>
            </h1>
          </div>
          <button onClick={load} className="w-9 h-9 rounded-full bg-surface-high flex items-center justify-center text-foreground" aria-label="Refresh">
            <Icon name="refresh" size={18} />
          </button>
        </header>
      }
    >
      <section className="px-6 pt-2">
        <h1 className="font-serif font-bold text-primary text-[2.75rem] text-center leading-tight">
          Submission<br />Status
        </h1>
        <div className="mx-auto mt-3 h-px w-16 bg-primary/60" />

        {loading && <p className="text-center text-sm text-muted-foreground mt-10">Loading…</p>}

        {!loading && items.length === 0 && (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            <Icon name="inbox" size={36} className="text-primary mx-auto mb-3" />
            You haven't submitted any memories yet.
          </div>
        )}

        <div className="space-y-5 mt-8 mb-10">
          {items.map((s) => {
            const b = statusBadge[s.status];
            return (
              <article key={s.id} className="rounded-[1.75rem] overflow-hidden bg-surface-container ghost-border shadow-elevated">
                <div className="relative h-28 bg-surface-high overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-high via-surface to-surface-low blur-sm opacity-80" />
                  <span className={`absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest glow-soft ${b.cls}`}>
                    <Icon name={b.icon} size={14} /> {b.label}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-serif font-bold text-foreground text-2xl leading-snug">{s.title}</h2>
                  {s.description && (
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-3">{s.description}</p>
                  )}
                  {s.reviewer_notes && (
                    <p className="text-xs mt-3 p-3 rounded-xl bg-surface-high text-foreground/80">
                      <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Reviewer · </span>
                      {s.reviewer_notes}
                    </p>
                  )}
                  <div className="gold-divider my-5" />
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                        <Icon name="history_edu" size={14} />
                      </span>
                      {s.category ?? "Memory"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {s.status === "pending" && (
                    <button
                      onClick={() => cancel(s.id)}
                      className="w-full mt-4 py-3 rounded-full text-sm uppercase tracking-[0.25em] text-crimson border border-crimson/40 hover:bg-crimson/10 transition-colors"
                    >
                      Withdraw Submission
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
};

export default SubmissionStatus;
