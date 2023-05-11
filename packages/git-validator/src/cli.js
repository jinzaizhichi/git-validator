import fs from 'node:fs'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function writeGitHook(file, content) {
  const path = resolve(process.cwd(), '.git', 'hooks', file)
  fs.writeFileSync(path, content)
  fs.chmodSync(path, '777')
}

function writePreCommit() {
  const content = [
    '#!/bin/sh',
    `echo '{"*":["npx eslint --config ${join(__dirname, 'eslint.config.cjs')} --fix"]}' | npx lint-staged -c -`,
  ].join('\n')

  writeGitHook('pre-commit', content)
}

function writeCommitMsg() {
  const content = [
    '#!/bin/sh',
    `npx commitlint --config ${join(__dirname, 'commitlint.config.cjs')} --edit`,
  ].join('\n')

  writeGitHook('commit-msg', content)
}

function writePrePush(cmd) {
  const content = [
    '#!/bin/sh',
    cmd,
  ].join('\n')

  writeGitHook('pre-push', content)
}

export function install({ preCommit, commitMsg, prePush }) {
  if (preCommit)
    writePreCommit()
  if (commitMsg)
    writeCommitMsg()
  if (prePush)
    writePrePush(prePush)
}

export function lint(dir = process.cwd(), options = {}) {
  const { fix } = options
  return spawnSync('npx', ['eslint', '--config', join(__dirname, 'eslint.config.cjs'), ...(fix ? ['--fix'] : []), resolve(process.cwd(), dir)], { stdio: 'inherit' })
}
