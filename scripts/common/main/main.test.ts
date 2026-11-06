import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { main } from './main.ts';

afterEach(() => {
  process.exitCode = 0;
  mock.restore();
});

test('passes command-line arguments and sets the returned exit code', async () => {
  let receivedArgs: readonly string[] = [];

  await main((args) => {
    receivedArgs = args;

    return Promise.resolve(3);
  });

  expect(receivedArgs).toEqual(Bun.argv.slice(2));
  expect(process.exitCode).toBe(3);
});

test('thrown error: prints the cause chain and exits with 1', async () => {
  const consoleError = spyOn(console, 'error').mockImplementation(() => undefined);
  const cause = new Error('spawn ENOENT');

  await main(() => Promise.reject(new Error('Cannot run prettier', { cause })));

  expect(consoleError).toHaveBeenCalledWith('Cannot run prettier: spawn ENOENT');
  expect(process.exitCode).toBe(1);
});

test('cyclic cause chain: prints each error once', async () => {
  const consoleError = spyOn(console, 'error').mockImplementation(() => undefined);
  const outer = new Error('outer');
  const inner = new Error('inner', { cause: outer });

  outer.cause = inner;
  await main(() => Promise.reject(outer));

  expect(consoleError).toHaveBeenCalledWith('outer: inner');
  expect(process.exitCode).toBe(1);
});

test('error caused by itself: prints its message once', async () => {
  const consoleError = spyOn(console, 'error').mockImplementation(() => undefined);
  const error = new Error('boom');

  error.cause = error;
  await main(() => Promise.reject(error));

  expect(consoleError).toHaveBeenCalledWith('boom');
});
