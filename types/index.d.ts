import { Root } from 'mdast';

declare module 'remark-corepass' {
  interface CorepassOptions {
    enableIcanCheck?: boolean;
    enableSkippingIcanCheck?: boolean;
  }

  export default function remarkCorepass(options?: CorepassOptions): (ast: Root) => void;
}
