import { afterAll, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { selectFiles } from './select-files.ts';

const dir = realpathSync(mkdtempSync(join(tmpdir(), 'select-files-')));

afterAll(() => {
  rmSync(dir, { force: true, recursive: true });
});

test('extensions: keeps files with a listed extension, in their original order', () => {
  expect(selectFiles(['b.yml', 'a.md', 'c.ts', 'd.yaml'], ['.md', '.yml', '.yaml'])).toEqual([
    'b.yml',
    'a.md',
    'd.yaml',
  ]);
});

test('extensions: the extension must end the path', () => {
  expect(selectFiles(['a.md.bak', 'md'], ['.md'])).toEqual([]);
});

test('no extensions: keeps every file', () => {
  expect(selectFiles(['a.md', 'c.ts'])).toEqual(['a.md', 'c.ts']);
});

test('missing files: kept, as paths relative to the working directory', () => {
  const missing = join(dir, 'missing.md');

  expect(selectFiles([missing, './a.md'])).toEqual([relative(process.cwd(), missing), 'a.md']);
});

test('directories: dropped', () => {
  const folder = join(dir, 'folder');

  mkdirSync(folder);

  expect(selectFiles([folder])).toEqual([]);
});

test('symbolic link with its target: resolved to one target path', async () => {
  const target = join(dir, 'target.md');
  const link = join(dir, 'link.md');

  await Bun.write(target, '');
  symlinkSync(target, link);

  expect(selectFiles([link, target])).toEqual([relative(process.cwd(), target)]);
});

test('duplicates: the first occurrence is kept', () => {
  expect(selectFiles(['a.md', 'b.md', './a.md'])).toEqual(['a.md', 'b.md']);
});
