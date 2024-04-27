import { Link, Node, Parent, Root, RootContent, Text } from 'mdast';
import { visit } from 'unist-util-visit';
import Ican from '@blockchainhub/ican';

interface CorepassOptions {
  enableIcanCheck?: boolean;
  enableSkippingIcanCheck?: boolean;
}

const makeLinkNode = (url: string, text: string, title?: string): Link => ({
  type: 'link',
  url,
  title: title || null,
  children: [{ type: 'text', value: text }],
});

const makeTextNode = (text: string): Text => ({
  type: 'text',
  value: text,
});

const shortenId = (hash: string) => `${hash.slice(0, 4)}…${hash.slice(-4)}`;

const corepassPattern = /\[(!?)(((cb|ab|ce)[0-9]{2}[0-9a-f]{40})|((?:[a-z0-9_-]|\p{Emoji})+(?:\.(?:[a-z0-9_-]|\p{Emoji})+)*\.([a-z0-9]+)))@coreid\]/giu;

const isTextNode = (node: Node): node is Text => node.type === 'text';

export default function remarkCorepass(options: CorepassOptions = {}): (tree: Root) => void {
  const defaults: CorepassOptions = {
    enableIcanCheck: true,
    enableSkippingIcanCheck: true,
  };
  const finalOptions = { ...defaults, ...options };

  return (tree: Node): void => {
    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!isTextNode(node) || !parent || typeof index !== 'number') return;
      if (!('children' in parent) || !Array.isArray((parent as Parent).children)) return;

      const matches = Array.from(node.value.matchAll(corepassPattern));
      const newNodes: RootContent[] = [];

      let lastIndex = 0;
      matches.forEach(match => {
        const [
          fullMatch,
          skip,
          fullId,
          cpId,
          net0,
          sld,
          tld,
          offset = 0
        ] = match;
        const actualOffset = parseInt(offset as any, 10);
        if (actualOffset > lastIndex) {
          newNodes.push(makeTextNode(node.value.slice(lastIndex, actualOffset)));
        }

        const willSkip = finalOptions.enableSkippingIcanCheck && skip === '!';
        const url = `corepass:${fullId.toLowerCase()}`;
        let fullName, displayName;

        if (cpId !== '' && cpId !== undefined) {
          fullName = fullId.toUpperCase();
          displayName = shortenId(fullName);
          if (finalOptions.enableIcanCheck && !willSkip && !Ican.isValid(fullId, true)) {
            newNodes.push(makeTextNode(`¬${displayName}@coreid`));
          } else {
            newNodes.push(makeLinkNode(url, `${displayName}@coreid`, fullName));
          }
        } else {
          newNodes.push(makeLinkNode(url, `${fullId}@coreid`, fullId));
        }

        lastIndex = actualOffset + fullMatch.length;
      });

      if (lastIndex < node.value.length) {
        newNodes.push(makeTextNode(node.value.slice(lastIndex)));
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
