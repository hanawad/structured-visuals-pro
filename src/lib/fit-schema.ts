import { z } from "zod";

const text = z.string().trim().min(1);
export const fitResultSchema = z.object({
  relevantSkills: z.array(z.object({ item: text, evidence: text, relevance: text }).strict()),
  potentialGaps: z.array(z.object({ requirement: text, reason: text }).strict()),
  recommendedNextSteps: z.array(z.object({ action: text, reason: text }).strict()),
}).strict();

export type FitResult = z.infer<typeof fitResultSchema>;
export type FitFailureKind = "insufficient" | "unavailable" | "invalid_output" | "error";
export type FitOutcome = { ok: true; result: FitResult } | { ok: false; kind: FitFailureKind; message: string };

/** Validates raw model text; returns null when it is not exactly the required shape. */
export function parseFitResult(raw: string): FitResult | null {
  try {
    const parsed = fitResultSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

// Strict JSON schema sent to the model (all fields required, no extras).
const obj = (props: string[]) => ({
  type: "object",
  properties: Object.fromEntries(props.map((p) => [p, { type: "string" }])),
  required: props,
  additionalProperties: false,
});
export const fitJsonSchema = {
  type: "object",
  properties: {
    relevantSkills: { type: "array", items: obj(["item", "evidence", "relevance"]) },
    potentialGaps: { type: "array", items: obj(["requirement", "reason"]) },
    recommendedNextSteps: { type: "array", items: obj(["action", "reason"]) },
  },
  required: ["relevantSkills", "potentialGaps", "recommendedNextSteps"],
  additionalProperties: false,
};
