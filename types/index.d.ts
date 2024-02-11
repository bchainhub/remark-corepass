import { Node } from 'unist';

declare module 'remark-corepass' {
  interface CorepassOptions {
    enableIcanCheck?: boolean;
    enableSkippingIcanCheck?: boolean;
  }

  function remarkCorepass(options?: CorepassOptions): (ast: Node) => void;

  export = remarkCorepass;
}
