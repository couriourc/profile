import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import {Node} from "hast";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkRehype from "remark-rehype";
import {visit} from "unist-util-visit";
import {cx} from "@emotion/css";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {oneLight} from "react-syntax-highlighter/dist/esm/styles/prism";
import {unified} from "unified";
import {VFile} from "vfile";

const emptyRemarkRehypeOptions = {allowDangerousHtml: true};
const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;

interface IMarkdownPreviewCoreOptions {
    remarkRehypeOptions: Record<string, unknown>;
    className: string;
}

export function MarkdownPreviewCore(options: IMarkdownPreviewCoreOptions, value: string) {

    const processor = unified()
        .use(remarkRehype, {});
    const remarkRehypeOptions = options.remarkRehypeOptions
        ? {...options.remarkRehypeOptions, ...emptyRemarkRehypeOptions}
        : emptyRemarkRehypeOptions;
    const className = options.className;

    const html = processor
        .use(remarkParse)
        .use(remarkRehype, remarkRehypeOptions)
        .parse();
    const file = new VFile();

    file.value = value;

    const mdastTree = processor.parse(file);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    let hastTree = processor.runSync(mdastTree, file);

    // Wrap in `div` if there’s a class name.
    if (className) {
        hastTree = {
            type: 'element',
            tagName: 'div',
            properties: {className},
            // Assume no doctypes.
            children: (
                hastTree.type === 'root' ? hastTree.children : [hastTree]
            )
        };
    }


//    <Markdown
//        remarkPlugins={[
//            remarkParse,
//            remarkParserYaml,
//            remarkFrontmatter,
//            [function () {
//                return (ast) => {
//                    const meta = ast.children
//                        .filter(({type}: Node) => type === 'yaml' || type === 'toml')
//                        .map((item: Node) => {
//                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                            // @ts-expect-error
//                            return (item.data as unknown)?.parsedValue as Record<string, unknown>;
//                        }).reduce((pre: Record<string, unknown>, now: Record<string, unknown>) => {
//                            return {
//                                ...pre,
//                                ...(now ?? {}),
//                            };
//                        }, {});
//
//                    Object.entries(meta).forEach(([key, value]) => {
//                        cached.set(key, value);
//                    });
//                };
//            }],
//            remarkGemoji,
//            [remarkGfm, {singleTilde: false}],
//            [remarkDirective, {}],
//            remarkDirectiveRehype,
//            [remarkRehype, {
//                handlers: {},
//            }],
//            [
//                () => {
//                    return (tree) => {
//                        visit(tree, (node) => {
//                            if (node.type === 'element') {
//                                node.properties = {
//                                    ...node.properties,
//                                    className: [...(node.properties.className ?? []), ...([`resume-theme-${cached.get('theme') ?? 'default'}`.replace(/\s*/g, '')])],
//                                };
//                            }
//                        });
//                    };
//                },
//            ],
//        ]}
//        rehypePlugins={[]}
//
//        className={cx(
//            `w-full  preview-container
//            lt-sm:h-fit lt-sm:w-100vw w-21cm box-border
//            `,
//        )}
//
//        components={{
//            code(props) {
//                const {children, className, node, ...rest} = props;
//                const match = /language-(\w+)/.exec(className || '');
//                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                //@ts-expect-error
//                return match ? <SyntaxHighlighter
//                    {...rest}
//                    PreTag="div"
//                    children={String(children ?? '').replace(/\n$/, '')}
//                    language={match[1]}
//                    style={oneLight}
//                /> : <code {...rest} className={className}>
//                    {children ?? ''}
//                </code>;
//            },
//
//        }}
//
//    >
    return <>

    </>;
}
