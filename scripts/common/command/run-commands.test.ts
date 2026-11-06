import { expect, test } from 'bun:test';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { runCommands } from './run-commands.ts';

test('all succeed: 0', async () => {
  const exitCode = await runCommands([['true'], ['true']]);

  expect(exitCode).toBe(0);
});

test('first fails, second still runs: 1', async () => {
  const marker = `${tmpdir()}/run-commands-${Date.now()}`;
  const exitCode = await runCommands([['false'], ['touch', marker]]);
  const markerExists = await Bun.file(marker).exists();

  await rm(marker, { force: true });

  expect(exitCode).toBe(1);
  expect(markerExists).toBe(true);
});

test('empty list: 0', async () => {
  const exitCode = await runCommands([]);

  expect(exitCode).toBe(0);
});
