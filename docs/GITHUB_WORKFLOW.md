# GitHub workflow (Section 01) — cheat sheet

Use this when recording or explaining your submission.

## Goals

- Prove you can use **branches**, **commits**, **push**, and **pull requests**.
- Keep a clear story: *what changed* and *why merge to main*.

## Steps

1. **Create a branch** from `main`  
   `git checkout main && git pull && git checkout -b feature/your-small-change`

2. **Make a tiny, honest change**  
   Examples: README typo, comment, env example note, copy tweak. Avoid bundling unrelated refactors.

3. **Commit** with a clear message  
   `git add … && git commit -m "Describe the change"`

4. **Push** and open a **PR** to `main`  
   `git push -u origin feature/your-small-change`  
   Then on GitHub: *Compare & pull request* (or `gh pr create`).

5. **Merge** after review (or self-review if allowed)  
   Prefer **merge** or **squash** per team rules; say which you used.

## What to say out loud

- “I branched so `main` stays stable while I work.”
- “The PR shows the diff and documents intent for reviewers.”
- “Merging brings the agreed change into `main` as a single integration point.”

## Optional: protect `main`

Mention if `main` uses branch protection (required reviews, CI). That mirrors real teams.
