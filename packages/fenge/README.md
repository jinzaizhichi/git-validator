<div align="center">

<span style="font: 100pt song !important;">😎</span>

# Fenge(风格)

> A CLI tool for code quality.

<font size=4> 😎 = 🇹 + 💃 + 📏 </font>

[![](https://img.shields.io/npm/l/fenge.svg)](https://github.com/zanminkian/fenge/blob/main/LICENSE)
[![](https://img.shields.io/npm/v/fenge.svg)](https://www.npmjs.com/package/fenge)
[![](https://img.shields.io/npm/dm/fenge.svg)](https://www.npmjs.com/package/fenge)
[![](https://packagephobia.com/badge?p=fenge)](https://packagephobia.com/result?p=fenge)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

</div>

---

## Philosophy

<details>
<summary>简体中文</summary>

经过多年实践，我们发现衡量现代 JavaScript 工程的代码质量，主要有 3 个方面：

- **类型安全**：用于提前发现类型、拼写错误，例如对象方法是否正确调用、函数参数传递的类型是否符合函数体的期望等。
- **Formatting**：用于统一格式，提升代码可读性，减少代码冲突。主要关注例如缩进、换行、单/双引号、带/不带分号等问题。
- **Linting**：用于提前发现逻辑漏洞和糟粕用法，减少 Bug，降低维护成本。其关注点可以是除了 `Formatting` 之外的任何地方，例如重复定义变量、switch 不带 break、圈复杂度等。

> Note: `类型安全` 和 `Linting` 的关注点可能存在一定的交集，例如：“函数入参数量对不上”，既可能被类型安全的工具（如 TypeScript）检测到，也可能被 Linter（如 ESLint）检测出来。

> Note：`Formatting` 和 `Linting` 的关注点，原则上不存在交集。早期 ESLint 也被用于格式化，但是近年来，`Linter` 和 `Formatter` 分开已经被社区越来越广泛采纳，例如[ESLint 废弃 Formatting Rules](https://eslint.org/blog/2023/10/deprecating-formatting-rules)、Deno 和 Biome 均把 `Linter` 和 `Formatter` 分开。
>
> 有些人会将后两者 `Formatting` 和 `Linting` 合并起来一并处理，例如 [@antfu/eslint-config](https://github.com/antfu/eslint-config)。我们强烈**不建议**这样做。首先是因为它们目的不一样，专业的事情应该交给专业的工具。其次是它们的造成心智负担不同，Review 代码时，我们往往不需要关注 Formatting 的改动，但是我们必须要仔细检查确认 Linting 的改动，因为 Formatting 的改动一般是安全的，但是 Linting 的改动可存在错误的修复。

这 3 个方面也是更先进的运行时 [Deno](https://deno.com) 所内置的功能，[Node](https://nodejs.org) 并没有内置支持，取而代之的是社区里百花齐放的工具：TypeScript、Flow、Biome、ESLint、oxc-lint、Prettier、dprint。这些工具用在 Node 项目中存在 3 个非常影响**开发体验**的问题：

- **工具选型问题**：我应该选择哪些工具集合来优化上述 3 个问题？选择后，下一个 Node 项目又选择不同工具集怎么办？
- **工具之间冲突磨合问题**：确定使用的工具后，这些工具之间是否有冲突？代码提交时是先 format 还是先 lint？工具之间配合的最佳实践是什么？
- **工具们的复杂配置问题**：每个工具都有很复杂难懂的配置，在项目根目录（或 `package.json` 里）到处拉屎。一来不美观简洁，二来增加理解成本。每个 Node 项目可能工具统一但配置不统一，进一步导致开发体验不一致。

为了解决上述问题，现在有非常多教程文章讲解 TypeScript + Prettier + ESLint 的配置和实践，这些文章教程能缓解一部分问题，但仍然将<u>杂乱的工具链和繁琐的配置暴露给用户</u>。这不是我们的目标，我们的目标是**提供一个统一的工具屏蔽这些复杂的实践细节，给用户带来简单一致、开箱即用的良好开发体验**。

</details>

<details>
<summary>English</summary>
Coming soon...
</details>

## Features

Based on the philosophy outlined above, this tool offers the following features:

- 💪 **Enhanced Type Safety**: This tool provides the strictest `tsconfig` settings and type patches to bolster the type safety of TypeScript projects. It is also compatible with pure JavaScript projects.
- 💃 **Formatting**: This tool ensures code consistency across your codebase and minimizes merge conflicts by automatically formatting code. It additionally supports the sorting of imports and `package.json` files.
- 📏 **Linting**: The tool comes equipped with a comprehensive set of rules for static code analysis, which helps catch errors and prevent poor coding practices in JavaScript.
- 🪝 **Git Hooks**: After installation, committing code via Git triggers automatic formatting and linting checks. No additional package installations are required.

## Highlights

We place a high value on `Development Experience` (DX).

- 📦 **All-In-One**: You don't need to install `prettier`, `eslint`, `lint-staged` or `husky`.
- ⚙️ **Zero Configs**: Comes with sensible default configurations for type safety, formatting, and linting, so you don't need to set up any configurations.
- 😉 **Highly Customizable**: Every thing is optional. Every thing can be customized.

## Quick Start

To quick start, run command below to check formatting and linting style in your project.

```sh
npx fenge
```

## Install

We recommend installing it as one of `devDependencies` in your project.

```sh
npm i -D fenge
```

## Usages

Each of the following usages is optional. You can choose the ones that best fit your needs.

### Type Safe

#### Config the strictest `tsconfig.json`

Config `tsconfig.json` file in your project root.

```json
{
  "extends": "fenge/tsconfig"
}
```

Config `tsconfig.build.json` file in sub-package or project root.

```json
{
  "extends": "./tsconfig.json",
  "include": ["src"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"]
}
```

Build your project by executing `tsc -p ./tsconfig.build.json`. Type-check your project by executing `tsc -p ./tsconfig.build.json --noEmit`.

For more beat practices, please refer to [@fenge/tsconfig](https://www.npmjs.com/package/@fenge/tsconfig).

#### Import typing patch

Add a [triple-slash-directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) `/// <reference types="fenge/types" />` at the top of the ts file that serves as the entry point for your application or package. This will make the entire project more type-safe.

Application/Package Entry Point (eg: `src/main.ts` or `src/app.ts`)

```ts
/// <reference types="fenge/types" />
import foo from "./foo";
```

Other File (eg: `src/other-file.ts`)

<!-- prettier-ignore-start -->
```ts
console.log(JSON.parse('{"foo":"foo"}').bar);
         // ^^^^^^^^^^^^^^^^^^^^^^^^^^^ ❌ Object is of type 'unknown'.
```
<!-- prettier-ignore-end -->

### Formatting & Linting

Here are some main commands to format or lint code.

```sh
# Check project's formatting problems only
$ fenge format

# Check project's formatting problems and apply updates
$ fenge format -u

# Check project's linting problems only
$ fenge lint

# Check project's linting problems and apply updates
$ fenge lint -u

# Check both formatting and linting problems
$ fenge

# Check both formatting and linting problems and apply updates
$ fenge -u
```

This tool does not require a configuration file. However, you can add a `fenge.config.js` file to customize formatting and linting rules. This file should export an object with two properties:

- `format`: Accept a [Prettier Config](https://prettier.io/docs/en/configuration.html).
- `lint`: Accept a [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files).

```js
export default {
  format: {
    semi: false,
    singleQuote: true,
  },
  lint: [
    {
      files: ["**/*.{js,cjs,mjs,jsx}", "**/*.{ts,cts,mts,tsx}"],
      rules: {
        "no-unused-vars": "error",
      },
    },
  ],
};
```

Usually, we recommend reusing the built-in configurations rather than writing them from scratch.

```js
// @ts-check
// See https://www.npmjs.com/package/@fenge/eslint-config for eslint-config detail usage
import { Builder } from "fenge/eslint-config";
// See https://www.npmjs.com/package/@fenge/prettier-config for prettier-config detail usage
import prettierConfig from "fenge/prettier-config";

export default {
  format: {
    ...prettierConfig,
    // add config below to override the default behavior
    semi: false,
  },
  lint: new Builder()
    .enablePackagejson({
      pick: ["packagejson/top-types"], // only these rules will work for package.json files
    })
    .enableJavascript({
      omit: ["no-var"], // these rules will not work for js files
    })
    .enableTypescript({
      project: "tsconfig.json", // tsconfig.json path
      extend: {
        // apply additional rules for ts files
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/consistent-type-assertions": [
          "error",
          { assertionStyle: "never" },
        ],
        "@typescript-eslint/no-non-null-assertion": "error",
      },
    })
    .toConfig(),
};
```

You can even install and use other third-party eslint-config, like [@sxzz/eslint-config](https://www.npmjs.com/package/@sxzz/eslint-config).

### Set up Git hooks

Executing `fenge install` will write a `pre-commit` file to the `${PROJECT_ROOT}/.git/hooks` folder. After editing `package.json -> scripts -> prepare` script and executing it once, each commit (via Git) will trigger a code style check for the committed files.

```json
{
  "scripts": {
    "prepare": "fenge install"
  }
}
```

```sh
npm run prepare
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
