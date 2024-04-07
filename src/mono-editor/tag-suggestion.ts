import * as monaco from 'monaco-editor';

monaco.languages.registerCompletionItemProvider('markdown', {
  triggerCharacters: [':::'],
  provideCompletionItems(model, position) {
    const codePre = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column,
    });
    return {
      suggestions: [],
    };
  },
});
