<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep fit-analysis presentation in a dedicated component with an optional real-request adapter; an unconfigured adapter cannot produce real results.
- AI fit analysis runs in a server function that validates model output against a strict schema and returns typed failure outcomes; keeps the AI key server-side and never shows unverified output.
