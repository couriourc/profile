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
import remarkParserYaml from 'remark-parse-yaml';
import Avatar from './assets/acatar.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import MonacoEditor from 'react-monaco-editor';
import { useState } from 'react';
import { css, cx } from '@emotion/css';
import Profile from './source/profile.md?raw';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import remarkFrontmatter from 'remark-frontmatter';

function App() {
  const [markdown, asyncMarkdown] = useState(Profile);
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
             href={`https://couriourc.github.io`}>这个人在天冷的时候会穿上秋裤！</a>
        </div>
        <div></div>
      </header>
      <main className={cx('')}>
        <div className={cx(`
    w-screen h-[calc(100vh-40px)]  overflow-y-auto overflow-x-hidden flex gap-12px
    `)}>
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
              'semanticHighlighting.enabled': true,
            }}
            w-full
            h-full
            onChange={(markdown: string) => {
              asyncMarkdown(markdown);
            }}
          />

          <Markdown
            remarkPlugins={[
              remarkGemoji,
              remarkParse,
              [remarkParserYaml],
              remarkFrontmatter,
              [remarkGfm, { singleTilde: false }],
            ]}

            className={cx(
              `w-full max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-hidden text-black`,
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
        </div>
      </main>
    </>
  );
}

export default App;
