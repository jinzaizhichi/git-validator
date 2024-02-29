// @ts-check
import fs from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseTsconfig } from "get-tsconfig";
import JSON5 from "json5";
import { printUnifiedDiff } from "print-diff";
import sortKeys from "sort-keys";

/**
 * @param {string} filepath
 */
async function exists(filepath) {
  return await fs
    .access(filepath)
    .then(() => true)
    .catch(() => false);
}

/**
 * @param {{path: string, name: string, force: boolean, ext?: string}} options
 */
export async function initAction(options) {
  const generatingTsconfigContent = `{
  "extends": "${
    options.ext ?? process.env["TSCONFIG_EXTENDS"] ?? "@git-validator/tsconfig"
  }",
  "include": ["src"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
`;

  const { path, name, force } = options;
  const fullName = resolve(process.cwd(), path, name);
  if (!(await exists(fullName)) || force) {
    await fs.writeFile(fullName, generatingTsconfigContent);
  } else {
    throw new Error(
      `${fullName} is already existing! You can apply --force option to overwrite it.`,
    );
  }
}

/**
 * @param {{path: string, name: string, to: string}} options
 */
export async function diffAction(options) {
  const { path = ".", name = "tsconfig.json", to = "tsconfig.json" } = options;

  const cwd = process.cwd();
  const dir = dirname(fileURLToPath(import.meta.url));

  const recommendedTsconfigPath = resolve(dir, "..", to);
  const projectTsconfigPath = resolve(cwd, path, name);
  if (!(await exists(recommendedTsconfigPath))) {
    throw new Error(`Tsconfig ${recommendedTsconfigPath} is not found!`);
  }
  if (!(await exists(projectTsconfigPath))) {
    throw new Error(`Tsconfig ${projectTsconfigPath} is not found!`);
  }

  const recommendedTsconfig = parseTsconfig(recommendedTsconfigPath);
  const projectTsconfig = parseTsconfig(projectTsconfigPath);

  // correct the recommended tsconfig for a better diff view
  const projectOutDir = projectTsconfig.compilerOptions?.outDir;
  if (
    projectOutDir === "./node_modules/git-validator/tsconfig/dist" ||
    projectOutDir === "./node_modules/@git-validator/tsconfig/dist"
  ) {
    recommendedTsconfig.compilerOptions =
      recommendedTsconfig.compilerOptions ?? {};
    recommendedTsconfig.compilerOptions.outDir = projectOutDir;
  }
  const projectExclude = projectTsconfig.exclude?.find(
    (i) =>
      i === "node_modules/git-validator/tsconfig/dist" ||
      i === "node_modules/@git-validator/tsconfig/dist",
  );
  if (projectExclude) {
    recommendedTsconfig.exclude = (recommendedTsconfig.exclude ?? []).map(
      (i) => (i === "dist" ? projectExclude : i),
    );
  }

  printUnifiedDiff(
    JSON5.stringify(sortKeys(recommendedTsconfig, { deep: true }), null, 2),
    JSON5.stringify(sortKeys(projectTsconfig, { deep: true }), null, 2),
    {
      write: (data) => {
        console.log(
          data
            .replace("+ expected", "+ current project tsconfig")
            .replace("- actual", "- recommended tsconfig"),
        );
      },
    },
  );
}

/**
 * @param {import('commander').Command} program
 * @param {{initCommand?: string, diffCommand?: string, initAction?: typeof initAction, diffAction?: typeof diffAction}} options
 */
export function setup(program, options = {}) {
  program
    .command(options.initCommand ?? "init")
    .description("init a tsconfig file")
    .option("-p, --path <path>", "directory path to generate file to", ".")
    .option("-n, --name <filename>", "tsconfig file name", "tsconfig.json")
    .option("-f, --force", "forcefully overwrite existing file")
    .action(options.initAction ?? initAction);

  program
    .command(options.diffCommand ?? "diff")
    .description(
      "show differences between recommended tsconfig and current project tsconfig",
    )
    .option(
      "-p, --path <path>",
      "project directory path containing tsconfig",
      ".",
    )
    .option(
      "-n, --name <filename>",
      "project tsconfig file name",
      "tsconfig.json",
    )
    .option(
      "-t, --to <filename>",
      "which built-in recommended tsconfig file to compare with. possible values are 'tsconfig.json'|'esm.json'|'cjs.json'",
      "tsconfig.json",
    )
    .action(options.diffAction ?? diffAction);
  return program;
}
