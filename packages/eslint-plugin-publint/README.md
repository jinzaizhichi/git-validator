# eslint-plugin-publint

[![](https://img.shields.io/npm/l/eslint-plugin-publint.svg)](https://github.com/zanminkian/git-validator/blob/main/LICENSE)
[![](https://img.shields.io/npm/v/eslint-plugin-publint.svg)](https://www.npmjs.com/package/eslint-plugin-publint)
[![](https://img.shields.io/npm/dm/eslint-plugin-publint.svg)](https://www.npmjs.com/package/eslint-plugin-publint)
[![](https://packagephobia.com/badge?p=eslint-plugin-publint)](https://packagephobia.com/result?p=eslint-plugin-publint)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

ESLint plugin for [publint](https://www.npmjs.com/package/publint)

## Preview

![preview](https://raw.githubusercontent.com/zanminkian/static/main/git-validator/eslint-plugin-publint-preview.png)

## Requirement

- ESLint >= 8.57.0

## Usage

Install

```sh
npm i -D eslint eslint-plugin-publint
```

Config `eslint.config.js`

```js
import * as publint from "eslint-plugin-publint";

export default [
  {
    files: ["**/package.json"],
    processor: "publint/processor",
    plugins: { publint },
    rules: {
      /**
       * The 'suggestion' type messages created by publint will cause eslint warns
       */
      "publint/suggestion": "warn",
      /**
       * The 'warning' type messages created by publint will cause eslint warns
       */
      "publint/warning": "warn",
      /**
       * The 'error' type messages created by publint will cause eslint errors
       */
      "publint/error": "error",
    },
  },
];
```

Config `package.json`

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## License

MIT
