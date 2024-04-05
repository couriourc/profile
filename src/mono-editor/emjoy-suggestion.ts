import * as monaco from 'monaco-editor';
import emjoyNames from './emjoy_name.txt?raw';

const emjoyLists = emjoyNames.replace(/\r/g, '').split('\n');

monaco.languages.registerCompletionItemProvider('markdown', {
  triggerCharacters: [':'],
  provideCompletionItems(model, position) {

    const word = model.getWordUntilPosition(position);
    return {
      suggestions: emjoyLists.map((name) => {
        return {
          label: name,
          detail: `表情标签`,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: `${name}:$1`,
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

//
//monaco.languages.registerCompletionItemProvider('markdown', {
//  provideCompletionItems() {
//    return {
//      suggestions: [
//        {
//          label: '显示的提示名称',
//          kind: monaco.languages.CompletionItemKind['Function'], //这里Function也可以是别的值，主要用来显示不同的图标
//          insertText: '选择后粘贴到编辑器中的文字', // 我试了一下，如果没有此项，则无法插入
//          detail: '任何文字提示',
//        },
//      ],
//    };
//  },
//  triggerCharacters: [':'],  // 写触发提示的字符，可以有多个
//});
//
