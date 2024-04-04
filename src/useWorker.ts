import * as monaco from 'monaco-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
window.MonacoEnvironment = {
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  getWorker: function(_workerId: string, label: string) {
    const getWorkerModule = (moduleUrl: string, label: string) => {

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      return new Worker(window.MonacoEnvironment.getWorkerUrl(moduleUrl), {
        name: label,
        type: 'module',
      });
    };

    switch (label) {
      case 'json':
        return getWorkerModule(
          '/monaco-editor/esm/vs/language/json/json.worker?worker',
          label,
        );
      case 'css':
      case 'scss':
      case 'less':
        return getWorkerModule(
          '/monaco-editor/esm/vs/language/css/css.worker?worker',
          label,
        );
      case 'html':
      case 'handlebars':
      case 'razor':
        return getWorkerModule(
          '/monaco-editor/esm/vs/language/html/html.worker?worker',
          label,
        );
      case 'typescript':
      case 'javascript':
        return getWorkerModule(
          '/monaco-editor/esm/vs/language/typescript/ts.worker?worker',
          label,
        );
      default:
        return getWorkerModule(
          '/monaco-editor/esm/vs/editor/editor.worker?worker',
          label,
        );
    }
  },
};
monaco.languages.registerCompletionItemProvider('markdown', {
  provideCompletionItems() {
    return {
      suggestions: [
        {
          label: '显示的提示名称',
          kind: monaco.languages.CompletionItemKind['Function'], //这里Function也可以是别的值，主要用来显示不同的图标
          insertText: '选择后粘贴到编辑器中的文字', // 我试了一下，如果没有此项，则无法插入
          detail: '任何文字提示',
        },
      ],
    };
  },
  triggerCharacters: [':'],  // 写触发提示的字符，可以有多个
});

