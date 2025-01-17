// @ts-check
import fs from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import { Command } from "commander";

const generatingTsconfigContent = `{
  "extends": "${process.env["TSCONFIG_EXTENDS"] ?? "@git-validator/tsconfig"}",
  "include": ["src"],
  "exclude": ["**/*.spec.ts", "**/*.test.ts"],
  "compilerOptions": {
    "outDir": "dist"
  }
}
`;

const program = new Command();
program.name("tsconfig");
program
  .command("init")
  .description("init a tsconfig file")
  .option("-p, --path <path>", "directory path to generate file to", ".")
  .option("-n, --name <filename>", "tsconfig file name", "tsconfig.json")
  .option("-f, --force", "forcefully overwrite existing file")
  .action(async ({ path, name, force }) => {
    const fullName = resolve(process.cwd(), path, name);
    if (
      !(await fs
        .access(fullName)
        .then(() => true)
        .catch(() => false)) ||
      force
    ) {
      await fs.writeFile(fullName, generatingTsconfigContent);
    } else {
      throw new Error(
        `${fullName} is already existing! You can apply --force option to overwrite it.`,
      );
    }
  });

program.parse();
