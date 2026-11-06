import { expect, test } from 'bun:test';
import { selectDocs } from './select-docs.ts';

test('keeps Markdown and YAML files', () => {
  expect(selectDocs(['a.md', 'c.ts', 'b.yml', 'd.yaml'])).toEqual(['a.md', 'b.yml', 'd.yaml']);
});
