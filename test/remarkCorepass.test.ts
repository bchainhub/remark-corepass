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

const CorePassHandlers = suite('CorePass handlers');

CorePassHandlers('Transforms CoreID link', async () => {
  const input = '[cb7147879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /\[CB71…5999@cp\]\(corepass:cb7147879011ea207df5b35a24ca6f0859dcfb145999 "CB71…5999"\)/);
});

CorePassHandlers('Transforms CoreID link w/ bad checksum & w/o ican check', async () => {
  const input = '[!cb7247879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /\[CB72…5999@cp\]\(corepass:cb7247879011ea207df5b35a24ca6f0859dcfb145999 "CB72…5999"\)/);
});

CorePassHandlers('Transforms CoreID link w/ bad checksum & w/ ican check', async () => {
  const input = '[cb7247879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /~~CB72…5999@cp~~/);
});

CorePassHandlers('Transforms CoreID link as domain pattern', async () => {
  const input = '[sub.domain.cc@cp]';
  const output = await processMarkdown(input);
  assert.match(output, /\[sub.domain.cc@cp\]\(corepass:sub.domain.cc "sub.domain.cc"\)/);
});

CorePassHandlers('Transforms CoreID link as emoji domain pattern', async () => {
  const input = '[emoji🎉domain.cc@cp]';
  const output = await processMarkdown(input);
  assert.match(output, /\[emoji🎉domain.cc@cp\]\(corepass:emoji🎉domain.cc "emoji🎉domain.cc"\)/);
});

CorePassHandlers('Transforms CoreID link defined with round brackets', async () => {
  const input = '[cb7147879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /\[CB71…5999@cp\]\(corepass:cb7147879011ea207df5b35a24ca6f0859dcfb145999 "CB71…5999"\)/);
});

CorePassHandlers('Transforms CoreID link defined with round brackets, w/o ican check and w/ bad checksum', async () => {
  const input = '[!cb7247879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /\[CB72…5999@cp\]\(corepass:cb7247879011ea207df5b35a24ca6f0859dcfb145999 "CB72…5999"\)/);
});

CorePassHandlers('Transforms CoreID link defined with round brackets, w/ ican check and w/ bad checksum', async () => {
  const input = '[cb7247879011ea207df5b35a24ca6f0859dcfb145999@cp]';
  const output = await processMarkdown(input, { enableIcanCheck: true });
  assert.match(output, /~~CB72…5999@cp~~/);
});

CorePassHandlers.run();
