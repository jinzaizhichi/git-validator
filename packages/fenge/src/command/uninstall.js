// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { exists, importJson } from "../utils.js";

/**
 * @param {string} file
 */
async function removeGitHook(file) {
  const pkgJsonName = (await importJson(import.meta.url, "../../package.json"))
    .name; // fenge
  const hookFilePath = path.resolve(process.cwd(), ".git", "hooks", file);
  if (
    (await exists(hookFilePath)) &&
    (await fs.readFile(hookFilePath, "utf8")).includes(pkgJsonName)
  ) {
    await fs.rm(hookFilePath);
  }
}

export async function uninstall() {
  await removeGitHook("pre-commit");
}
