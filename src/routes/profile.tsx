import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/lib/profile-context";
import type { Profile } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — SkillBridge Lite" },
      { name: "description", content: "Enter your skills, projects, and experience." },
      { property: "og:title", content: "My Profile — SkillBridge Lite" },
      { property: "og:description", content: "Enter your skills, projects, and experience." },
    ],
  }),
  component: ProfilePage,
});

const fields: { key: keyof Profile; label: string; area?: boolean; hint?: string }[] = [
  { key: "name", label: "Name" },
  { key: "headline", label: "Headline" },
  { key: "about", label: "About", area: true },
  { key: "skills", label: "Skills", hint: "Separate with commas" },
  { key: "projects", label: "Projects", area: true },
  { key: "experience", label: "Experience", area: true },
];

function ProfilePage() {
  const { profile, isSample, save } = useProfile();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Your profile is used when analyzing your fit. Changes stay in this browser session only.</p>
      {isSample && (
        <div className="mt-5 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <strong>Sample profile.</strong> This is placeholder content, not information about you. Replace it with your own details and save.
        </div>
      )}
      <form
        className="mt-6 space-y-5 rounded-xl border border-border bg-card p-6 shadow-card"
        onSubmit={(e) => { e.preventDefault(); save(draft); setSaved(true); }}
      >
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.area ? (
              <Textarea id={f.key} rows={3} value={draft[f.key]} onChange={(e) => { setDraft({ ...draft, [f.key]: e.target.value }); setSaved(false); }} />
            ) : (
              <Input id={f.key} value={draft[f.key]} onChange={(e) => { setDraft({ ...draft, [f.key]: e.target.value }); setSaved(false); }} />
            )}
            {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}
        <div className="flex items-center gap-3">
          <Button type="submit">Save Profile</Button>
          {saved && <span className="text-sm text-success">Profile saved.</span>}
        </div>
      </form>
    </section>
  );
}
