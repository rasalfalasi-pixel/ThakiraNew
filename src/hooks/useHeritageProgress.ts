import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthContext";

/**
 * Heritage Completion percentage.
 * Formula: each completed quiz attempt = 20%, each approved submission = 10%.
 * Capped at 100. New users start at 0%.
 */
const QUIZ_WEIGHT = 20;
const SUBMISSION_WEIGHT = 10;

export interface HeritageProgress {
  percent: number;
  quizzesCompleted: number;
  approvedSubmissions: number;
  loading: boolean;
}

export const useHeritageProgress = (): HeritageProgress => {
  const { session } = useAuth();
  const [state, setState] = useState<HeritageProgress>({
    percent: 0,
    quizzesCompleted: 0,
    approvedSubmissions: 0,
    loading: true,
  });

  useEffect(() => {
    if (!session) {
      setState({ percent: 0, quizzesCompleted: 0, approvedSubmissions: 0, loading: false });
      return;
    }
    let cancelled = false;
    (async () => {
      const [{ count: quizCount }, { count: subCount }] = await Promise.all([
        supabase
          .from("quiz_attempts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session.userId),
        supabase
          .from("submissions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", session.userId)
          .eq("status", "approved"),
      ]);
      if (cancelled) return;
      const q = quizCount ?? 0;
      const s = subCount ?? 0;
      const percent = Math.min(100, q * QUIZ_WEIGHT + s * SUBMISSION_WEIGHT);
      setState({ percent, quizzesCompleted: q, approvedSubmissions: s, loading: false });
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  return state;
};
