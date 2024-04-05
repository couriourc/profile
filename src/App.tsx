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
import { useEffect, useState } from 'react';
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
import { PanZoom } from 'react-easy-panzoom';

function App() {
  const [markdown, asyncMarkdown] = useState(Profile);

  const cached = new Map();


  useEffect(() => {
    setTimeout(() => {
      document.title = cached.get('title') ?? '陈润的简历❤️';
      console.log(cached);
    }, 10);
    return () => {
      cached.clear();
    };
  });

  return (
    <>
      <header className={cx(`box-shadow-lg 
        h-40px px-12px py-6px
        flex items-center justify-between box-border gap-12px 
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
          <a className={cx('drop-shadow cursor-pointer underline-transparent text-#000')} target={'_blank'}
             href={`https://couriourc.github.io`}>这人在天冷的时候会穿上秋裤！</a>
        </div>
        <div><i title={'查看信息'} className={cx('cu-btn rounded-lg cursor-pointer cuIcon-info ')}></i></div>
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
            lt-sm:min-h-100vh z-max
          `)}
          onChange={(markdown: string) => {
            asyncMarkdown(markdown);
          }}
        />
        <PanZoom
          boundaryRatioVertical={0.8}
          enableBoundingBox
          autoCenter
          className={cx('z-1 overflow-x-hidden')}
        >
          <Markdown
            remarkPlugins={[
              remarkParse,
              remarkParserYaml,
              remarkFrontmatter,
              [function() {
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
              `w-full max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-hidden 
            lt-sm:h-fit
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
        </PanZoom>
      </main>
    </>
  );
}

export default App;
