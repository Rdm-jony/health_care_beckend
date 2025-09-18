import fs from "fs";
import path from "path";

const dir = "./src";

function walk(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) walk(fullPath);
    else if (file.endsWith(".ts")) fixImport(fullPath);
  }
}

function fixImport(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const regex = /from\s+["'](\..*?)["']/g;
  content = content.replace(regex, (match, p1) => {
    if (p1.endsWith(".js")) return match; // already fixed
    return `from "${p1}.js"`;
  });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Updated:", filePath);
}

walk(dir);