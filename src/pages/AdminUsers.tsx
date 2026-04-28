import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileRow {
  id: string;
  email: string;
  display_name: string;
  status: "Active" | "Suspended";
  is_admin: boolean;
}

interface RoleRow {
  user_id: string;
  role: "admin" | "member";
}

const AdminUsers = () => {
  const [q, setQ] = useState("");
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,email,display_name,status,is_admin")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setProfiles((p ?? []) as ProfileRow[]);
    setRoles((r ?? []) as RoleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-users")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const roleFor = (uid: string) =>
    roles.some((r) => r.user_id === uid && r.role === "admin") ? "Admin" : "Member";

  const toggleStatus = async (u: ProfileRow) => {
    setBusy(u.id);
    const next = u.status === "Active" ? "Suspended" : "Active";
    const { error } = await supabase
      .from("profiles")
      .update({ status: next })
      .eq("id", u.id);
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${u.display_name || u.email} → ${next}`);
  };

  const togglePromote = async (u: ProfileRow) => {
    const isAdmin = roleFor(u.id) === "Admin";
    setBusy(u.id);
    if (isAdmin) {
      await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "admin");
      await supabase.from("profiles").update({ is_admin: false }).eq("id", u.id);
      toast.success(`${u.email} demoted to Member`);
    } else {
      await supabase
        .from("user_roles")
        .upsert({ user_id: u.id, role: "admin" }, { onConflict: "user_id,role" });
      await supabase.from("profiles").update({ is_admin: true }).eq("id", u.id);
      toast.success(`${u.email} promoted to Admin`);
    }
    setBusy(null);
  };

  const filtered = useMemo(
    () =>
      profiles.filter((u) => {
        if (!q) return true;
        const needle = q.toLowerCase();
        return (
          u.email.toLowerCase().includes(needle) ||
          (u.display_name ?? "").toLowerCase().includes(needle) ||
          roleFor(u.id).toLowerCase().includes(needle)
        );
      }),
    [profiles, q, roles],
  );

  return (
    <AppShell
      navSet="admin"
      title="Thakira Admin"
      rightAction={
        <button
          className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary"
          aria-label="Refresh"
          onClick={load}
        >
          <Icon name="refresh" size={22} />
        </button>
      }
    >
      <section className="px-6 pt-2">
        <h1 className="font-serif font-bold text-foreground text-[2.5rem]">Directory</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live registry of every Thakira account. Suspend, restore, or elevate access.
        </p>

        <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-full bg-surface-container ghost-border">
          <Icon name="search" className="text-muted-foreground" size={20} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or role"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
        </div>

        <div className="mt-5 rounded-[1.5rem] bg-surface-container ghost-border overflow-hidden">
          {loading && (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading directory…</p>
          )}
          {!loading && filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No accounts found.</p>
          )}
          {filtered.map((u) => {
            const role = roleFor(u.id);
            const isAdmin = role === "Admin";
            const suspended = u.status === "Suspended";
            return (
              <div key={u.id} className="ledger-row p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-full bg-surface-high ghost-border ${
                        isAdmin ? "ring-2 ring-primary glow-soft" : ""
                      } flex items-center justify-center`}
                    >
                      <Icon name="person" filled className="text-primary" size={28} />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface-container ${
                        suspended ? "bg-crimson" : "bg-secondary"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-foreground truncate">
                      {u.display_name || u.email.split("@")[0]}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                      {u.email}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 ${
                      isAdmin
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-high text-muted-foreground"
                    }`}
                  >
                    {role}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p
                    className={`text-[11px] uppercase tracking-[0.2em] ${
                      suspended ? "text-crimson font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {suspended ? "Account Suspended" : "Account Active"}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={busy === u.id}
                      onClick={() => togglePromote(u)}
                      className="w-9 h-9 rounded-full bg-surface-high text-primary flex items-center justify-center hover:bg-primary/15 disabled:opacity-50"
                      aria-label={isAdmin ? "Demote" : "Promote to admin"}
                      title={isAdmin ? "Demote to Member" : "Promote to Admin"}
                    >
                      <Icon name="shield" filled={isAdmin} size={18} />
                    </button>
                    <button
                      disabled={busy === u.id}
                      onClick={() => toggleStatus(u)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 ${
                        suspended
                          ? "bg-primary text-primary-foreground glow-soft"
                          : "bg-surface-high text-foreground"
                      }`}
                      aria-label={suspended ? "Reactivate" : "Suspend"}
                      title={suspended ? "Reactivate account" : "Suspend account"}
                    >
                      <Icon name={suspended ? "play_arrow" : "pause"} filled size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-6 mb-10">
          End of Active Ledger · {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </p>
      </section>
    </AppShell>
  );
};

export default AdminUsers;
