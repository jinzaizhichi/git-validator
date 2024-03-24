// @ts-check
// TODO move this logic to another package
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";
import { minimatch } from "minimatch";

/**
 * @param {string} file
 */
function isTs(file) {
  return /\.(ts|mts|cts|tsx)$/.test(file);
}

/**
 * @param {string} file
 */
function isJs(file) {
  return /\.(js|mjs|cjs|jsx)$/.test(file);
}

/**
 * @param {string} filepath ts or js file absolute path
 */
async function getAnalysis(filepath) {
  const code = await fs.readFile(filepath, "utf-8");
  const result = {
    /** @type {{start:{line:number,column:number}}[]} */
    anyTypes: [],
    /** @type {{start:{line:number,column:number}}[]} */
    assertions: [],
    /** @type {{start:{line:number,column:number}}[]} */
    nonNullAssertions: [],
    /** @type {{start:{line:number,column:number}}[]} */
    renamedImports: [],
    /** @type {{start:{line:number,column:number}}[]} */
    importExpressions: [],
    /** @type {{start:{line:number,column:number}}[]} */
    instanceofOperators: [],
    /** @type {{start:{line:number,column:number}}[]} */
    nodeProtocolImports: [],
    /** @type {{start:{line:number,column:number}}[]} */
    metaProperties: [],
    codeLines: code.split("\n").length,
  };

  /**
   * @param {any} node
   */
  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }
    switch (node.type) {
      case "TSAnyKeyword":
        result.anyTypes.push(node.loc);
        break;
      case "TSAsExpression":
      case "TSTypeAssertion":
        if (node.typeAnnotation.typeName?.name === "const") {
          break;
        }
        result.assertions.push(node.loc);
        break;
      case "TSNonNullExpression":
        result.nonNullAssertions.push(node.loc);
        break;
      case "PropertyDefinition":
        if (node.definite) {
          result.nonNullAssertions.push(node.loc);
        }
        break;
      case "ImportDeclaration":
        result.renamedImports.push(
          ...node.specifiers
            .filter((/** @type {any} */ s) => s.type === "ImportSpecifier")
            .filter((/** @type {any} */ s) => s.imported.name !== s.local.name)
            .map((/** @type {any} */ s) => s.loc),
        );
        if (node.source.value.startsWith("node:")) {
          result.nodeProtocolImports.push(node.loc);
        }
        break;
      case "ImportExpression":
        result.importExpressions.push(node.loc);
        if (node.source.value?.startsWith("node:")) {
          result.nodeProtocolImports.push(node.loc);
        }
        break;
      case "BinaryExpression":
        if (node.operator === "instanceof") {
          result.instanceofOperators.push(node.loc);
        }
        break;
      case "VariableDeclarator":
        if (
          node.id.type === "ObjectPattern" &&
          node.init?.type === "AwaitExpression" &&
          node.init?.argument.type === "ImportExpression"
        ) {
          result.renamedImports.push(
            ...node.id.properties
              .filter((/** @type {any} */ p) => p.key.name !== p.value.name)
              .map((/** @type {any} */ p) => p.loc),
          );
        }
        break;
      case "MetaProperty":
        if (node.meta.name === "import" && node.property.name === "meta") {
          result.metaProperties.push(node.loc);
        }
        break;
    }
    Object.values(node).forEach((sub) => walk(sub));
  }

  // this package require typescript as its peer dependencies
  const { parse } = await import("@typescript-eslint/typescript-estree").catch(
    (e) => {
      throw new Error(
        "Importing `@typescript-eslint/typescript-estree` fail! Please make sure that typescript has been installed or npm config `legacy-peer-deps` is disabled.",
        { cause: e },
      );
    },
  );
  walk(
    parse(code, {
      jsx: filepath.endsWith("x") || filepath.endsWith("js"),
      loc: true,
    }),
  );
  return result;
}

/**
 * @param {string} dir absolute directory path
 * @param {string[]} ignorePatterns
 * @param {(file: string)=>Promise<void>} cb
 */
async function walkDir(dir, ignorePatterns, cb) {
  /**
   * @type {(filepath: string)=>boolean}
   */
  const ignoreDir = (filepath) =>
    filepath.includes(`${path.sep}.git${path.sep}`) ||
    filepath.includes(`${path.sep}node_modules${path.sep}`) ||
    ignorePatterns.some((pattern) => minimatch(filepath, pattern));

  /**
   * @type {(filepath: string)=>boolean}
   */
  const ignoreFile = (filepath) =>
    (!isTs(filepath) && !isJs(filepath)) || ignoreDir(filepath);

  const promises = (await fs.readdir(dir))
    .map((filepath) => path.resolve(dir, filepath))
    .map(async (filepath) => {
      if ((await fs.stat(filepath)).isDirectory()) {
        if (!ignoreDir(filepath)) {
          await walkDir(filepath, ignorePatterns, cb);
        }
      } else {
        if (!ignoreFile(filepath)) {
          await cb(filepath);
        }
      }
    });
  await Promise.all(promises);
}

export async function analyze(dir = process.cwd()) {
  dir = path.resolve(process.cwd(), dir);
  const ignores = (
    await fs.readFile(path.resolve(dir, ".gitignore"), "utf-8").catch(() => "")
  )
    .split("\n")
    .map((i) => i.trim())
    .filter(Boolean)
    .filter((i) => !i.startsWith("#"))
    .map((i) => gitignoreToMinimatch(i));

  const result = {
    /** @type {string[]} */ anyTypes: [],
    /** @type {string[]} */ assertions: [],
    /** @type {string[]} */ nonNullAssertions: [],
    /** @type {string[]} */ renamedImports: [],
    /** @type {string[]} */ importExpressions: [],
    /** @type {string[]} */ instanceofOperators: [],
    /** @type {string[]} */ nodeProtocolImports: [],
    /** @type {string[]} */ metaProperties: [],
    codeLines: 0,
    tsFiles: 0,
    jsFiles: 0,
    analyzedFiles: 0,
  };

  await walkDir(dir, ignores, async (file) => {
    try {
      const analysis = await getAnalysis(file);

      result.anyTypes.push(
        ...analysis.anyTypes.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.assertions.push(
        ...analysis.assertions.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.nonNullAssertions.push(
        ...analysis.nonNullAssertions.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.renamedImports.push(
        ...analysis.renamedImports.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.importExpressions.push(
        ...analysis.importExpressions.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.instanceofOperators.push(
        ...analysis.instanceofOperators.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.nodeProtocolImports.push(
        ...analysis.nodeProtocolImports.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );
      result.metaProperties.push(
        ...analysis.metaProperties.map(
          (loc) => `${file} ${loc.start.line}:${loc.start.column}`,
        ),
      );

      result.codeLines += analysis.codeLines;
      result.tsFiles += isTs(file) ? 1 : 0;
      result.jsFiles += isJs(file) ? 1 : 0;
      result.analyzedFiles += 1;
    } catch (e) {
      throw new Error(`Analyze ${file} fail!`, { cause: e });
    }
  });
  return result;
}
