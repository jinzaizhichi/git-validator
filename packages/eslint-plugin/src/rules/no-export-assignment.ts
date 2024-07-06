import { createSimpleRule, getRuleName } from "../utils.js";

export default createSimpleRule({
  name: getRuleName(import.meta.url),
  message: "Disallow using `export =` statement.",
  create: (context) => {
    const extension = context.filename.split(".").pop();
    if (!["ts", "tsx", "mts", "cts"].includes(extension ?? "")) {
      return {};
    }
    return {
      TSExportAssignment: (node) => {
        context.reportNode(node);
      },
    };
  },
});
