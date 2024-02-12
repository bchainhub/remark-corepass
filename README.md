# Remark CorePass

This Remark plugin, "remark-corepass," is designed to transform CorePass notations into markdown links, enhancing the integration of blockchain-based identifiers and Fediverse handles within markdown content.

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

Integrate the plugin into your Remark processing pipeline to automatically convert CorePass notations and optionally validate ICAN (International Core Asset Number) identifiers:

```javascript
const remark = require('remark');
const remarkCorepass = require('remark-corepass');

remark()
  .use(remarkCorepass, { enableIcanCheck: true })
  .process('Your markdown text here', (err, file) => {
    if (err) throw err;
    console.log(String(file));
  });
```

The plugin searches for CorePass notations in the format `[domain@coreid]` or `[!cb1234...@coreid]` in your markdown content, converting them into clickable links and validating ICAN identifiers when enabled.

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
