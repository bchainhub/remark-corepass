import { type Node } from 'unist';
interface CorepassOptions {
    enableIcanCheck?: boolean;
    enableSkippingIcanCheck?: boolean;
}
export default function remarkCorepass(options?: CorepassOptions): (ast: Node) => void;
export {};
