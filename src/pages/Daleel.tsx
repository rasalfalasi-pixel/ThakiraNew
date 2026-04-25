import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

type Msg = { from: "user" | "ai"; text: string };

const suggestions = ["Tell me about the Nakba", "Explain Tatreez motifs", "History of Jerusalem", "Origin of Tatreez"];

const Daleel = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "ai",
      text: "Marhaba! I can tell you about historical events, cultural traditions like Tatreez, or the significance of local landmarks. What would you like to know today?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: "ai",
          text:
            "The olive tree is a sacred symbol of resilience, rootedness, and continuity in Palestinian culture — passed across generations alongside its harvest.",
        },
      ]);
    }, 600);
  };

  return (
    <AppShell back title="Thakira Assistant" rightAction={
      <button className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary" aria-label="History">
        <Icon name="history" size={22} />
      </button>
    }>
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground -mt-1 mb-6">
        Preserving Memory
      </p>

      <div className="flex justify-center mb-3">
        <div className="w-20 h-20 rounded-full bg-primary/10 ghost-border flex items-center justify-center glow-soft aura">
          <span className="font-serif font-bold text-primary text-xl tracking-wider">RK</span>
        </div>
      </div>
      <p className="text-center italic text-primary text-sm px-6 mb-6 max-w-[34ch] mx-auto">
        I'm here to help you explore Palestinian heritage, history, and culture.
      </p>

      <div ref={scrollRef} className="px-5 space-y-5 overflow-y-auto pb-2">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}>
            <div
              className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-primary text-primary-foreground glow-soft"
                  : "bg-surface-container text-foreground ghost-border"
              }`}
            >
              {m.text}
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1 px-1">
              {m.from === "user" ? "You · Just now" : "Assistant · Now"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 px-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 px-4 py-2 rounded-full bg-surface-container ghost-border text-primary text-xs font-medium hover:border-primary/40"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container ghost-border focus-within:border-primary/60 mb-6"
        >
          <button type="button" className="w-9 h-9 flex items-center justify-center text-primary/70 hover:text-primary" aria-label="Attach">
            <Icon name="attach_file" size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How were orange groves harvested in Jaffa?"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-soft hover:bg-primary-glow"
            aria-label="Send"
          >
            <Icon name="arrow_forward" size={20} />
          </button>
        </form>
      </div>
    </AppShell>
  );
};

export default Daleel;
