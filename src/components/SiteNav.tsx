import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "My Profile" },
  { to: "/opportunities", label: "Opportunities" },
] as const;

export function SiteNav() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="font-display text-lg font-bold text-foreground">
          SkillBridge <span className="text-primary">Lite</span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
