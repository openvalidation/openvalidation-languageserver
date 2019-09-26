# openVALIDATION Language Server

[![npm version](https://badge.fury.io/js/ov-language-server.svg)](https://badge.fury.io/js/ov-language-server)

_This repository is under heavy development._

This is a [language-server](https://microsoft.github.io/language-server-protocol/) implementation of the domain-specific-langauge [openVALIDATION](https://github.com/openvalidation/openvalidation).
The server currently requires an installed Java-Version because the server requires a Java-backend.
The backend gets started automatically.

## Implemented features of the protocol

- [x] Jump to declaration
- [x] Find references
- [x] Highlight occurrences
- [x] Code completion
- [x] Diagnostics reporting
- [x] Documentation on hover
- [x] Rename symbol
- [x] Folding
- [x] Formatting

## Additional features

In addition to the features of the lsp, we provide the following openVALIDATION-specific features.

- [x] Syntax-Highlighting
- [x] Generated Code
- [x] Language-Specific-Definitions

Syntax-Highlighting is currently based on a [TextMate-Grammar](https://macromates.com/manual/en/language_grammars) and gets automatically send to the client over the notification-method `textDocument/semanticHighlighting`. This only happens, when the grammar changes significantly.

In addition the new generated code gets send to the client over the notification-method `textDocument/generatedCode`. This always happens, when code gets written and the parser generated new code.

Last but not least the language-server is able to handle changes of the schema-, culture- and language-parameters.
This can be done by the client by sending notifications over the methods `textDocument/schemaChanged`, `textDocument/cultureChanged` and 
`textDocument/languageChanged`. The possible values of these parameters can be seen under the [openVALIDATION-documentation](https://docs.openvalidation.io/api).

## Getting started

### Installing

```bash
npm install ov-language-server
```

### Run the langauge server

```bash
node .\node_modules\ov-language-server\lib\server.js
```


### Connect to the language server

You can connect to the language server with the url `localhost:3000` for example with the [monaco-languageclient](https://github.com/TypeFox/monaco-languageclient).

### Clients

The language server is currently not used in a specific client.
But stay tuned, we will provide an extension for several editors soon!
