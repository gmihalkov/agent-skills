import { realpathSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import type { File } from './file.ts';

/**
 * Brings a value to the path of the file it names, relative to the working directory.
 *
 * @param value - Command-line value.
 * @returns The path with symbolic links resolved; a missing path is only normalized.
 */
const toFile = (value: string): File => {
  const path =
    statSync(value, { throwIfNoEntry: false }) === undefined ? resolve(value) : realpathSync(value);

  return relative(process.cwd(), path);
};

/**
 * Selects files from command-line values.
 *
 * @param values - Command-line values.
 * @param extensions - Accepted extensions, including the leading dot;
 *   all files are accepted when omitted.
 * @returns Unique paths relative to the working directory, in the order of first occurrence.
 *   Directories are dropped; missing files are kept, since a command may create them.
 */
export const selectFiles = (values: readonly string[], extensions?: readonly string[]): File[] => {
  const nonDirectories = values.filter(
    (value) => statSync(value, { throwIfNoEntry: false })?.isDirectory() !== true,
  );

  const files = nonDirectories.map(toFile);

  const matching = files.filter(
    (file) => extensions === undefined || extensions.some((extension) => file.endsWith(extension)),
  );

  return [...new Set(matching)];
};
