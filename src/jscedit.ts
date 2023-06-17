import fs from "fs";
import * as jsonc from "jsonc-parser";

// Function to update a JSONC file
function updateJsoncFile(
  filePath: string,
  keyPath: string,
  value: string
): void {
  let fileContent: string;
  if (filePath === "-") {
    fileContent = fs.readFileSync("/dev/stdin", "utf8");
  } else {
    fileContent = fs.readFileSync(filePath, "utf8");
  }

  // Parse the JSONC content
  const jsoncContent = jsonc.parseTree(fileContent);
  if (!jsoncContent) {
    console.error(`Invalid JSONC content`);
    return;
  }

  // Create an edit to update the value
  const editResult = jsonc.modify(fileContent, [keyPath], value, {
    formattingOptions: { tabSize: 2, insertSpaces: true },
  });

  // Apply the edits to the file content
  const modifiedContent = jsonc.applyEdits(fileContent, editResult);
  if (modifiedContent !== fileContent) {
    if (filePath === "-") {
      process.stdout.write(modifiedContent);
    } else {
      fs.writeFileSync(filePath, modifiedContent, "utf8");
    }
    console.error(`Updated "${keyPath}" with "${value}"`);
  } else {
    console.error(`No changes made to ${filePath}`);
  }
}

// Example usage: node edit-jsonc.js file.jsonc keyPath value
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error("Usage: node jscedit.js <file.jsonc|- for stdin> <keyPath> <value>");
} else {
  const filePath = args[0];
  const keyPath = args[1];
  const value = args[2];
  updateJsoncFile(filePath, keyPath, value);
}
