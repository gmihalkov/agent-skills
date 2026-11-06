---
name: scripts
description: Rules for every file under `scripts/` (`scripts/**`). Use before adding, moving or changing a file there.
metadata:
  internal: true
---

# Scripts

Before writing a helper, look through `scripts/common/`. If an operation that does the job already exists, use it.

## Entry points

The root of `scripts/` holds only entry points: files that `package.json` runs. An entry point is its imports plus exactly one statement, `await main(...)`. `main` is the error boundary of every script: it is the only place where script errors are caught.

The handler passed to `main` is the transport layer. It brings the raw command-line arguments to the input of operations from `scripts/common/`, chooses which operations to run depending on that input, and turns their result into the result of the script. It declares no module-level functions or constants; a value it needs belongs to an entity in `scripts/common/`. For example, the docs scripts check the whole repository without arguments and only the given docs otherwise:

```ts
import { runCommands } from './common/command/run-commands.ts';
import { buildDocsCommands } from './common/doc/build-docs-commands.ts';
import { selectDocs } from './common/doc/select-docs.ts';
import { main } from './common/main/main.ts';

await main((args) =>
  runCommands(
    buildDocsCommands(
      args.length === 0 ? { mode: 'lint' } : { files: selectDocs(args), mode: 'lint' },
    ),
  ),
);
```

## Entities

All other code lives in `scripts/common/<entity>/`. A folder holds one main entity, named in the singular, and its satellites: entities that mean nothing without the main one. A satellite moves to its own folder once code unrelated to the main entity uses it.

- Each entity has a declaration file `<entity>.ts` with its type, even when the type is an alias such as `type Command = readonly string[]`. An entity that is itself an operation, such as `main`, has no separate declaration: its file is the declaration.
- An operation lives in the folder of the most specific entity it is about: the one it builds, changes or runs. A function that runs any list of commands belongs to `command/`; one that builds the docs tools' commands belongs to `doc/`.
- A helper or type with one consumer stays private in that consumer's file. Code that a second script will need becomes a public operation of its entity right away.
- Tests sit next to the operation as `<operation>.test.ts`.
- Entities may import each other.

The `biome/entity-file-name.grit` plugin checks that every file name contains its folder's name and that `scripts/common/` has exactly one level of folders.
