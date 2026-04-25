import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

type Status = "active" | "suspended";

const users = [
  { name: "Malik Al-Sayed", email: "MALIK.S@THAKIRA.ARCH", role: "Admin", meta: "Permissions: Full Access", status: "active" as Status, accent: true },
  { name: "Elena Vance", email: "E.VANCE@THAKIRA.ARCH", role: "Contributor", meta: "Region: Cairo Sector", status: "active" as Status },
  { name: "Omar Farouk", email: "O.FAROUK@THAKIRA.ARCH", role: "Explorer", meta: "Account Suspended", status: "suspended" as Status },
  { name: "Sofia Thorne", email: "S.THORNE@THAKIRA.ARCH", role: "Contributor", meta: "Region: London Vault", status: "active" as Status },
];

const AdminUsers = () => {
  const [q, setQ] = useState("");
  return (
    <AppShell navSet="admin" title="Thakira Admin" rightAction={
      <button className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary" aria-label="Search">
        <Icon name="search" size={22} />
      </button>
    }>
      <section className="px-6 pt-2">
        <h1 className="font-serif font-bold text-foreground text-[2.5rem]">Directory</h1>

        <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-full bg-surface-container ghost-border">
          <Icon name="search" className="text-muted-foreground" size={20} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by family name, role, or city"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button className="text-muted-foreground" aria-label="Filter"><Icon name="tune" size={18} /></button>
        </div>

        <div className="mt-5 rounded-[1.5rem] bg-surface-container ghost-border overflow-hidden">
          {users
            .filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()))
            .map((u) => (
              <div key={u.email} className="ledger-row p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full bg-surface-high ghost-border ${u.accent ? "ring-2 ring-primary glow-soft" : ""} flex items-center justify-center`}>
                      <Icon name="person" filled className="text-primary" size={28} />
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface-container ${u.status === "active" ? "bg-secondary" : "bg-crimson"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-foreground truncate">{u.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 ${
                    u.role === "Admin" ? "bg-primary text-primary-foreground" :
                    u.role === "Contributor" ? "bg-surface-high text-primary" :
                    "bg-surface-high text-muted-foreground"
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className={`text-[11px] uppercase tracking-[0.2em] ${u.status === "suspended" ? "text-crimson font-bold" : "text-muted-foreground"}`}>
                    {u.meta}
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-surface-high text-primary flex items-center justify-center hover:bg-primary/15" aria-label="Permissions">
                      <Icon name="shield" filled size={18} />
                    </button>
                    <button className={`w-9 h-9 rounded-full flex items-center justify-center ${u.status === "suspended" ? "bg-primary text-primary-foreground glow-soft" : "bg-surface-high text-foreground"}`} aria-label="Toggle">
                      <Icon name={u.status === "suspended" ? "play_arrow" : "pause"} filled size={18} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-surface-high text-primary flex items-center justify-center hover:bg-primary/15" aria-label="Edit">
                      <Icon name="edit" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-6 mb-10">
          End of Active Ledger
        </p>
      </section>

      <button className="absolute bottom-28 right-6 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground glow-gold flex items-center justify-center hover:bg-primary-glow" aria-label="Add user">
        <Icon name="add" size={28} />
      </button>
    </AppShell>
  );
};

export default AdminUsers;
