import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";

const Contribute = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("Family Memoir");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("You must be signed in to contribute.");
      return;
    }
    if (!title.trim() || !story.trim()) {
      toast.error("Please add a title and a story.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("submissions").insert({
      user_id: session.userId,
      title: title.trim(),
      description: story.trim(),
      category,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Memory submitted to the Archive — pending review");
    navigate("/submissions");
  };

  return (
    <AppShell
      title="THAKIRA"
      rightAction={
        <button
          className="w-10 h-10 rounded-full hover:bg-surface-high/60 flex items-center justify-center text-primary"
          aria-label="Search"
        >
          <Icon name="search" size={22} />
        </button>
      }
    >
      <section className="px-6 pt-4">
        <h1 className="font-serif font-bold text-primary text-[2.5rem] leading-[1.05]">
          Contribute a<br />Memory
        </h1>
        <p className="text-muted-foreground text-sm mt-3">Share your story with the world.</p>
      </section>

      <form onSubmit={handleSubmit} className="px-6 pt-8 space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-2 font-semibold">
            Story Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Grandfather's Olive Grove, 1946"
            className="w-full px-5 py-4 rounded-2xl bg-surface-container ghost-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-2 font-semibold">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-surface-container ghost-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option>Family Memoir</option>
            <option>Oral History</option>
            <option>Photograph</option>
            <option>Artifact</option>
            <option>Place Memory</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-2 font-semibold">
            Story Narrative
          </label>
          <div className="relative">
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value.slice(0, 2000))}
              placeholder="Begin your story here..."
              rows={7}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container ghost-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
            />
            <span className="absolute bottom-3 right-4 text-[11px] text-muted-foreground">
              {story.length} / 2000
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground font-serif font-bold text-lg glow-gold hover:bg-primary-glow active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit to Collection"}
        </button>

        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 text-center leading-relaxed pb-6">
          By submitting, you agree to preserve this memory in the digital archive for future generations.
        </p>
      </form>
    </AppShell>
  );
};

export default Contribute;
