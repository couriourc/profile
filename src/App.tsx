import './App.less';
import './styles/main.less';
import './styles/icon.less';
import './styles/animation.less';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkParse from 'remark-parse';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import remarkParserYaml from './markdown-preview/yaml-parser';
import Avatar from './assets/acatar.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import MonacoEditor from 'react-monaco-editor';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import Profile from './source/profile.md?raw';
import remarkRehype from 'remark-rehype';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import remarkFrontmatter from 'remark-frontmatter';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { Node } from 'hast';
import './markdown-preview/theme-default.less';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { PanZoom } from 'react-easy-panzoom';
import { useMedia } from 'react-use';
import { useDialog } from './hooks/useDialog.tsx';
import README from '../README.md?raw';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import html2pdf from 'html-to-pdf-js';
import { motion } from 'framer-motion';

//@ts-ignore
function App() {
  const [markdown, asyncMarkdown] = useState(Profile);

  const cached = new Map();
  const isWide = useMedia('(min-width: 480px)');

  useEffect(() => {
    setTimeout(() => {
      document.title = cached.get('title') ?? '润的简历❤️';
    }, 10);
    return () => {
      cached.clear();
    };
  });
  const [Dialog, visible, handlers] = useDialog();

  const preview = useRef<HTMLElement>();

  function save() {
    const preview_dom = ((preview.current as unknown as {
      container: MutableRefObject<HTMLElement>
    })?.container || preview)?.current?.querySelector('.preview-container');
    if (!preview_dom) {
      return console.warn('error found dom');
    }
    return html2pdf(preview_dom, {
      filename: (cached.get('title') ?? '简历') + '.pdf',
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return (
    <>
      <Dialog visible={visible}>
        <div className={cx(`
        w-50% lt-sm:w-300px max-w-800px h-400px
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-#FFF drop-shadow-lg rounded-sm animation-fade 
         pl-12px box-border 
        `)}>
          <div className={cx('w-full h-32px bg-#FFF')}>
            <i className={cx('cuIcon-close cu-btn float-right cursor-pointer')} onClick={() => {
              handlers.close();
            }}></i>
          </div>
          <div className={cx(`text-sm text-black drop-shadow-lg`)}>
            <Markdown className={cx('normalize-markdown dialog')}>
              {README}
            </Markdown>
          </div>
        </div>
      </Dialog>
      <header className={cx(`box-shadow-lg 
        h-40px px-12px py-6px
        flex items-center justify-between box-border gap-12px lt-sm:gap-4px
        `, css`
          backdrop-filter: blur(10);
          background-blend-mode: color;
          background: white;
      `)}>
        <div className={cx(
          `
          flex items-center h-full justify-start box-border gap-12px 
          `,
        )}>
          <img src={Avatar} alt="avatar" width={32} className={cx('rounded-lg')} />
          <a className={cx('drop-shadow cursor-pointer underline-transparent text-#000 lt-sm:text-14px')} target={'_blank'}
            href={`https://couriourc.github.io`}>这人在天冷的时候会穿上秋裤！</a>
        </div>
        <div className={cx('flex gap-12px lt-sm:gap-4px')}>
          <i onClick={() => handlers.open()} title={'查看信息'}
            className={cx('cu-btn rounded-lg cursor-pointer cuIcon-info ')}></i>
          <i className={cx('cuIcon-punch cu-btn rounded-lg cursor-pointer')} onClick={() => {
            save();
          }}></i>
        </div>
      </header>
      <main className={
        cx(`
    w-screen h-[calc(100vh-40px)]  overflow-y-auto overflow-x-hidden flex  preview 
    flex-row
    lt-sm:h-fit
    lt-sm:flex-col-reverse
    `)}
      >
        <MonacoEditor
          language="markdown"
          theme="twilight"
          value={markdown}
          options={{
            quickSuggestions: true,
            language: 'markdown',
            largeFileOptimizations: true,
            wordBasedSuggestionsOnlySameLanguage: true,
            wordBasedSuggestions: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'smart',
            'semanticHighlighting.enabled': true,
            contextmenu: false, // 启用上下文菜单
            cursorSmoothCaretAnimation: 'on',
            automaticLayout: true,
          }}
          w-full
          h-full
          className={cx(`
            lt-sm:min-h-100vh z-max lt-sm:min-w-100%
          `)}
          onChange={(markdown: string) => {
            asyncMarkdown(markdown);
          }}
        />


        {
          (() => {
            const Zoom = isWide ? PanZoom : motion.div;
            return <Zoom
              boundaryRatioVertical={0.8}
              enableBoundingBox={false}
              autoCenter
              disabled={!isWide}
              className={cx('z-1 overflow-x-hidden max-h-[calc(100vh-40px)] overflow-y-auto w-100% lt-sm:h-fit lt-sm:w-fit')}
              ref={preview}
            >
              <Markdown
                remarkPlugins={[
                  remarkParse,
                  remarkParserYaml,
                  remarkFrontmatter,
                  [function () {
                    return (ast) => {
                      const meta = ast.children
                        .filter(({ type }: Node) => type === 'yaml' || type === 'toml')
                        .map((item: Node) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          return (item.data as unknown)?.parsedValue as Record<string, unknown>;
                        }).reduce((pre: Record<string, unknown>, now: Record<string, unknown>) => {
                          return {
                            ...pre,
                            ...(now ?? {}),
                          };
                        }, {});

                      Object.entries(meta).forEach(([key, value]) => {
                        cached.set(key, value);
                      });
                    };
                  }],
                  remarkGemoji,
                  [remarkGfm, { singleTilde: false }],
                  [remarkDirective, {}],
                  remarkDirectiveRehype,
                  [remarkRehype, {
                    handlers: {},
                  }],
                  [
                    () => {
                      return (tree) => {
                        visit(tree, (node) => {
                          if (node.type === 'element') {
                            node.properties = {
                              ...node.properties,
                              className: [...(node.properties.className ?? []), ...([`resume-theme-${cached.get('theme') ?? 'default'}`.replace(/\s*/g, '')])],
                            };
                          }
                        });
                      };
                    },
                  ],
                ]}
                rehypePlugins={[]}

                className={cx(
                  `w-full  preview-container
            lt-sm:h-fit lt-sm:w-100vw w-21cm box-border
            `,
                )}

                components={{
                  code(props) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    return match ? <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children ?? '').replace(/\n$/, '')}
                      language={match[1]}
                      style={oneLight}
                    /> : <code {...rest} className={className}>
                      {children ?? ''}
                    </code>;
                  },

                }}

              >
                {markdown}
              </Markdown>
            </Zoom>;
          })()
        }
      </main>
    </>
  );
}

export default App;
