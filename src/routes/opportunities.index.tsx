import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { OPPORTUNITIES } from "@/lib/data";
import { SkillTag } from "@/components/SkillTag";

export const Route = createFileRoute("/opportunities/")({
  head: () => ({
    meta: [
      { title: "Opportunities — SkillBridge Lite" },
      { name: "description", content: "Browse sample opportunities and analyze your fit." },
      { property: "og:title", content: "Opportunities — SkillBridge Lite" },
      { property: "og:description", content: "Browse sample opportunities and analyze your fit." },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-3xl font-bold">Opportunities</h1>
      <p className="mt-2 text-muted-foreground">Sample opportunities to compare against your profile.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {OPPORTUNITIES.map((o) => (
          <article key={o.id} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
            <p className="text-sm font-medium text-primary">{o.company}</p>
            <h2 className="mt-1 text-xl font-semibold">{o.title}</h2>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{o.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{o.skills.map((s) => <SkillTag key={s}>{s}</SkillTag>)}</div>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/opportunities/$id" params={{ id: o.id }}>View Details</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
