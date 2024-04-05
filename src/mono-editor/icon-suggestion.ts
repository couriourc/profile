import * as monaco from 'monaco-editor';
import IconNames from './icon-name.txt?raw';

const IconLists = IconNames.replace(/\r/g, '').split('\n');

monaco.languages.registerCompletionItemProvider('markdown', {
  triggerCharacters: ['.cuIcon-'],
  provideCompletionItems(model, position) {
    const word = model.getWordUntilPosition(position);
    return {
      suggestions: IconLists.map((name) => {
        return {
          label: `.cuIcon-${name}`,
          detail: `ColorUI Iconfont`,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: `cuIcon-${name}$1`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          },
        };
      }),
    };
  },
});
