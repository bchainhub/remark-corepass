import { visit } from 'unist-util-visit';
import Ican from '@blockchainhub/ican';
const makeLinkNode = (url, text, title) => ({
    type: 'link',
    url,
    title: title || null,
    children: [{ type: 'text', value: text }],
});
const makeTextNode = (text) => ({
    type: 'text',
    value: text,
});
const shortenId = (hash) => `${hash.slice(0, 4)}…${hash.slice(-4)}`;
const corepassPattern = /\[(!?)(((cb|ab|ce)[0-9]{2}[0-9a-f]{40})|((?:[a-z0-9_-]|\p{Emoji})+(?:\.(?:[a-z0-9_-]|\p{Emoji})+)*\.([a-z0-9]+)))@coreid\]/giu;
function isTextNode(node) {
    return node.type === 'text';
}
export default function remarkCorepass(options = {}) {
    const defaults = {
        enableIcanCheck: true,
        enableSkippingIcanCheck: true,
    };
    const finalOptions = { ...defaults, ...options };
    const transformer = (ast) => {
        visit(ast, 'text', (node, index, parent) => {
            if (!isTextNode(node) || !parent || typeof index !== 'number')
                return;
            const parentNode = parent;
            let newNodes = [];
            let lastIndex = 0;
            const textNode = node;
            textNode.value.replace(corepassPattern, (match, skip, fullId, cpId, net0, sld, tld, offset) => {
                if (offset > lastIndex) {
                    newNodes.push(makeTextNode(textNode.value.slice(lastIndex, offset)));
                }
                let id = fullId;
                let willSkip = (finalOptions.enableSkippingIcanCheck) ? ((skip === '!') ? true : false) : false;
                let displayName, fullName;
                if (cpId !== '' && cpId !== undefined) {
                    fullName = id.toUpperCase();
                    displayName = shortenId(fullName);
                    if (finalOptions.enableIcanCheck && !willSkip && !Ican.isValid(id, true)) {
                        newNodes.push(makeTextNode(`¬${displayName}@coreid`));
                    }
                    else {
                        newNodes.push(makeLinkNode(`corepass:${id.toLowerCase()}`, `${displayName}@coreid`, fullName));
                    }
                }
                else {
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
