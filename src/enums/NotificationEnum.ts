export enum NotificationEnum {
    // outgoing notifications
    GeneratedCode = 'textDocument/generatedCode',
    CommentKeywordChanged = 'textDocument/aliasesChanges',
    SemanticHighlighting = 'textDocument/semanticHighlighting',

    // incoming notifications
    CultureChanged = 'textDocument/cultureChanged',
    LanguageChanged = 'textDocument/languageChanged',
    SchemaChanged = 'textDocument/schemaChanged'
}
