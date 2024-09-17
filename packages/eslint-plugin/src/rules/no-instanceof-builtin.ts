import type { Rule } from "eslint";
import { getRuleName } from "../utils.js";

// TODO: If https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2452 is accepted, migrate this rule to `eslint-plugin-unicorn`
const name = getRuleName(import.meta.url);
const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "Right hand of `instanceof` can't be a builtin class.",
    },
    messages: {
      [`${name}/error`]: "Right hand of `instanceof` can't be a builtin class.",
    },
  },
  create: (context) => {
    let builtins = new Set<string>();
    return {
      Program: (node) => {
        builtins = new Set(
          context.sourceCode.getScope(node).variables.map((v) => v.name),
        );
      },
      BinaryExpression: (node) => {
        if (
          node.operator !== "instanceof" ||
          node.right.type !== "Identifier"
        ) {
          return;
        }

        if (builtins.has(node.right.name)) {
          context.report({ node: node.right, messageId: `${name}/error` });
        }
      },
    };
  },
};

export const noInstanceofBuiltin = { name, rule };
