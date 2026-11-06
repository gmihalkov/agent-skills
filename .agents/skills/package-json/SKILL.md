---
name: package-json
description: Rules for `package.json`: scripts and dependencies. Use before changing `package.json`.
metadata:
  internal: true
---

# package.json

- Prefix scripts by what they process: `docs-` for Markdown and YAML, `code-` for TypeScript and JSON.
- Every script takes an optional list of files; no arguments means the whole repository. When the tool cannot take such a list itself, put a wrapper in `scripts/`.
- Add only working scripts, no placeholders.
- Tools go in `devDependencies` with a `^` range.
