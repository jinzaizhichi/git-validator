import type { Rule } from "eslint";
import type { Node } from "estree";
import { getRuleName } from "../utils.js";

const name = getRuleName(import.meta.url);
const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "Only allow JSX syntax in `.jsx` and `.tsx` file.",
    },
    messages: {
      [`${name}/error`]: "Only allow JSX syntax in `.jsx` and `.tsx` file.",
    },
  },
  create: (context) => {
    if (
      context.filename.endsWith(".jsx") ||
      context.filename.endsWith(".tsx")
    ) {
      return {};
    }
    return {
      ":matches(JSXElement, JSXFragment)": (node: Node) => {
        context.report({ node, messageId: `${name}/error` });
      },
    };
  },
};

export const noJsxInNonJsxFile = { name, rule };