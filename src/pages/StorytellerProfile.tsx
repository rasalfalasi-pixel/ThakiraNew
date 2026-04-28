import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/auth/AuthContext";
import { useHeritageProgress } from "@/hooks/useHeritageProgress";
import olive from "@/assets/olive-grove.jpg";
import artisan from "@/assets/artisan-linework.jpg";
import family from "@/assets/family-archive.jpg";

const achievements = [
  { name: "The Olive Groves", img: olive },
  { name: "Ancient Cities", img: artisan },
  { name: "Textile Master", img: family },
];

const StorytellerProfile = () => {
  const [showAchievements, setShowAchievements] = useState(false);
  const { session } = useAuth();
  const { percent, quizzesCompleted, approvedSubmissions } = useHeritageProgress();
  const displayName = session?.displayName ?? "Storyteller";
  const tier =
    percent >= 70
      ? { label: "Master Storyteller", status: "Master Status Active" }
      : percent >= 40
        ? { label: "Heritage Keeper", status: "Keeper Tier Active" }
        : percent > 0
          ? { label: "Apprentice Storyteller", status: "Apprentice Tier" }
          : { label: "New Storyteller", status: "Begin your journey" };

  return (
    <AppShell title="THAKIRA">
      <section className="px-6 pt-2 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden ghost-border ring-4 ring-primary/60 glow-gold bg-surface-high">
          <div className="w-full h-full bg-gradient-to-br from-primary/40 via-surface-high to-surface flex items-center justify-center">
            <Icon name="person" filled className="text-primary" size={64} />
          </div>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
          {tier.label}
        </p>
        <h1 className="font-serif font-bold text-foreground text-3xl mt-1">{displayName}</h1>
      </section>

      {/* Progress */}
      <section className="px-6 mt-6">
        <div className="bg-surface-container ghost-border rounded-[1.5rem] p-5">
          <div className="flex items-end justify-between">
            <p className="text-foreground font-medium">
              {percent}% Heritage Completion — <span className="text-primary">{tier.status}</span>
            </p>
            <span className="font-serif text-3xl text-primary">{percent}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-surface-high overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-glow to-primary glow-soft transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {percent === 0
              ? "Begin your heritage journey by completing a quiz or contributing a memory."
              : `You've completed ${quizzesCompleted} ${quizzesCompleted === 1 ? "quiz" : "quizzes"} and contributed ${approvedSubmissions} approved ${approvedSubmissions === 1 ? "memory" : "memories"} to the archive.`}
          </p>
        </div>
      </section>

      {/* Action grid */}
      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {[
          { l: "Redeem Special Award", icon: "emoji_events" },
          { l: "Display Special Badge", icon: "verified" },
          { l: "Archival Access", icon: "history_edu" },
          { l: "Community Leadership", icon: "groups" },
        ].map((b) => (
          <button
            key={b.l}
            onClick={() => setShowAchievements(true)}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-surface-container ghost-border hover:border-primary/40 hover:bg-surface-high/60 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Icon name={b.icon} filled size={24} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground text-center leading-tight">
              {b.l}
            </p>
          </button>
        ))}
      </section>

      {/* Recent achievements */}
      <section className="px-6 mt-7 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-foreground text-xl">Recent Achievements</h2>
          <button onClick={() => setShowAchievements(true)} className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">
            View All
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
          {achievements.map((a) => (
            <div key={a.name} className="shrink-0 w-32 rounded-2xl bg-surface-container ghost-border p-3 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ghost-border">
                <img src={a.img} alt={a.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <p className="font-serif text-sm text-foreground mt-3">{a.name}</p>
              <button className="mx-auto mt-2 w-7 h-7 rounded-full bg-surface-high text-muted-foreground flex items-center justify-center hover:text-primary">
                <Icon name="ios_share" size={14} />
              </button>
            </div>
          ))}
        </div>

        <Link
          to="/admin"
          className="mt-6 flex items-center justify-between px-5 py-4 rounded-2xl bg-surface-container ghost-border text-foreground hover:border-primary/40"
        >
          <span className="flex items-center gap-3">
            <Icon name="shield_person" filled className="text-primary" size={22} />
            <span className="font-medium">Admin Console</span>
          </span>
          <Icon name="chevron_right" className="text-muted-foreground" />
        </Link>
      </section>

      {/* Achievements modal */}
      {showAchievements && (
        <div
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowAchievements(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[2rem] bg-surface-container ghost-border p-7 text-center shadow-elevated sheet-rise"
          >
            <h2 className="font-serif font-bold text-primary text-3xl text-shadow-gold">CONGRATULATIONS!</h2>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
              New Heritage Milestones
            </p>

            <div className="flex justify-center items-end gap-5 mt-7">
              {[
                { label: "Olive Grove", icon: "eco", color: "secondary" },
                { label: "Holy Dome", icon: "mosque", color: "primary", big: true },
                { label: "Ancient Clay", icon: "spa", color: "crimson" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center">
                  <div
                    className={`rounded-full flex items-center justify-center ghost-border ${
                      b.big ? "w-20 h-20 bg-primary/15 text-primary glow-gold aura" : "w-14 h-14 bg-surface-high text-foreground"
                    }`}
                  >
                    <Icon
                      name={b.icon}
                      filled
                      size={b.big ? 36 : 24}
                      className={b.color === "secondary" ? "text-secondary" : b.color === "crimson" ? "text-crimson" : "text-primary"}
                    />
                  </div>
                  <p className={`text-[10px] uppercase tracking-[0.18em] mt-2 ${b.big ? "text-primary font-bold" : "text-foreground"}`}>
                    {b.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-7">You've Unlocked</p>
            <p className="font-serif font-bold text-foreground text-2xl mt-1">3 More Achievements!</p>

            <button
              onClick={() => setShowAchievements(false)}
              className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all"
            >
              View New Badges →
            </button>
            <button
              onClick={() => setShowAchievements(false)}
              className="mt-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
            >
              Dismiss for now
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default StorytellerProfile;
