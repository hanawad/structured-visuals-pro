import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getOpportunity } from "@/lib/data";
import { SkillTag } from "@/components/SkillTag";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const opp = getOpportunity(params.id);
    if (!opp) throw notFound();
    return opp;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} at ${loaderData.company} — SkillBridge Lite` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.title} — SkillBridge Lite` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
        ]
      : [{ title: "Opportunity not found — SkillBridge Lite" }, { name: "robots", content: "noindex" }],
  }),
  component: Details,
});

function Details() {
  const o = Route.useLoaderData();
  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/opportunities" className="text-sm text-muted-foreground hover:text-foreground">← All opportunities</Link>
      <div className="mt-4 rounded-xl border border-border bg-card p-7 shadow-card">
        <p className="text-sm font-medium text-primary">{o.company}</p>
        <h1 className="mt-1 text-3xl font-bold">{o.title}</h1>
        <p className="mt-4 text-muted-foreground">{o.description}</p>
        <h2 className="mt-7 text-lg font-semibold">Required skills</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">{o.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}</div>
        <h2 className="mt-7 text-lg font-semibold">Responsibilities</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
          {o.responsibilities.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <Button asChild size="lg" className="mt-8">
          <Link to="/analysis/$id" params={{ id: o.id }}>Analyze My Fit</Link>
        </Button>
      </div>
    </section>
  );
}
