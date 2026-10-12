import type { ReactNode } from "react";

export function SkillTag({ children }: { children: ReactNode }) {
  return <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{children}</span>;
}
