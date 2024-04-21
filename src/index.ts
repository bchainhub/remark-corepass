import { type Node } from 'unist';
import { visit } from 'unist-util-visit';
import Ican from '@blockchainhub/ican';

interface CorepassOptions {
  /**
   * Enable ICAN check for CorePass.
   */
  enableIcanCheck?: boolean;
  /**
   * Enable skipping ICAN check with sign "!".
   */
  enableSkippingIcanCheck?: boolean;
}

interface ParentNode extends Node {
  children: Node[];
}

interface LinkNode extends Node {
  type: 'link';
  url: string;
  title: string | null;
  children: Array<TextNode>;
}

interface TextNode extends Node {
  type: 'text';
  value: string;
}

const makeLinkNode = (url: string, text: string, title?: string): LinkNode => ({
  type: 'link',
  url,
  title: title || null,
  children: [{ type: 'text', value: text }],
});

const makeTextNode = (text: string): TextNode => ({
  type: 'text',
  value: text,
});

const shortenId = (hash: string) => `${hash.slice(0, 4)}…${hash.slice(-4)}`;

const corepassPattern = /\[(!?)(((cb|ab|ce)[0-9]{2}[0-9a-f]{40})|((?:[a-z0-9_-]|\p{Emoji})+(?:\.(?:[a-z0-9_-]|\p{Emoji})+)*\.([a-z0-9]+)))@coreid\]/giu;

function isTextNode(node: Node): node is TextNode {
  return node.type === 'text';
}

/**
 * A remark plugin to parse CorePass IDs (Core ID) and convert them to links.
 * @param options - Options for the CorePass plugin.
 * @returns A transformer for the AST.
 */
export default function remarkCorepass(options: CorepassOptions = {}): (ast: Node) => void {
  const defaults: CorepassOptions = {
    enableIcanCheck: true, // Enable Ican check for CorePass
    enableSkippingIcanCheck: true, // Enable skipping Ican check with sign "!"
  };
  const finalOptions = { ...defaults, ...options };

  const transformer = (ast: Node): void => {
    visit(ast, 'text', (node, index, parent) => {
      if (!isTextNode(node) || !parent || typeof index !== 'number') return;
      const parentNode: ParentNode = parent as ParentNode;
      let newNodes: Node[] = [];
      let lastIndex = 0;

      const textNode: TextNode = node as TextNode;

      textNode.value.replace(corepassPattern, (
        match: string,
        skip: string,
        fullId: string,
        cpId: string,
        net0: string,
        sld: string,
        tld: string,
        offset: number
      ) => {
        if (offset > lastIndex) {
          newNodes.push(makeTextNode(textNode.value.slice(lastIndex, offset)));
        }
        let id = fullId as string;
        let willSkip = (finalOptions.enableSkippingIcanCheck) ? ((skip === '!') ? true : false) : false;
        let displayName, fullName;
        if (cpId !== '' && cpId !== undefined) {
          fullName = id.toUpperCase();
          displayName = shortenId(fullName);
          if (finalOptions.enableIcanCheck && !willSkip && !Ican.isValid(id, true)) {
            newNodes.push(makeTextNode(`¬${displayName}@coreid`));
          } else {
            newNodes.push(makeLinkNode(`corepass:${id.toLowerCase()}`, `${displayName}@coreid`, fullName));
          }
        } else {
          displayName = `${id}`;
          newNodes.push(makeLinkNode(`corepass:${id.toLowerCase()}`, `${displayName}@coreid`, displayName));
        }
        lastIndex = offset + match.length;
        return '';
      });

      if (lastIndex < textNode.value.length) {
        newNodes.push(makeTextNode(textNode.value.slice(lastIndex)));
      }
      if (newNodes.length > 0) {
        parentNode.children.splice(index, 1, ...newNodes);
      }
    });
  };
  return transformer;
}
