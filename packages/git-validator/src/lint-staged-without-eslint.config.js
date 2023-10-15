// @ts-check
import { resolveConfig } from "./utils.js";

const defaultConfig = { "*": ["npx git-validator format -u"] };
export default (await resolveConfig("lint-staged"))?.config ?? defaultConfig;
