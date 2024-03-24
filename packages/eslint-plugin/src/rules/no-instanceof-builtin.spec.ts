import { messageId, rule, ruleName } from "./no-instanceof-builtin.js";
import { test } from "./utils.spec.js";

const invalid = [
  // Primitive
  "Number",
  "String",
  "Boolean",
  "Symbol",
  "BigInt",

  // Object
  "Object",
  "Array",
  "Function",

  // Builtin
  "ArrayBuffer",
  "BigInt64Array",
  "BigUint64Array",
  "DataView",
  "Date",
  "Float32Array",
  "Float64Array",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Map",
  "Error",
  "Promise",
  "Proxy",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "WeakMap",
  "WeakSet",
].map((i) => `const i = {} instanceof ${i}`);

const valid = [
  "const i = Math.random() > 0.5 ? true: false",
  "const i = {} instanceof await import('http')",
];

test({ valid, invalid, messageId, rule, ruleName });
