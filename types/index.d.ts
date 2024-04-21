import { Node } from 'unist';

declare module 'remark-corepass' {
  interface CorepassOptions {
    enableIcanCheck?: boolean;
    enableSkippingIcanCheck?: boolean;
  }

  export default function remarkCorepass(options?: CorepassOptions): (ast: Node) => void;
}
