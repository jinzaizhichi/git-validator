import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Rule } from "eslint";
import type { Node } from "estree";

export interface Context extends Omit<Rule.RuleContext, "report"> {
  reportNode: (node: Node) => void;
}

export function createSimpleRule(options: {
  name: string;
  message: string;
  create: (context: Context) => Rule.RuleListener;
}): { name: string; rule: Rule.RuleModule } {
  const { name, message, create } = options;
  const rule = {
    create: (context: Rule.RuleContext) => {
      const ctx = Object.assign({}, context, {
        reportNode: (node: Node) => context.report({ node, message }),
      });
      Object.setPrototypeOf(ctx, Object.getPrototypeOf(context));
      return create(ctx);
    },
  };
  return { name, rule };
}

export function getRuleName(importMetaUrl: string) {
  // remove '.js' extension
  return path.basename(fileURLToPath(importMetaUrl)).slice(0, -3);
}
