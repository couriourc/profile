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
import {useEffect, useState} from 'react';
import {css, cx} from '@emotion/css';
import Profile from './source/profile.md?raw';
import remarkRehype from 'remark-rehype';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';

import remarkFrontmatter from 'remark-frontmatter';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkDirective from 'remark-directive';
import {unified} from 'unified';
import remarkFlexibleContainers from 'remark-flexible-containers';

function App() {
    const [markdown, asyncMarkdown] = useState(Profile);
    const processor = unified().use(remarkParse);
    useEffect(() => {
        (async () => {
            const doc = processor.parse(markdown);
        })();
    }, [markdown]);

    async function save() {
    }

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
                    <img src={Avatar} alt="avatar" width={32} className={cx('rounded-lg')}/>
                    <a className={cx('drop-shadow cursor-pointer underline-transparent text-#000')} target={'_blank'}
                       href={`https://couriourc.github.io`}>这个人在天冷的时候会穿上秋裤！</a>
                </div>
                <div></div>
            </header>
            <main className={cx('')}>
                <div className={cx(`
    w-screen h-[calc(100vh-40px)]  overflow-y-auto overflow-x-hidden flex  preview
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
                            remarkParse,
                            remarkGemoji,
                            [remarkGfm, {singleTilde: false}],
                            [remarkParserYaml],
                            remarkFrontmatter,
                            remarkDirectiveRehype,
                            [remarkDirective, {}],
                            [function () {
                                return (ast) => {
                                    console.log(ast);
                                    console.log(ast.children.filter(({type}) => type === 'yaml' || type === 'toml')
                                        .map((item) => {
                                            return item.data!.parsedValue as Record<string, unknown>;
                                        }).reduce((pre: Record<string, unknown>, now: Record<string, unknown>) => {
                                            return {
                                                ...pre,
                                                ...(now ?? {}),
                                            };
                                        }, {}));
                                };
                            }],
                            [remarkRehype, {
                                handlers: {
                                    // any other handlers
                                },
                            }],

                        ]}

                        className={cx(
                            `w-full max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-hidden `,
                            css`
                                .layout {
                                    background: #FFF;
                                    padding: 0 12px 0 12px;
                                    box-sizing: border-box;
                                    border-radius: 6px;
                                    margin: 6px 6px 0 6px ;

                                    h2 {
                                        margin: 0;
                                    }

                                    .personal-info {
                                        p {
                                            display: flex;
                                            gap: 12px;
                                            width: 100%;
                                            li {
                                                display: inline-block;
                                            }
                                        }
                                    }
                                }
                            `
                        )}
                        components={{
                            code(props) {
                                const {children, className, node, ...rest} = props;
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
