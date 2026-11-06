import { expect, test } from 'bun:test';
import { buildDocsCommands } from './build-docs-commands.ts';

test('whole repository, format: globs for both tools, markdownlint first', () => {
  expect(buildDocsCommands({ mode: 'format' })).toEqual([
    ['markdownlint-cli2', '--fix', '**/*.md'],
    ['prettier', '--write', '**/*.{md,yml,yaml}'],
  ]);
});

test('whole repository, lint: check modes', () => {
  expect(buildDocsCommands({ mode: 'lint' })).toEqual([
    ['markdownlint-cli2', '**/*.md'],
    ['prettier', '--check', '**/*.{md,yml,yaml}'],
  ]);
});

test('docs: markdown to both tools, yaml to prettier only', () => {
  const files = ['a.md', 'b.yml', 'd.yaml'];

  expect(buildDocsCommands({ files, mode: 'lint' })).toEqual([
    ['markdownlint-cli2', '--', 'a.md'],
    ['prettier', '--check', 'a.md', 'b.yml', 'd.yaml'],
  ]);
});

test('only yaml: markdownlint skipped', () => {
  expect(buildDocsCommands({ files: ['b.yml'], mode: 'format' })).toEqual([
    ['prettier', '--write', 'b.yml'],
  ]);
});

test('empty docs: nothing to run', () => {
  expect(buildDocsCommands({ files: [], mode: 'lint' })).toEqual([]);
});

test('docs, format: markdownlint takes the files literally, after its flags', () => {
  expect(buildDocsCommands({ files: ['[draft].md'], mode: 'format' })).toEqual([
    ['markdownlint-cli2', '--fix', '--', '[draft].md'],
    ['prettier', '--write', '[draft].md'],
  ]);
});
