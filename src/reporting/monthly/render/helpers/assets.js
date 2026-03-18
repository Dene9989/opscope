const fs = require("fs");
const path = require("path");

function toDataUri(filePath) {
  if (!filePath) {
    return "";
  }
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".svg"
            ? "image/svg+xml"
            : "application/octet-stream";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch (error) {
    return "";
  }
}

function getAssetDataUri(relativePath) {
  if (!relativePath) {
    return "";
  }
  const baseDir = process.cwd();
  const resolved = path.resolve(baseDir, relativePath);
  return toDataUri(resolved);
}

module.exports = {
  getAssetDataUri,
};
