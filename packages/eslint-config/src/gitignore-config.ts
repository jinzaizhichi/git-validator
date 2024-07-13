import childProcess from "node:child_process";

export function gitignore() {
  let stdout = "";
  try {
    // eslint-disable-next-line n/no-sync
    stdout = childProcess.execSync(
      "git ls-files --others --ignored --exclude-standard --directory",
      { encoding: "utf8" },
    );
  } catch (e) {
    console.warn(
      "Warn: Running `git ls-files` fail. We recommend to run `git init` to setup the project first.",
      e,
    );
  }
  // https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores
  return [
    {
      // TODO waiting for eslint 9
      // name: 'git-validator/ignore',
      ignores: stdout.split("\n").filter(Boolean),
    },
  ] as const;
}
