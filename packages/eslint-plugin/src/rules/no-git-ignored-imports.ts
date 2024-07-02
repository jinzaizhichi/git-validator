import childProcess from "node:child_process";
import path from "node:path";
import process from "node:process";
import { isNativeError } from "node:util/types";
import { createSimpleRule } from "../utils.js";

export default createSimpleRule({
  name: "no-git-ignored-imports",
  message: "Disallow to import module from git-ignored path.",
  create: (context) => ({
    ImportDeclaration: (node) => {
      if (checkIgnored(context.filename, node.source.value)) {
        context.reportNode(node.source);
      }
    },
    ImportExpression: (node) => {
      if (
        "value" in node.source &&
        typeof node.source.value === "string" &&
        checkIgnored(context.filename, node.source.value)
      ) {
        context.reportNode(node.source);
      }
    },
    CallExpression: (node) => {
      const arg = node.arguments[0];
      if (
        "name" in node.callee &&
        node.callee.name === "require" &&
        arg?.type === "Literal" &&
        typeof arg.value === "string" &&
        checkIgnored(context.filename, arg.value)
      ) {
        context.reportNode(arg);
      }
    },
    // TODO: should handle exports
  }),
});

function checkIgnored(filePath: string, source: string) {
  // from node_modules
  if (
    !source.startsWith("./") &&
    !source.startsWith("../") &&
    !source.startsWith("/")
  ) {
    return false;
  }
  // out side of project root
  if (source.startsWith("/") && !source.startsWith(process.cwd())) {
    return true;
  }
  // This file of absolutePath may be a symbolic link
  const absolutePath = path.resolve(path.dirname(filePath), source);
  if (!absolutePath.startsWith("/")) {
    throw new Error(
      `ESLint plugin internal error. Absolute path incorrect: ${absolutePath}.`,
    );
  }
  return isIgnored(absolutePath);
}

function isIgnored(filePath: string) {
  try {
    return (
      // eslint-disable-next-line n/no-sync
      childProcess
        .execSync(`git check-ignore ${filePath}`, { encoding: "utf8" })
        .trim() === filePath
    );
  } catch (e) {
    if (
      isNativeError(e) &&
      "stdout" in e &&
      e.stdout === "" &&
      "stderr" in e &&
      e.stderr === ""
    ) {
      return false;
    }
    // We cannot throw an error here. So we have to return true to report the filePath is bad.
    return true;
  }
}
