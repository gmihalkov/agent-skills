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
