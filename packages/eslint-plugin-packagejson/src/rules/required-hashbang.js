import fs from "node:fs";
import path from "node:path";

export const name = "required-hashbang";
export const rule = {
  create: (context) => ({
    "Program > ExportDefaultDeclaration > ObjectExpression": (node) => {
      const bin = node.properties.find((p) => p.key.value === "bin");
      if (!bin) {
        return;
      }
      if (bin.value.type === "Literal") {
        if (typeof bin.value.value !== "string") {
          return reportNotStandard(context, bin.value);
        }
        if (!isValidBinPath(context.filename, bin.value.value)) {
          return reportInvalidBinPath(context, bin.value);
        }
      } else if (bin.value.type === "ObjectExpression") {
        bin.value.properties.forEach((property) => {
          if (typeof property.value.value !== "string") {
            return reportNotStandard(context, property.value);
          }
          if (!isValidBinPath(context.filename, property.value.value)) {
            return reportInvalidBinPath(context, property.value);
          }
        });
      } else {
        return reportNotStandard(context, bin);
      }
    },
  }),
};

function reportNotStandard(context, node) {
  context.report({
    node,
    message:
      "The `bin` field should be a string or an object whose values are strings",
  });
}

function reportInvalidBinPath(context, node) {
  context.report({
    node,
    message: "The bin file should starts with a hashbang",
  });
}

function isValidBinPath(filename, binPath) {
  const filePath = path.resolve(path.dirname(filename), binPath);
  try {
    // eslint-disable-next-line n/no-sync
    return fs.readFileSync(filePath, "utf8").trimStart().startsWith("#!");
  } catch (e) {
    return false;
  }
}
