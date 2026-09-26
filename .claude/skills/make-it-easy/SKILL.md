---
name: make-it-easy
description: Write plain, short, action-first text for readers who are not native English speakers, and keep code comments minimal. Use this whenever you write a chat reply to the user, a code comment or docstring, a README or any documentation, a PR description, or a commit message. Also use it when asked to simplify, shorten, or clean up existing prose, comments, or docs. Do not use it to change code behavior, log/error strings that systems parse, or text that must stay exact (legal, security, API contracts).
---

# Make It Easy

## Overview

Three jobs, one standard:

1. **Chat replies**: the reader knows what changed and what to do after one read.
2. **Code comments**: far fewer than the default. Comment why, never what.
3. **Docs**: short, concrete, runnable. No background the reader does not need.

Assume the reader is a competent engineer who is **not a native English speaker**. Simple words, short sentences, no idioms. This is a writing standard only. It never lowers the bar on correctness, and it never changes the code you were asked to write.

This skill is self-contained. It needs no other skill, file, or repo convention.

## 1. Plain English (applies to everything)

- One idea per sentence. Aim for 15 words, hard stop around 25.
- Active voice, present tense. "The job retries 3 times", not "retries will have been attempted".
- Common words. "delete", not "get rid of". "start", not "spin up". "reduce", not "dial down".
- No idioms, no metaphors, no wordplay, no humor that depends on English.
- No em dashes or en dashes. Use commas, periods, colons, semicolons, parentheses.
- Avoid phrasal verbs when a single verb works: "check" over "look into", "fix" over "sort out".
- Absolute dates and concrete names. "2026-09-30", not "end of next sprint".
- Keep the real names of things: ticket IDs, service names, env vars, file paths. Those are not jargon, they are addresses.
- Expand an acronym once, the first time, then use it freely.

## 2. Code comments: default is none

Write the comment only if the reader would be wrong or slow without it.

**Comment these:**

- Why a non-obvious choice was made, especially a tradeoff or a rejected alternative.
- Workarounds, with a link or ticket ID for the cause.
- Invariants and assumptions the code depends on but does not state.
- Units, formats, timezones, ranges ("bytes, not KB", "UTC", "0 to 1 inclusive").
- Real traps: ordering requirements, side effects, why something must not be reordered or parallelized.
- `TODO` only with a ticket ID or a name attached.

**Never comment these:**

- What the next line already says. `# increment the counter` above `count += 1` is noise.
- Section banners and decorative separators (`# ===== HELPERS =====`).
- The history of your edit. No "moved from utils.py", "was a loop before", "added per review". That belongs in the commit message.
- Every parameter of a function whose parameters are obvious.
- Commented-out code. Delete it.
- Restating a type the signature already declares.

**Style:**

- One line is the target. Three lines is the maximum for a normal comment.
- Match the existing file: its comment density, its language, its `//` vs `#` vs docstring habits. If the file has almost no comments, add almost none.
- Docstrings go on public or exported functions, classes, and modules. Skip them on small private helpers whose name is clear.
- A docstring is one line of purpose, then params and returns only where the name and type do not already answer it.
- Write comments as statements of fact, not conversation with the reader.

## 3. Documentation

- First line says what the thing is. Second block says how to run it.
- Order: purpose, quick start, configuration, details, troubleshooting. Move anything optional down.
- Show a command or a code example instead of describing one.
- Lists and tables beat paragraphs. Never a paragraph over 3 sentences.
- Document current state only. No changelog narration inside docs.
- Headings are short and literal ("Run locally", not "Getting your environment up and running").
- Every placeholder is obvious: `<your-api-key>`, not `apikey`.
- If a step can fail in a known way, say what the failure looks like and what to do.

## 4. Chat replies to the user

- First line: what changed, what to do, or what is blocked. Never background, never a preamble.
- Then, at most a few lines: files touched, the next action, who or what you are waiting on.
- Never narrate your process. No "I searched X, then opened Y, then decided Z".
- 3 to 7 bullets per block. One level of nesting, never two.
- No headings for a short answer. Plain lines are enough.
- Point at code as `path/to/file.py:42`.
- Do not replay the diff in prose. The user can read the diff.
- Say failures and skips plainly, in the first two lines: "tests fail, 2 of 14" or "skipped the migration, no DB access".
- If nothing needs the user, say that first.
- Evidence, sources, and commands go in one short block at the end, if at all.

## 5. Commits and PR descriptions

- Subject line: what changed, imperative, under ~70 characters.
- Body: why, in one or two sentences. Then bullets for the notable changes.
- Call out anything risky, breaking, or needing a manual step.
- Do not list every file. The diff does that.

## 6. Precision wins over brevity

Do not shorten, soften, or simplify:

- Error messages, log strings, and anything a system parses or a test asserts on.
- API contracts, schema field meanings, security and permission notes.
- Legal, license, or compliance text.
- Exact steps for migrations, rollbacks, and anything destructive.

For these, keep them complete and exact. Plain wording is still welcome, missing detail is not.

## 7. Before you send, check

- Does the first line carry the point?
- Can any sentence lose half its words?
- Would a non-native reader need a dictionary anywhere?
- Any comment that just restates its code? Delete it.
- Any line that changes nothing for the reader? Delete it.
- Any em dash, idiom, or metaphor left? Replace it.

See [references/examples.md](references/examples.md) for before and after pairs.

Copy [references/always-on-snippet.md](references/always-on-snippet.md) into a repo's `CLAUDE.md` when this standard should apply to every task in that repo, not only when the skill triggers.
