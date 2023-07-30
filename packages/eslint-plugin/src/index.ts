import * as noConstEnum from './rules/no-const-enum'
import * as noDeclarationFileWhenImport from './rules/no-declaration-file-when-import'
import * as noDeclaresInTsFile from './rules/no-declares-in-ts-file'
import * as noDynamicImport from './rules/no-dynamic-import'
import * as noExportAssignment from './rules/no-export-assignment'
import * as noLegacyGetterSetter from './rules/no-legacy-getter-setter'
import * as noNodeModulesWhenImport from './rules/no-node-modules-when-import'
import * as preferGlobalThis from './rules/prefer-global-this'

export const configs = {
  recommended: {
    plugins: ['@zanminkian'],
    overrides: [
      {
        files: ['*.ts', '*.cts', '*.mts', '*.tsx'],
        rules: {
          [`@zanminkian/${noConstEnum.ruleName}`]: 'error',
          [`@zanminkian/${noExportAssignment.ruleName}`]: 'error',
          [`@zanminkian/${noDeclaresInTsFile.ruleName}`]: 'error',
          [`@zanminkian/${noNodeModulesWhenImport.ruleName}`]: 'error',
          [`@zanminkian/${noLegacyGetterSetter.ruleName}`]: 'error',
          [`@zanminkian/${preferGlobalThis.ruleName}`]: 'error',
          [`@zanminkian/${noDynamicImport.ruleName}`]: 'error',
          [`@zanminkian/${noDeclarationFileWhenImport.ruleName}`]: 'error',
        },
      },
      {
        files: ['*.js', '*.cjs', '*.mjs', '*.jsx'],
        rules: {
          [`@zanminkian/${noNodeModulesWhenImport.ruleName}`]: 'error',
          [`@zanminkian/${noLegacyGetterSetter.ruleName}`]: 'error',
          [`@zanminkian/${preferGlobalThis.ruleName}`]: 'error',
          [`@zanminkian/${noDynamicImport.ruleName}`]: 'error',
          [`@zanminkian/${noDeclarationFileWhenImport.ruleName}`]: 'error',
        },
      },
    ],
  },
}

export const rules = {
  [noConstEnum.ruleName]: noConstEnum.default,
  [noExportAssignment.ruleName]: noExportAssignment.default,
  [noDeclaresInTsFile.ruleName]: noDeclaresInTsFile.default,
  [noNodeModulesWhenImport.ruleName]: noNodeModulesWhenImport.default,
  [noLegacyGetterSetter.ruleName]: noLegacyGetterSetter.default,
  [preferGlobalThis.ruleName]: preferGlobalThis.default,
  [noDynamicImport.ruleName]: noDynamicImport.default,
  [noDeclarationFileWhenImport.ruleName]: noDeclarationFileWhenImport.default,
}
