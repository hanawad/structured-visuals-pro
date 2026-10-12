import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillBridge Lite — Understand Your Fit" },
      { name: "description", content: "See how your skills, projects, and experience relate to a professional opportunity." },
      { property: "og:title", content: "SkillBridge Lite — Understand Your Fit" },
      { property: "og:description", content: "Understand your fit. Discover what to improve. Take your next step." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">SkillBridge Lite</p>
      <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Understand Your Fit. Discover Your Next Step.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
        Compare your documented skills, projects, and experience with a selected opportunity — and
        see what to improve before you take your next step.
      </p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg"><Link to="/opportunities">Explore Opportunities</Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/profile">Complete My Profile</Link></Button>
      </div>
    </section>
  );
}
