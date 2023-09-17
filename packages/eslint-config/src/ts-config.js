// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import tsParser from "@typescript-eslint/parser";
import jsConfig from "./js-config/index.js";

const tsconfig = (await fs
  .access(path.join(process.cwd(), "tsconfig.eslint.json"))
  .then(() => true)
  .catch(() => false))
  ? "tsconfig.eslint.json"
  : (await fs
      .access(path.join(process.cwd(), "tsconfig.json"))
      .then(() => true)
      .catch(() => false))
  ? "tsconfig.json"
  : undefined;

function getTsRules() {
  // https://typescript-eslint.io/rules/#extension-rules
  const allBuiltinRuleKeys = [
    "block-spacing",
    "brace-style",
    "class-methods-use-this",
    "comma-dangle",
    "comma-spacing",
    "default-param-last",
    "dot-notation",
    "func-call-spacing",
    "indent",
    "init-declarations",
    "key-spacing",
    "keyword-spacing",
    "lines-around-comment",
    "lines-between-class-members",
    "no-array-constructor",
    "no-dupe-class-members",
    "no-empty-function",
    "no-extra-parens",
    "no-extra-semi",
    "no-implied-eval",
    "no-invalid-this",
    "no-loop-func",
    "no-loss-of-precision",
    "no-magic-numbers",
    "no-redeclare",
    "no-restricted-imports",
    "no-shadow",
    "no-throw-literal",
    "no-unused-expressions",
    "no-unused-vars",
    "no-use-before-define",
    "no-useless-constructor",
    "object-curly-spacing",
    "padding-line-between-statements",
    "quotes",
    "require-await",
    "return-await",
    "semi",
    "space-before-blocks",
    "space-before-function-paren",
    "space-infix-ops",
  ];
  const builtinRuleKeys = allBuiltinRuleKeys.filter((key) => jsConfig.rules[key]);
  const disabledRules = builtinRuleKeys.reduce((result, key) => ({ ...result, [key]: "off" }), {});
  /**
   * @type {Record<string, any>}
   */
  const originRules = builtinRuleKeys.reduce(
    (result, key) => ({
      ...result,
      [`@typescript-eslint/${key}`]: JSON.parse(JSON.stringify(jsConfig.rules[key])),
    }),
    {},
  );
  originRules["@typescript-eslint/indent"][2].ignoredNodes.push(
    "FunctionExpression > .params[decorators.length > 0]",
    "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
    "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
  );

  return {
    ...disabledRules,
    ...originRules,
  };
}

export default {
  files: ["**/*.ts", "**/*.cts", "**/*.mts", "**/*.tsx"],
  languageOptions: {
    parser: tsParser,
    ...(tsconfig
      ? {
          parserOptions: {
            tsconfigRootDir: process.cwd(),
            project: tsconfig,
          },
        }
      : {}),
  },
  rules: {
    ...jsConfig.rules,
    ...getTsRules(),
    "no-void": ["error", { allowAsStatement: true }],

    // ban some syntaxes to reduce mistakes
    "import/no-commonjs": [
      "error",
      { allowRequire: false, allowConditionalRequire: false, allowPrimitiveModules: false },
    ], // TODO move this rule to base. js file should not use commonjs too.
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/method-signature-style": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-import-type-side-effects": "error",
    // '@typescript-eslint/consistent-type-imports': 'error',

    "@git-validator/no-const-enum": "error",
    "@git-validator/no-declares-in-ts-file": "error",
    "@git-validator/no-export-assignment": "error",
  },
};
