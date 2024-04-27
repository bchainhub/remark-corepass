import { Root } from 'mdast';
interface CorepassOptions {
    enableIcanCheck?: boolean;
    enableSkippingIcanCheck?: boolean;
}
export default function remarkCorepass(options?: CorepassOptions): (tree: Root) => void;
export {};
