---
name: markdown
description: Rules for every Markdown file in this repository (`**/*.md`). Use before creating or changing any `.md` file.
metadata:
  internal: true
---

# Markdown

- Do not hard-wrap prose: one paragraph is one line.
- Link to files inside the repository with relative links.
- Use ATX headings (`#`, `##`, …).
- Make a hard line break with a trailing `\`, never with two trailing spaces.
- After editing, run `bun run docs-format <files>` on the files you changed.

## Integrate, don't append

- Read the whole file before changing it.
- Put new information where it belongs, not at the end.
- When the file already states something related, rewrite that text instead of adding a second statement next to it.
- When there is no right place for the new information, restructure the file.
- The result reads as if it was written in one go.

## Checks

- [ ] `bun run docs-lint` passes.
- [ ] Every relative link in a changed `.md` file resolves to an existing file.
