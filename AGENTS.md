# AGENTS.md

## Context

This is a public repository of personal agent skills. For now only its owner uses them. The primary agent is Claude Code, the secondary one is Codex. The skills target strong models only.

## Structure

- `skills/<name>/` — published skills: `SKILL.md` plus `README.md` with the theory behind the skill, rendered by GitHub.
- `tests/skills/<name>/` — integration tests of published skills. Their files are not named `*.test.ts`, so `bun test` never runs them.
- `.agents/skills/<name>/` — project skills: rules for maintaining this repository, not for publishing. `.claude/skills` is a symlink to this directory.
- `scripts/` — entry points of TypeScript wrappers for tools that cannot take an optional file list themselves. Their code lives in `scripts/common/<entity>/`. Unit tests sit next to the code as `*.test.ts`.
- `biome/` — GritQL plugins for Biome, one rule per file.
- `AGENTS.md` — instructions for agents; `CLAUDE.md` is a symlink to it.
- `README.md` — the landing page of the repository on GitHub, with a link to every published skill.

## Stack

- Bun as the runtime and package manager. Where Bun has an API, prefer it over the Node API.
- TypeScript 7.
- Biome formats and lints TypeScript and JSON.
- Prettier and markdownlint format and lint Markdown and YAML.

## Commands

Every script accepts an optional list of files; without arguments it processes the whole repository. File paths are relative to the repository root, since `bun run` starts scripts there. Exceptions: `code-typecheck`, and the `biome-ignore` guard of `code-lint`, which always scans the whole repository.

| Script | What it does |
| --- | --- |
| `bun run docs-format` | Fixes Markdown with markdownlint, then formats Markdown and YAML with Prettier. |
| `bun run docs-lint` | Checks Markdown with markdownlint and Markdown and YAML with Prettier. |
| `bun run code-format` | Formats TypeScript and JSON with Biome. |
| `bun run code-lint` | Fails on any `biome-ignore` comment, then runs `biome check`. |
| `bun run code-typecheck` | Type-checks the project with `tsc`. |
| `bun run code-test` | Runs the unit tests with `bun test`. |

## Conventions

- Everything in the repository is written in English.
- Before writing a new rule, check whether the current tools can automate it. Only what they cannot goes into a skill.
- Project skills are not sealed: they are extended after the owner reviews the agent's work.

## Project skills

Rules for maintaining this repository live in project skills, `.agents/skills/<name>/SKILL.md`. Each skill has a scope: a set of files. A file is covered by every skill whose scope contains it; scopes may be nested (`scripts/**` inside `**/*.ts`) or overlap (`skills/**` and `**/*.md`).

- Before changing a file, read every skill that covers it. At the end of a task, run the `## Checks` of every skill that covers a changed file.
- A rule goes into the smallest scope that contains every place it applies. When that is the overlap of two scopes, it goes into the scope defined by a directory rather than by a file type.
- A new scope gets its own skill, named after it, together with its first rule. There are no empty skills. Rules for the whole repository stay in this file.

| Skill            | Scope                     |
| ---------------- | ------------------------- |
| `typescript`     | `**/*.ts`                 |
| `scripts`        | `scripts/**`              |
| `json`           | `**/*.json`, `**/*.jsonc` |
| `package-json`   | `package.json`            |
| `markdown`       | `**/*.md`                 |
| `skills`         | `skills/**`               |
| `project-skills` | `.agents/skills/**`       |
