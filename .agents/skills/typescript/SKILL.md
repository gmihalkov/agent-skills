---
name: typescript
description: Rules for every TypeScript file in this repository (`**/*.ts`) that Biome and tsc do not check. Use before creating or changing any `.ts` file.
metadata:
  internal: true
---

# TypeScript

These rules cover only what the tools do not check; Biome and `tsc` enforce the rest.

## Documentation

- Write TSDoc for every top-level declaration and every class member.
- Functions document `@param`, `@returns`, and `@throws` when throwing is part of the contract.
- A caller that does not catch a documented `@throws` documents it too.
- Do not write types in tags (`{Type}`).
- `@inheritDoc` is allowed.
- When only a description (or a lone `@inheritDoc`) fits, use a single line: `/** Text. */`.
- Keep comment lines within 100 characters.
- Do not write inline comments: extract intermediate values into well-named variables instead.

## Naming

- Function and method names use no phrasal verbs (`kickoffMessages`, `scaleUpCluster`).
- Use the simplest verb vocabulary: `get`, `set`, `fetch`, `update`, `delete`, …
- Name module-level constants in `CONSTANT_CASE`. Biome cannot enforce this: its naming rule cannot tell a constant from an arrow function at module level.

## Files

- One export per file, types included.
- The file name, in kebab-case, matches the export.
- `export const` is the last statement.
- Order the file bottom-up: imports, types, constants, private functions, the export.

## Layout

- An object literal fits on one line only with at most two properties and no nested object. Arrays do not add a level; objects inside arrays do. Otherwise write it on several lines. Leave arrays to the formatter.
- Put a blank line before and after every control-flow statement (`if`, `for`, `switch`, `throw`, `return`, …) and every statement that spans several lines after formatting.
- Never put a blank line at the start or end of a block.
- `else` and `catch` belong to their statement: no blank line before them.
- Separate consecutive multi-line statements with one blank line.
- Always separate top-level declarations with a blank line.

## Behavior

- Throw `new Error(message, { cause })`.
- Catch errors only at the boundary, where an error becomes a message for the user. The skill whose scope covers the code names its boundary.
- Express absence with `undefined` and `?:`; use `null` only when an external API returns it.
- Pass a boolean parameter only as a field of an options object.
- Return early: preconditions and errors first, the main path without nesting.
- Put non-obvious literals (thresholds, timeouts, exit codes, repeated strings) into named `CONSTANT_CASE` constants.

## Biome

- Never suppress or loosen Biome rules: no `biome-ignore` comments, no edits to `biome.json` to silence a rule.
- When code exceeds the complexity limit, refactor it.

## Checks

- [ ] `bun run code-lint`, `bun run code-typecheck` and `bun run code-test` pass.
