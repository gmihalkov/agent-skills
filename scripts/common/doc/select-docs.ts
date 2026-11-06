import { selectFiles } from '../file/select-files.ts';
import type { Doc } from './doc.ts';
import { DOC_EXTENSIONS } from './doc-extensions.ts';

/**
 * Selects docs from command-line values.
 *
 * @param values - Command-line values.
 * @returns Unique doc paths, as {@link selectFiles} returns them.
 */
export const selectDocs = (values: readonly string[]): Doc[] => selectFiles(values, DOC_EXTENSIONS);
