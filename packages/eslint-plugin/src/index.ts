import * as noConstEnum from './rules/no-const-enum'
import * as noDeclaresInTsFile from './rules/no-declares-in-ts-file'
import * as noExportAssignment from './rules/no-export-assignment'
import * as noNodeModulesWhenImport from './rules/no-node-modules-when-import'

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
        },
      },
      {
        files: ['*.js', '*.cjs', '*.mjs', '*.jsx'],
        rules: {
          [`@zanminkian/${noNodeModulesWhenImport.ruleName}`]: 'error',
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
}