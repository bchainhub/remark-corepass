import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
// @ts-ignore
import remarkCorepass from 'remark-corepass';

const processMarkdown = async (markdown: string, options: Record<string, any> = {}) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkCorepass, options)
    .use(remarkStringify)
    .process(markdown);
  return result.toString();
};

const normalizeString = (str: string) => str.trim();

const CorePassHandlers = suite('CorePass handlers');

CorePassHandlers('Transforms CoreID link', async () => {
  const input = '[cb7147879011ea207df5b35a24ca6f0859dcfb145999@coreid]';
  const output = normalizeString(await processMarkdown(input, { enableIcanCheck: true }));
  const expected = '[CB71…5999@coreid](corepass:cb7147879011ea207df5b35a24ca6f0859dcfb145999 "CB7147879011EA207DF5B35A24CA6F0859DCFB145999")';
  assert.is(output, expected);
});

CorePassHandlers('Transforms CoreID link w/ bad checksum & w/o ican check', async () => {
  const input = '[!cb7247879011ea207df5b35a24ca6f0859dcfb145999@coreid]';
  const output = normalizeString(await processMarkdown(input, { enableIcanCheck: true }));
  const expected = '[CB72…5999@coreid](corepass:cb7247879011ea207df5b35a24ca6f0859dcfb145999 "CB7247879011EA207DF5B35A24CA6F0859DCFB145999")';
  assert.is(output, expected);
});

CorePassHandlers('Transforms CoreID link as domain pattern', async () => {
  const input = '[sub.domain.cc@coreid]';
  const output = normalizeString(await processMarkdown(input));
  const expected = '[sub.domain.cc@coreid](corepass:sub.domain.cc "sub.domain.cc")';
  assert.is(output, expected);
});

CorePassHandlers('Transforms CoreID link as emoji domain pattern', async () => {
  const input = '[emoji🎉domain.cc@coreid]';
  const output = normalizeString(await processMarkdown(input));
  const expected = '[emoji🎉domain.cc@coreid](corepass:emoji🎉domain.cc "emoji🎉domain.cc")';
  assert.is(output, expected);
});

CorePassHandlers('Transforms CoreID link defined with round brackets', async () => {
  const input = '[cb7147879011ea207df5b35a24ca6f0859dcfb145999@coreid]';
  const output = normalizeString(await processMarkdown(input, { enableIcanCheck: true }));
  const expected = '[CB71…5999@coreid](corepass:cb7147879011ea207df5b35a24ca6f0859dcfb145999 "CB7147879011EA207DF5B35A24CA6F0859DCFB145999")';
  assert.is(output, expected);
});

CorePassHandlers('Transforms CoreID link defined with round brackets, w/o ican check and w/ bad checksum', async () => {
  const input = '[!cb7247879011ea207df5b35a24ca6f0859dcfb145999@coreid]';
  const output = normalizeString(await processMarkdown(input, { enableIcanCheck: true }));
  const expected = '[CB72…5999@coreid](corepass:cb7247879011ea207df5b35a24ca6f0859dcfb145999 "CB7247879011EA207DF5B35A24CA6F0859DCFB145999")';
  assert.is(output, expected);
});

CorePassHandlers('Invalid CoreID link defined with round brackets', async () => {
  const input = '[cb7047879011ea207df5b35a24ca6f0859dcfb145999@coreid]';
  const output = normalizeString(await processMarkdown(input, { enableIcanCheck: true }));
  const expected = '¬CB70…5999@coreid';
  assert.is(output, expected);
});

CorePassHandlers.run();
