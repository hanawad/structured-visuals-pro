import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoMatch, getOpportunity, hasEnoughData } from "@/lib/data";
import { useProfile } from "@/lib/profile-context";

/**
 * No AI service is configured, so real analysis is "unavailable".
 * Loading and error states are supported for when a real service is connected.
 */
type Status = "unavailable" | "loading" | "error" | "insufficient";

export const Route = createFileRoute("/analysis/$id")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `AI Fit Analysis: ${loaderData.title} — SkillBridge Lite` },
          { name: "description", content: `See how your profile fits the ${loaderData.title} role.` },
          { property: "og:title", content: "AI Fit Analysis — SkillBridge Lite" },
          { property: "og:description", content: `Fit analysis for ${loaderData.title}.` },
        ]
      : [{ title: "Unavailable — SkillBridge Lite" }, { name: "robots", content: "noindex" }],
  }),
  component: Analysis,
});

function StateCard({ tone, title, children }: { tone: "info" | "warn" | "error"; title: string; children: React.ReactNode }) {
  const cls = { info: "border-primary/30 bg-accent", warn: "border-warning/40 bg-warning/10", error: "border-destructive/40 bg-destructive/10" }[tone];
  return (
    <div role="status" className={`rounded-xl border p-5 ${cls}`}>
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function Analysis() {
  const o = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  const [showDemo, setShowDemo] = useState(false);
  const status: Status = hasEnoughData(profile) ? "unavailable" : "insufficient";
  const demo = demoMatch(profile, o);

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/opportunities/$id" params={{ id: o.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunity</Link>
      <h1 className="mt-4 text-3xl font-bold">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">
        {isSample ? "Sample profile" : profile.name || "Your profile"} · {o.title} at {o.company}
      </p>

      <div className="mt-6">
        {status === "insufficient" && (
          <StateCard tone="warn" title="Not enough profile information">
            Add your skills and at least one of about, projects, or experience. <Link to="/profile" className="font-medium text-primary underline">Update profile</Link>
          </StateCard>
        )}
        {status === "unavailable" && (
          <StateCard tone="info" title="Real AI analysis is currently unavailable">
            No AI service is configured in this prototype, so no AI analysis has been performed.
          </StateCard>
        )}
        {status === "loading" && <StateCard tone="info" title="Analyzing your fit…">This may take a few seconds.</StateCard>}
        {status === "error" && <StateCard tone="error" title="Something went wrong">The analysis could not be completed. Please try again.</StateCard>}
      </div>

      {status === "unavailable" && !showDemo && (
        <Button variant="outline" className="mt-5" onClick={() => setShowDemo(true)}>Show demonstration example</Button>
      )}

      {status === "unavailable" && showDemo && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-warning/60 bg-card p-6 shadow-card">
          <p className="inline-block rounded-md bg-warning/15 px-2 py-1 text-xs font-bold uppercase tracking-wide">
            Demonstration example — not an AI analysis
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Based only on simple keyword matching between your profile text and the required skills.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <Section title="Relevant Skills" items={demo.relevant} empty="No direct matches found" />
            <Section title="Potential Gaps" items={demo.gaps} empty="No gaps found" />
            <Section
              title="Recommended Next Steps"
              items={demo.gaps.length ? demo.gaps.map((g) => `Build a small project using ${g}`) : ["Highlight matching projects in your profile"]}
              empty=""
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Section({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{items.map((i) => <li key={i}>• {i}</li>)}</ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
