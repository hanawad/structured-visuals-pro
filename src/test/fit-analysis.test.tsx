import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FitAnalysis } from "@/components/FitAnalysis";
import { parseFitResult, type FitOutcome } from "@/lib/fit-schema";
import { OPPORTUNITIES, SAMPLE_PROFILE } from "@/lib/data";

afterEach(cleanup);
const opportunity = OPPORTUNITIES[0];
if (!opportunity) throw new Error("Test opportunity is required");
const result: FitOutcome = { ok: true, result: {
  relevantSkills: [{ item: "Python", evidence: "Lists Python", relevance: "Role uses Python" }],
  potentialGaps: [{ requirement: "APIs", reason: "No evidence in profile" }],
  recommendedNextSteps: [{ action: "Practice API integration", reason: "Builds evidence" }],
} };

describe("Fit analysis requests", () => {
  it("never launches a request automatically or for a demonstration", () => {
    const request = vi.fn().mockResolvedValue(result);
    const view = render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} request={request} profileAction={null} />);
    expect(request).not.toHaveBeenCalled();
    view.rerender(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} profileAction={null} />);
    fireEvent.click(screen.getByRole("button"));
    expect(request).not.toHaveBeenCalled();
  });

  it("blocks requests when skills or supporting profile information are missing", () => {
    const request = vi.fn();
    const view = render(<FitAnalysis profile={{ ...SAMPLE_PROFILE, skills: " " }} opportunity={opportunity} request={request} profileAction={null} />);
    expect(screen.queryByRole("button")).toBeNull();
    view.rerender(<FitAnalysis profile={{ ...SAMPLE_PROFILE, about: "", projects: "", experience: "" }} opportunity={opportunity} request={request} profileAction={null} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(request).not.toHaveBeenCalled();
  });

  it("prevents duplicate requests until the real request succeeds", async () => {
    let resolve: ((value: FitOutcome) => void) | undefined;
    const request = vi.fn(() => new Promise<FitOutcome>((done) => { resolve = done; }));
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} request={request} profileAction={null} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(request).toHaveBeenCalledExactlyOnceWith(SAMPLE_PROFILE, opportunity);
    expect(button).toBeDisabled();
    await act(async () => { resolve?.(result); });
    expect(button).toBeEnabled();
  });

  it("ends loading after failure without automatically retrying", async () => {
    const request = vi.fn().mockRejectedValue(new Error("Service failed"));
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} request={request} profileAction={null} />);
    await act(async () => { fireEvent.click(screen.getByRole("button")); });
    expect(request).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
describe("AI output validation", () => {
  const valid = { relevantSkills: [{ item: "a", evidence: "b", relevance: "c" }], potentialGaps: [], recommendedNextSteps: [] };
  it("accepts exactly the three required fields", () => {
    expect(parseFitResult(JSON.stringify(valid))).not.toBeNull();
  });
  it("rejects missing fields, extra fields, and non-JSON", () => {
    expect(parseFitResult(JSON.stringify({ relevantSkills: [], potentialGaps: [] }))).toBeNull();
    expect(parseFitResult(JSON.stringify({ ...valid, score: 90 }))).toBeNull();
    expect(parseFitResult(JSON.stringify({ ...valid, relevantSkills: [{ item: "a", evidence: "" , relevance: "c" }] }))).toBeNull();
    expect(parseFitResult("not json")).toBeNull();
  });
  it("shows a failed request as an error, never as results", async () => {
    const request = vi.fn().mockResolvedValue({ ok: false, kind: "invalid_output", message: "Could not be verified" });
    render(<FitAnalysis profile={SAMPLE_PROFILE} opportunity={opportunity} request={request} profileAction={null} />);
    await act(async () => { fireEvent.click(screen.getByRole("button")); });
    expect(screen.getByRole("alert").textContent).toContain("Could not be verified");
    expect(screen.queryByText("Python")).toBeNull();
  });
});
