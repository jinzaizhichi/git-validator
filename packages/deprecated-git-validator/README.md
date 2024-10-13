<h1 align="center">📈 git-validator</h1>

<p align="center"> <b>Git</b> hooks and code style <b>Validator</b> </p>

<p align="center"> English | <a href="https://github.com/zanminkian/git-validator/blob/main/packages/git-validator/README.zh-CN.md">简体中文</a> </p>

<p align="center">
<a href="https://github.com/zanminkian/git-validator/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/git-validator.svg"/></a>
<a href="https://www.npmjs.com/package/git-validator"><img src="https://img.shields.io/npm/v/git-validator.svg"/></a>
<a href="https://www.npmjs.com/package/git-validator"><img src="https://img.shields.io/npm/dm/git-validator.svg"/></a>
<a href="https://packagephobia.com/result?p=git-validator"><img src="https://packagephobia.com/badge?p=git-validator"/></a>
<a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
</p>

## Features

This is a cli tool with following features.

- Check code style (using ESLint and Prettier under the hood).
- Provide the strictest `tsconfig` and type guard preset for TypeScript project.
- Set up git hooks to automatically check code style.

## Highlights

- 🔧 **Zero Configuration**: **ZERO** configuration file is needed, while still allowing customization of `eslint` and `prettier` rules.
- 📦 **Unified package**: Just **ONE** npm package to install, replacing multiple. You don't need `eslint`, `prettier`, `lint-staged` any more.
- 🚀 **Simple to use**: **TWO** core commands: `git-validator -u` and `git-validator install`.

## Quick Start

Run this command in your project to check the codebase code style.

```sh
npx git-validator
```

Usually, we recommend you to install it and set it up in your project. Please continue reading the document below.

## Install

Run command below in **the root of your project** to install this tool.

```bash
npm install -D git-validator
```

## Usage

### Basic

Edit `package.json > prepare` script and run it once.

```json
{
  "scripts": {
    "prepare": "git-validator install",
    "style": "git-validator", // Run this to check the whole project code style
    "style:update": "git-validator -u" // Run this to check the whole project code style and apply fixes
  }
}
```

```sh
npm run prepare
```

After running `git-validator install`, each commit (using Git) will check the committed files' code style.

Powered by [@git-validator/eslint-config](https://www.npmjs.com/package/@git-validator/eslint-config), we now support `.js` / `.mjs` / `.cjs` / `.jsx` / `.ts` / `.mts` / `.cts` / `.tsx` / `package.json` by default.

### Setup `tsconfig.json`

This tool has integrated [@git-validator/tsconfig](https://www.npmjs.com/package/@git-validator/tsconfig). Optionally, you can setup `tsconfig.json` using `git-validator/tsconfig` if you like. It provides a more consistent development experience.

```json
// tsconfig.json
{
  "extends": "git-validator/tsconfig"
}
```

For more best practices, please refer to the [document](https://www.npmjs.com/package/@git-validator/tsconfig) of `@git-validator/tsconfig`.

### Customizing Linting & Formatting Rules

The default linting rule is [@git-validator/eslint-config](https://www.npmjs.com/package/@git-validator/eslint-config) and the default formatting rule is [@git-validator/prettier-config](https://www.npmjs.com/package/@git-validator/prettier-config). You can add `eslint.config.js` and `prettier.config.js` in the root of project to apply your own linting & formatting rules.

`eslint.config.js` example.

```js
// You can also install and use other eslint config preset, like `@sxzz/eslint-config`.
import { Builder } from "@git-validator/eslint-config";

export default new Builder()
  .enableJavascript()
  .enableTypescript({
    omit: ["no-var"], // Omit the rules as you want
  })
  .toConfig();
```

`prettier.config.js` example.

```js
import config from "@git-validator/prettier-config";

export default {
  ...config,
  printWidth: 120,
};
```

By default, you don't need `.eslintignore` and `.prettierignore` files in the root of project.

> We recommend you to use this tool in zero configs. If you have better suggestions about linting and formatting rules, please submit the issue or PR. Any reasonable suggestions are welcome!

### Customizing `lint-staged.config.js`

When you commit your code, each file will be linted & formatted by `npx git-validator -w` command. You can change this rule by adding a `lint-staged.config.js` file in the root of your project. Here is an example.

```js
// This config means js files will be linted & formatted and md files will formatted only.
export default {
  "*.js": "npx git-validator -u",
  "*.md": "npx git-validator format -u",
};
```

## Advanced Usage

### Skipping linting or formatting on `pre-commit` stage

When you commit you code, it will lint (using `eslint`) code first and then format (using `prettier`) code. If you want to skip one of them, you can pass `--no-lint` or `--no-format` option when running `git install`.

```json
{
  "scripts": {
    // it will not lint code and will only format code when you commit your code
    "prepare": "git-validator install --no-lint"
  }
}
```

```json
{
  "scripts": {
    // it will not format code and will only lint code when you commit your code
    "prepare": "git-validator install --no-format"
  }
}
```

### Working with `husky`

This library can work as a standalone package. However, if you have Husky 5 or a later version installed and you have run `git-validator install`, you should add `.husky/pre-commit` file:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

.git/hooks/pre-commit $1
```

## Contributing

- Clone this repository.
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`.
- Install dependencies using `pnpm install`.
- Run `pnpm style:update` to develop.
- Start coding and submit your PR.

## Show your support

Give a ⭐️ if this project helped you!

## License

MIT
