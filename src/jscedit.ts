#!/usr/bin/env node

import fs from "fs";
import * as jsonc from "jsonc-parser";

function updateJsoncFile(filePath: string, jsonToMerge: string): void {
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
    process.exit(42);
  }

  const jsonValue = JSON.parse(jsonToMerge);

  // Create edits for every key in jsonValue
  const edits = Object.keys(jsonValue).flatMap((key) =>
    // modify is documented here https://github.com/microsoft/node-jsonc-parser/blob/33f744b/src/test/edit.test.ts
    jsonc.modify(fileContent, [key], jsonValue[key], {
      formattingOptions: { tabSize: 2, insertSpaces: true },
    })
  );

  // Apply the edits to the file content
  const modifiedContent = jsonc.applyEdits(fileContent, edits);
  if (modifiedContent !== fileContent) {
    if (filePath === "-") {
      process.stdout.write(modifiedContent);
    } else {
      fs.writeFileSync(filePath, modifiedContent, "utf8");
    }
  }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: jscedit <file.jsonc|- for stdin> <json_to_merge>");
} else {
  const filePath = args[0];
  const jsonToMerge = args[1];
  updateJsoncFile(filePath, jsonToMerge);
}
