# Remark CorePass

This Remark plugin, "remark-corepass," is designed to transform CorePass notations into Markdown links (when positively checked) and negated text (when negatively checked), enhancing the integration of CorePass identifiers (Core ID) within markdown content.

## About Core ID

Core ID is a unique identifier used to reference Core Assets, such as documents, images, videos, and other digital assets, within the [CorePass ecosystem](https://corepass.net). The Core ID is composed of an [ICAN (International Crypto Asset Number)](https://cip.coreblockchain.net/sk-SK/cip/cbc/cip-100) and an checksum, which can be used to validate the identifier.

## Installation

You can install the plugin using npm or yarn:

```bash
npm install remark-corepass
```

Or:

```bash
yarn add remark-corepass
```

## Usage

Integrate the plugin into your Remark processing pipeline to automatically convert CorePass notations and optionally validate ICAN (International Crypto Asset Number) identifiers:

```typescript
import remark from 'remark';
import remarkCorepass from 'remark-corepass';

(async () => {
  try {
    const file = await remark()
      .use(remarkCorepass, { enableIcanCheck: true })
      .process('Your markdown text here');
    console.log(String(file));
  } catch (err) {
    console.error(err);
  }
})();
```

The plugin searches for CorePass notations in the format `[domain@coreid]` or `[!cb1234...@coreid]` in your markdown content, converting them to links and optionally validating ICAN identifiers, displaying invalid items as text.

## Options

- `enableIcanCheck`: Enables ICAN validation for identifiers (default: `true`).
- `enableSkippingIcanCheck`: Allows skipping ICAN validation with a leading "!" in the notation (default: `true`).

## Features

- **ICAN Validation:** Optional validation of ICAN identifiers.
- **Flexible Configuration:** Customizable through options to meet various use cases.
- **Seamless Integration:** Designed to fit effortlessly into existing Remark pipelines.

## Contributing

Contributions are welcome! Please submit pull requests or open issues to help improve the plugin.

## License

This project is licensed under the CORE License - see the [LICENSE](LICENSE) file for details.
