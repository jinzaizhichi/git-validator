import { noDeclarationFileImports } from "./rules/no-declaration-file-imports.ts";
import { noDirectoryImports } from "./rules/no-directory-imports.ts";
import { noDynamicImports } from "./rules/no-dynamic-imports.ts";
import { noEmptyExports } from "./rules/no-empty-exports.ts";
import { noGitIgnoredImports } from "./rules/no-git-ignored-imports.ts";
import { noInexistentRelativeImports } from "./rules/no-inexistent-relative-imports.ts";
import { noPhantomDepImports } from "./rules/no-phantom-dep-imports.ts";
import { noRelativeParentImports } from "./rules/no-relative-parent-imports.ts";
import { noRenameExports } from "./rules/no-rename-exports.ts";
import { noRenameImports } from "./rules/no-rename-imports.ts";
import { noSideEffectImports } from "./rules/no-side-effect-imports.ts";
import { noUselessPathSegments } from "./rules/no-useless-path-segments.ts";
import { requiredExports } from "./rules/required-exports.ts";

export const rules = {
  [noDeclarationFileImports.name]: noDeclarationFileImports.rule,
  [noDirectoryImports.name]: noDirectoryImports.rule,
  [noDynamicImports.name]: noDynamicImports.rule,
  [noEmptyExports.name]: noEmptyExports.rule,
  [noGitIgnoredImports.name]: noGitIgnoredImports.rule,
  [noInexistentRelativeImports.name]: noInexistentRelativeImports.rule,
  [noPhantomDepImports.name]: noPhantomDepImports.rule,
  [noRelativeParentImports.name]: noRelativeParentImports.rule,
  [noRenameExports.name]: noRenameExports.rule,
  [noRenameImports.name]: noRenameImports.rule,
  [noSideEffectImports.name]: noSideEffectImports.rule,
  [noUselessPathSegments.name]: noUselessPathSegments.rule,
  [requiredExports.name]: requiredExports.rule,
};
