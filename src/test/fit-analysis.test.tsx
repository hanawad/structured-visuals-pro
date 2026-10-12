import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FitAnalysis, type FitResult } from "@/components/FitAnalysis";
import { OPPORTUNITIES, SAMPLE_PROFILE } from "@/lib/data";

afterEach(cleanup);
const opportunity = OPPORTUNITIES[0];
if (!opportunity) throw new Error("Test opportunity is required");
const result: FitResult = { relevant: ["Python"], gaps: ["APIs"], nextSteps: ["Practice API integration"] };

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
    let resolve: ((value: FitResult) => void) | undefined;
    const request = vi.fn(() => new Promise<FitResult>((done) => { resolve = done; }));
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