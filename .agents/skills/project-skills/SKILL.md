---
name: project-skills
description: Rules for project skills, every file under `.agents/skills/` (`.agents/skills/**`). Use before creating, renaming or changing a project skill.
metadata:
  internal: true
---

# Project skills

- A project skill covers one scope and is named after it: `typescript` for `**/*.ts`, `scripts` for `scripts/**`.
- Its frontmatter has `metadata: { internal: true }`, which hides it from `bunx skills`.
- Its `description` names the files of its scope, so that the agent loads it when it touches them.
- A skill does not refer to other skills: the scope index in `AGENTS.md` tells which skills cover a file.
- Checks to run at the end of a task go into a `## Checks` section. A skill with no checks has no such section.
- When a skill is created, renamed or deleted, update the scope index in `AGENTS.md`.

## Checks

- [ ] Every changed `SKILL.md` has `metadata.internal: true` in its frontmatter.
- [ ] The scope index in `AGENTS.md` lists exactly the folders in `.agents/skills/`, each with its scope.
