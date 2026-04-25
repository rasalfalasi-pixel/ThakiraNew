import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

type Mode = "focused" | "hidden" | "hint";

const Quiz = () => {
  const [mode, setMode] = useState<Mode>("focused");
  const [picked, setPicked] = useState<string | null>("C");
  const correct = "B";

  const opts = [
    { id: "A", label: "Jerusalem" },
    { id: "B", label: "Haifa" },
    { id: "C", label: "Jaffa" },
    { id: "D", label: "Gaza" },
  ];

  return (
    <AppShell title="HERITAGE ARCHIVE" rightAction={
      <button className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary" aria-label="History">
        <Icon name="history" size={22} />
      </button>
    }>
      <section className="px-6 pt-2">
        <h1 className="font-serif font-bold text-primary text-3xl text-center leading-tight">
          Chapter 2: Heritage Quiz
        </h1>
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground mt-2">
          Level 4 · Question 3 of 5
        </p>

        <div className="flex justify-center gap-2 mt-5">
          {(["focused", "hidden", "hint"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setPicked(m === "hidden" ? null : "C"); }}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                mode === m ? "bg-primary text-primary-foreground glow-soft" : "bg-surface-container text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-surface-container ghost-border p-6">
          <p className="font-serif text-foreground text-xl leading-relaxed text-center">
            {mode === "hint"
              ? "Which city was historically known as the 'Bride of the Sea'?"
              : "Which city was historically famous for its vast orange groves before 1948?"}
          </p>
        </div>

        {mode === "hint" && (
          <div className="mt-5 flex items-start gap-3 animate-fade-in">
            <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-soft shrink-0">
              <Icon name="auto_awesome" filled size={20} />
            </div>
            <div className="rounded-2xl bg-surface-container ghost-border p-4 italic text-sm text-muted-foreground">
              <span className="text-primary font-semibold not-italic">Marhaba!</span> Think of the city known as the
              "Bride of the Sea" and its world-famous citrus exports.
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {opts.map((o) => {
            const isPicked = picked === o.id;
            const isCorrect = mode === "focused" && o.id === correct;
            const isWrong = mode === "focused" && isPicked && o.id !== correct;
            return (
              <button
                key={o.id}
                onClick={() => setPicked(o.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-full ghost-border text-left transition-all ${
                  isCorrect
                    ? "bg-secondary/15 border-secondary text-secondary glow-soft"
                    : isWrong
                    ? "bg-crimson/10 border-crimson text-crimson glow-crimson"
                    : isPicked
                    ? "bg-primary/10 border-primary text-foreground"
                    : "bg-surface-container text-foreground hover:border-primary/40"
                }`}
              >
                <span className="font-serif">
                  <span className="opacity-60 mr-3">{o.id})</span>
                  {o.label}
                </span>
                {isCorrect && (
                  <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Icon name="check" size={16} />
                  </span>
                )}
                {isWrong && (
                  <span className="w-7 h-7 rounded-full bg-crimson text-destructive-foreground flex items-center justify-center">
                    <Icon name="close" size={16} />
                  </span>
                )}
                {isPicked && !isCorrect && !isWrong && (
                  <span className="w-4 h-4 rounded-full bg-primary glow-soft" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Progress</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold">60% Complete</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-surface-high overflow-hidden">
          <div className="h-full bg-primary glow-soft" style={{ width: "60%" }} />
        </div>

        <button
          disabled={!picked}
          className="mt-7 w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all disabled:opacity-40"
        >
          Confirm Answer →
        </button>

        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center mt-5 mb-8">
          Ref ID: ARCH-772-B-24 | Verified Heritage Data
        </p>
      </section>
    </AppShell>
  );
};

export default Quiz;
