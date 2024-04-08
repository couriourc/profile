import './App.less';
import './styles/main.less';
import './styles/icon.less';
import './styles/animation.less';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkParse from 'remark-parse';
import {VFile} from 'vfile';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import remarkParserYaml from './markdown-preview/yaml-parser';
import Avatar from './assets/acatar.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import MonacoEditor from 'react-monaco-editor';
import {lazy, MutableRefObject, Suspense, useEffect, useRef, useState} from 'react';
import {css, cx} from '@emotion/css';
import Profile from './source/profile.md?raw';
import remarkRehype from 'remark-rehype';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';

import remarkFrontmatter from 'remark-frontmatter';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkDirective from 'remark-directive';
import {visit} from 'unist-util-visit';
import './markdown-preview/theme-default.less';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import {PanZoom} from 'react-easy-panzoom';
import {useMedia} from 'react-use';
import {useDialog} from './hooks/useDialog.tsx';
import README from '../README.md?raw';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import html2pdf from 'html-to-pdf-js';
import {motion} from 'framer-motion';
import {unified} from "unified";

interface IProfileConfig {
    theme: "default";
    plugins: Map<string, string>;
    title: string;
}


//@ts-ignore
function App() {
    const [markdown, asyncMarkdown] = useState(Profile);

    const cached = new Map();
    const isWide = useMedia('(min-width: 480px)');

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

    // 加载插件
    const [plugins] = useState(new Map<string, string>([["remark-breaks", "https://esm.sh/remark-breaks@4?bundle"]]));
    const processor = unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkParserYaml);
    const file = new VFile();
    file.value = markdown;
    const mdastTree = processor.parse(file);
    let hastTree = processor.runSync(mdastTree, file);

    function castToIProfileConfig(config: Record<string, any>): IProfileConfig {
        const defaultConfig: IProfileConfig = {
            theme: "default",
            title: "润的简历",
            plugins: new Map(),
        };
        if (!config) return defaultConfig;
        if (config.plugins instanceof Array) {
            defaultConfig.plugins = new Map(config.plugins.map(item => [item, item]));
        } else {
            defaultConfig.plugins = new Map(Object.entries(config.plugins || defaultConfig.plugins));
        }
        defaultConfig.title = config.title || defaultConfig.title;

        return defaultConfig;
    }

    const config: IProfileConfig = castToIProfileConfig(hastTree.children?.find(element => element.type === 'yaml')?.data?.parsedValue) ?? {};
    /*TODO:Diff Config For Plugin Module*/

    useEffect(() => {
        document.title = config.title;
        return () => {
            cached.clear();
        };
    });
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
                    <img src={Avatar} alt="avatar" width={32} className={cx('rounded-lg')}/>
                    <a className={cx('drop-shadow cursor-pointer underline-transparent text-#000 lt-sm:text-14px')}
                       target={'_blank'}
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
                        minimap: {enabled: false},
                        bracketPairColorization: {enabled: false},
                        wordBreak: "normal",
                        wordWrap: "on"
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
                        const LazyMarkdown = lazy(() => {
                            return new Promise(async (resolve) => {
                                let module: Plugin[] = [];
                                try {
                                    await new Promise((resolve) => {
                                        let rejectedModule: any[] = [];
                                        let _count = 0;
                                        config.plugins.forEach(async (value) => {
                                            try {
                                                let _plugin = (await Promise.resolve(import(value))).default ?? new Function();
                                                module.push(_plugin);
                                            } catch (e) {
                                                rejectedModule.push(e);
                                            }
                                            _count++;
                                            if (_count === plugins.size) {
                                                resolve(module);
                                            }
                                        });
                                    });
                                } catch (e) {

                                }

                                resolve({
                                    //@ts-ignore
                                    default:
                                        () =>
                                            <Zoom
                                                boundaryRatioVertical={0.8}
                                                enableBoundingBox={false}
                                                autoCenter
                                                disabled={!isWide}
                                                className={cx('z-1 overflow-x-hidden h-[calc(100vh)] mb-6px overflow-y-auto w-100% lt-md:w-100% lt-sm:h-fit lt-sm:w-fit')}
                                                ref={preview}
                                            >
                                                <Markdown
                                                    remarkPlugins={[
                                                        remarkParse,
                                                        remarkFrontmatter,
                                                        //@ts-ignore
                                                        module.length ? module : [new Function()],
                                                        remarkGemoji,
                                                        [remarkGfm, {singleTilde: false}],
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
                                                                                className: [...(node.properties.className ?? []), ...([`resume-theme-${config['theme'] ?? 'default'}`.replace(/\s*/g, '')])],
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
                                            </Zoom>
                                });
                            });
                        });
                        return <div className={cx("w-100%")}>
                            <Suspense fallback={"Loading"}>
                                <LazyMarkdown></LazyMarkdown>
                            </Suspense>
                        </div>;
                    })()
                }
            </main>
        </>
    );
}

//@ts-ignore
export default App;
