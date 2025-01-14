import prettierConfig from "eslint-config-prettier";
import base from "./base.js";
import jsConfig from "./js-config/index.js";
import packagejsonConfig from "./packagejson-config.js";
import tsConfig from "./ts-config.js";

export default [...base, jsConfig, ...tsConfig, packagejsonConfig, prettierConfig];
