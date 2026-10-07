const fs = require("fs");
const path = require("path");

const root = process.cwd();

function scan(dir, relative = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  return items
    .filter(item =>
      item.name !== ".git" &&
      item.name !== "node_modules" &&
      !item.name.startsWith(".")
    )
    .map(item => {
      const fullPath = path.join(dir, item.name);
      const relPath = relative ? `${relative}/${item.name}` : item.name;

      if (item.isDirectory()) {
        return {
          name: item.name,
          path: relPath,
          type: "folder",
          children: scan(fullPath, relPath)
        };
      }

      return {
        name: item.name,
        path: relPath,
        type: "file"
      };
    });
}

const tree = scan(root);

fs.writeFileSync(
  path.join(root, "tree.json"),
  JSON.stringify(tree, null, 2),
  "utf8"
);

console.log("Tree generated.");
