import type { Command } from '../command/command.ts';
import { selectFiles } from '../file/select-files.ts';
import type { Doc } from './doc.ts';
import { DOC_EXTENSIONS } from './doc-extensions.ts';

/** Which tools' modes to use: fix files in place or only report problems. */
type Mode = 'format' | 'lint';

/** Input of {@link buildDocsCommands}. */
type Options = {
  /** Docs to process; the whole repository when omitted. */
  files?: readonly Doc[];

  /** Whether to fix files or only check them. */
  mode: Mode;
};

/** Program name of markdownlint. */
const MARKDOWNLINT = 'markdownlint-cli2';

/** Program name of Prettier. */
const PRETTIER = 'prettier';

/** Argument after which markdownlint takes every argument as a literal path, not a glob. */
const END_OF_GLOBS = '--';

/** Extensions of files that markdownlint checks. */
const MARKDOWN_EXTENSIONS = ['.md'];

/** markdownlint flags for each mode. */
const MARKDOWNLINT_FLAGS: Record<Mode, string[]> = { format: ['--fix'], lint: [] };

/** Prettier flags for each mode. */
const PRETTIER_FLAGS: Record<Mode, string[]> = { format: ['--write'], lint: ['--check'] };

/**
 * Builds a glob for every file with one of the extensions; a brace list needs at least two items.
 *
 * @param extensions - Extensions with the leading dot.
 * @returns Glob over the whole repository.
 */
const toGlob = (extensions: readonly string[]): string => {
  const names = extensions.map((extension) => extension.slice(1));

  return names.length === 1 ? `**/*.${names[0]}` : `**/*.{${names.join(',')}}`;
};

/**
 * Builds the markdownlint and Prettier command lines for the docs scripts.
 *
 * @param options - Files to process and the mode.
 * @returns Argument vectors in run order; a tool with no matching files is omitted.
 */
export const buildDocsCommands = ({ files, mode }: Options): Command[] => {
  if (files === undefined) {
    return [
      [MARKDOWNLINT, ...MARKDOWNLINT_FLAGS[mode], toGlob(MARKDOWN_EXTENSIONS)],
      [PRETTIER, ...PRETTIER_FLAGS[mode], toGlob(DOC_EXTENSIONS)],
    ];
  }

  const markdownFiles: Doc[] = selectFiles(files, MARKDOWN_EXTENSIONS);
  const commands: Command[] = [];

  if (markdownFiles.length > 0) {
    commands.push([MARKDOWNLINT, ...MARKDOWNLINT_FLAGS[mode], END_OF_GLOBS, ...markdownFiles]);
  }

  if (files.length > 0) {
    commands.push([PRETTIER, ...PRETTIER_FLAGS[mode], ...files]);
  }

  return commands;
};
