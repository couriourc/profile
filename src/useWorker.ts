import './mono-editor/suggestion.ts';
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
