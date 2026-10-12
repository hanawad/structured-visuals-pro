import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, CircleDashed, LoaderCircle, Sparkles, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoMatch, hasEnoughData, type Opportunity, type Profile } from "@/lib/data";

export type FitResult = { relevant: string[]; gaps: string[]; nextSteps: string[] };
export type AnalysisRequest = (profile: Profile, opportunity: Opportunity) => Promise<FitResult>;
type State =
  | { status: "idle" | "analyzing" | "insufficient" | "unavailable" }
  | { status: "success"; result: FitResult }
  | { status: "error"; message: string };

const messages = {
  idle: { title: "Ready to analyze", detail: "Compare your profile with this opportunity.", icon: Sparkles },
  analyzing: { title: "Analyzing your fit…", detail: "Reviewing your skills, projects, and experience.", icon: LoaderCircle },
  success: { title: "Analysis complete", detail: "Your results are based on the profile you submitted.", icon: CheckCircle2 },
  insufficient: { title: "Not enough profile information", detail: "Add your skills and at least one of about, projects, or experience before analyzing.", icon: AlertCircle },
  unavailable: { title: "Real AI analysis is unavailable", detail: "No AI service is configured. No real AI analysis has been performed.", icon: Unplug },
  error: { title: "Analysis could not be completed", detail: "The analysis service encountered a problem. No new results are available. Please try again later.", icon: AlertCircle },
};

// A request adapter is optional: absence must never produce an AI success state.
export function FitAnalysis({ profile, opportunity, request, profileAction }: {
  profile: Profile;
  opportunity: Opportunity;
  request?: AnalysisRequest;
  profileAction: React.ReactNode;
}) {
  const enough = hasEnoughData(profile);
  const [state, setState] = useState<State>({ status: !enough ? "insufficient" : request ? "idle" : "unavailable" });
  const [showDemo, setShowDemo] = useState(false);
  const status = !enough ? "insufficient" : !request ? "unavailable" : state.status;
  const message = messages[status];
  const Icon = message.icon;
  const demo = demoMatch(profile, opportunity);
  const result = status === "success" && state.status === "success" ? state.result : null;
  const displayed = result ?? (showDemo && status === "unavailable" ? {
    ...demo,
    nextSteps: demo.gaps.length ? demo.gaps.map((skill) => `Build a small project using ${skill}`) : ["Highlight matching projects in your profile"],
  } : null);

  async function analyze() {
    if (!enough || !request || state.status === "analyzing") return;
    setShowDemo(false);
    setState({ status: "analyzing" });
    try {
      const result = await request(profile, opportunity);
      setState({ status: "success", result });
    } catch {
      setState({ status: "error", message: messages.error.detail });
    }
  }

  const tone = status === "error" ? "border-destructive/40 bg-destructive/10" : status === "insufficient" ? "border-warning/40 bg-warning/10" : "border-primary/25 bg-accent/50";
  const empty = status === "analyzing" ? "Analysis in progress…" : status === "idle" ? "Awaiting analysis" : "No AI results available";

  return (
    <div className="mt-7" aria-busy={status === "analyzing"}>
      <div role={status === "error" ? "alert" : "status"} aria-live="polite" className={`flex items-start gap-3 rounded-lg border p-5 ${tone}`}>
        <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 text-primary ${status === "analyzing" ? "animate-spin motion-reduce:animate-none" : ""}`} />
        <div>
          <h2 className="font-semibold">{message.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{state.status === "error" && status === "error" ? state.message : message.detail}</p>
          {status === "insufficient" && <div className="mt-3">{profileAction}</div>}
        </div>
      </div>

      {request && enough && (
        <Button className="mt-5" disabled={status === "analyzing"} onClick={analyze}>
          {status === "analyzing" ? <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" /> : <Sparkles aria-hidden="true" />}
          {status === "analyzing" ? "Analyzing…" : status === "success" ? "Analyze again" : "Analyze My Fit"}
        </Button>
      )}
      {status === "unavailable" && (
        <Button variant="outline" className="mt-5" onClick={() => setShowDemo((value) => !value)}>
          {showDemo ? "Hide demonstration example" : "Show demonstration example"}
        </Button>
      )}

      {showDemo && status === "unavailable" && (
        <div className="mt-6 border-l-2 border-warning pl-4">
          <p className="text-sm font-semibold">Demonstration example — not an AI analysis</p>
          <p className="mt-1 text-sm text-muted-foreground">Simple keyword matching only. These are not AI-generated results.</p>
        </div>
      )}
      <div className="mt-7 grid gap-6 border-t pt-6 sm:grid-cols-3">
        <ResultSection title="Relevant Skills" items={displayed?.relevant} empty={empty} completedEmpty="No relevant skills identified." icon={CheckCircle2} />
        <ResultSection title="Potential Gaps" items={displayed?.gaps} empty={empty} completedEmpty="No potential gaps identified." icon={CircleDashed} />
        <ResultSection title="Recommended Next Steps" items={displayed?.nextSteps} empty={empty} completedEmpty="No next steps suggested." icon={ArrowRight} />
      </div>
    </div>
  );
}

function ResultSection({ title, items, empty, completedEmpty, icon: Icon }: {
  title: string; items?: string[]; empty: string; completedEmpty: string; icon: typeof CheckCircle2;
}) {
  return (
    <section>
      <Icon aria-hidden="true" className="mb-3 size-5 text-primary" />
      <h2 className="text-base font-semibold leading-snug">{title}</h2>
      {items?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
          {items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
        </ul>
      ) : <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{items ? completedEmpty : empty}</p>}
    </section>
  );
}