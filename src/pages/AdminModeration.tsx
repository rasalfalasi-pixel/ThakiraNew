import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";

interface Submission {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string | null;
  created_at: string;
}

interface ProfileLite {
  id: string;
  email: string;
  display_name: string;
}

type Filter = "pending" | "approved" | "rejected" | "all";

const AdminModeration = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<Submission[]>([]);
  const [authors, setAuthors] = useState<Record<string, ProfileLite>>({});
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const load = async () => {
    const { data: subs } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (subs ?? []) as Submission[];
    setItems(list);

    const ids = Array.from(new Set(list.map((s) => s.user_id)));
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,email,display_name")
        .in("id", ids);
      const map: Record<string, ProfileLite> = {};
      (profs ?? []).forEach((p) => (map[p.id] = p as ProfileLite));
      setAuthors(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-moderation")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const review = async (s: Submission, status: "approved" | "rejected") => {
    if (!session) return;
    setBusy(s.id);
    const { error } = await supabase
      .from("submissions")
      .update({
        status,
        reviewer_notes: notesDraft[s.id] || s.reviewer_notes,
        reviewed_by: session.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", s.id);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Submission ${status}`);
  };

  const filtered = useMemo(
    () => items.filter((s) => (filter === "all" ? true : s.status === filter)),
    [items, filter],
  );

  const counts = useMemo(
    () => ({
      pending: items.filter((s) => s.status === "pending").length,
      approved: items.filter((s) => s.status === "approved").length,
      rejected: items.filter((s) => s.status === "rejected").length,
      all: items.length,
    }),
    [items],
  );

  return (
    <AppShell
      navSet="admin"
      title="Moderation"
      rightAction={
        <button
          onClick={load}
          className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary"
          aria-label="Refresh"
        >
          <Icon name="refresh" size={22} />
        </button>
      }
    >
      <section className="px-6 pt-2">
        <h1 className="font-serif font-bold text-foreground text-[2.5rem] leading-tight">
          Moderation Queue
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review community contributions before they enter the public archive.
        </p>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground glow-soft"
                  : "bg-surface-container text-muted-foreground ghost-border"
              }`}
            >
              {f} · {counts[f]}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-sm text-muted-foreground mt-10">Loading queue…</p>}
        {!loading && filtered.length === 0 && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <Icon name="inbox" size={36} className="text-primary mx-auto mb-3" />
            Nothing in this queue.
          </div>
        )}

        <div className="space-y-5 mt-6 mb-10">
          {filtered.map((s) => {
            const author = authors[s.user_id];
            const isPending = s.status === "pending";
            return (
              <article
                key={s.id}
                className="rounded-[1.5rem] bg-surface-container ghost-border p-5 shadow-elevated"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-foreground text-xl leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {author?.display_name || author?.email || "Unknown contributor"} ·{" "}
                      {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 whitespace-nowrap ${
                      s.status === "pending"
                        ? "bg-primary text-primary-foreground"
                        : s.status === "approved"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-crimson text-white"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                {s.category && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary mt-3">
                    {s.category}
                  </p>
                )}
                {s.description && (
                  <p className="text-sm text-foreground/80 mt-2 leading-relaxed whitespace-pre-line">
                    {s.description}
                  </p>
                )}

                {isPending ? (
                  <>
                    <textarea
                      value={notesDraft[s.id] ?? ""}
                      onChange={(e) =>
                        setNotesDraft((d) => ({ ...d, [s.id]: e.target.value }))
                      }
                      placeholder="Reviewer notes (optional)"
                      rows={2}
                      className="w-full mt-4 px-4 py-3 rounded-2xl bg-surface-high ghost-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        disabled={busy === s.id}
                        onClick={() => review(s, "approved")}
                        className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest glow-soft hover:bg-primary-glow disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={busy === s.id}
                        onClick={() => review(s, "rejected")}
                        className="flex-1 py-3 rounded-full border border-crimson/50 text-crimson font-bold text-sm uppercase tracking-widest hover:bg-crimson/10 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                ) : (
                  s.reviewer_notes && (
                    <p className="text-xs mt-4 p-3 rounded-xl bg-surface-high text-foreground/80">
                      <span className="text-primary font-bold uppercase tracking-widest text-[10px]">
                        Reviewer notes ·{" "}
                      </span>
                      {s.reviewer_notes}
                    </p>
                  )
                )}
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
};

export default AdminModeration;
