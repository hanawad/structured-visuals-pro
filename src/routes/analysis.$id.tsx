import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FitAnalysis } from "@/components/FitAnalysis";
import { analyzeFit } from "@/lib/fit-analysis.functions";
import { getOpportunity } from "@/lib/data";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/analysis/$id")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `AI Fit Analysis: ${loaderData.title} — SkillBridge Lite` : "Analysis unavailable — SkillBridge Lite" },
      { name: "description", content: "Compare your profile with an opportunity: relevant skills, potential gaps, and recommended next steps." },
      { property: "og:title", content: loaderData ? `Fit Analysis: ${loaderData.title} — SkillBridge Lite` : "Analysis unavailable — SkillBridge Lite" },
      { property: "og:description", content: "Review relevant skills, potential gaps, and recommended next steps for your selected opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  const opportunity = Route.useLoaderData();
  const { profile, isSample } = useProfile();
  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/opportunities/$id" params={{ id: opportunity.id }} className="text-sm text-muted-foreground hover:text-foreground">← Back to opportunity</Link>
      <h1 className="mt-4 text-3xl font-bold">AI Fit Analysis</h1>
      <p className="mt-2 text-muted-foreground">{isSample ? "Sample profile — not information about you" : profile.name || "Your profile"}</p>
      <p className="mt-1 text-sm text-muted-foreground">{opportunity.title} at {opportunity.company}</p>
      <FitAnalysis
        key={`${opportunity.id}-${JSON.stringify(profile)}`}
        profile={profile}
        opportunity={opportunity}
        request={(p, o) => analyzeFit({ data: { profile: p, opportunity: o } })}
        profileAction={<Link to="/profile" className="text-sm font-medium text-primary underline">Update profile</Link>}
      />
    </section>
  );
}