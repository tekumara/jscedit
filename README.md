# jscedit

Edit JSONC files eg: VS Code's _settings.json_.

JSONC files are JSON but can contain comments and trailing commas. They are a [VS Code specific file format](https://github.com/microsoft/vscode/blob/beea143b432b485e07f862c55b6c147ae2f5e939/extensions/json-language-features/server/README.md?plain=1#L15).

## Usage

Add/modify the setting to auto-save files after a delay:

```sh
jscedit settings.json files.autoSave afterDelay
```

Read/write from stdin/stdout:

```sh
printf '{ # comment\n"foo" : "bar", }' | jscedit - key value
{ # comment
"foo": "bar",
"key": "value",
}
```
