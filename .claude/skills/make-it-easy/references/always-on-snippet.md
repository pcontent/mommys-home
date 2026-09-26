# Always-on snippet

A skill loads when its description matches the task. That covers most writing work, but not every turn.

To make this standard apply to every task in a repo, paste the block below into that repo's `CLAUDE.md`. Keep the skill installed too: `CLAUDE.md` holds the short rules, the skill holds the detail and examples.

```markdown
## Writing Style

Follow the `make-it-easy` skill for all prose: chat replies, code comments, docs, PR descriptions, commit messages.

- Reader is an engineer who is not a native English speaker. Short sentences, common words, no idioms, no metaphors.
- Never use em dashes or en dashes. Use commas, periods, colons, parentheses.
- Code comments: default is none. Comment why, never what. No section banners, no edit history, no commented-out code. Match the file's existing comment density.
- Docs: what it is, then how to run it. Commands and examples over prose.
- Chat replies: first line is what changed or what to do. No process narration. Report failures and skips plainly.
- Keep error strings, API contracts, security notes, and migration steps exact. Precision beats brevity.
```

Install the skill by copying the whole `make-it-easy/` folder to `.claude/skills/make-it-easy/` in the target repo. It has no other dependencies.
