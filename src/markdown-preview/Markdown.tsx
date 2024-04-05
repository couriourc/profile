import React from "react";
/**
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Nodes} Nodes
 * @typedef {import('hast').Parents} Parents
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast-util-to-jsx-runtime').Components} JsxRuntimeComponents
 * @typedef {import('remark-rehype').Options} RemarkRehypeOptions
 * @typedef {import('unist-util-visit').BuildVisitor<Root>} Visitor
 * @typedef {import('unified').PluggableList} PluggableList
 */
import {unified} from 'unified';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import {VFile} from "vfile";
import {unreachable} from 'devlop';
import {visit} from "unist-util-visit";
import {toJsxRuntime} from "hast-util-to-jsx-runtime";
import {Fragment, jsx, jsxs} from "react/jsx-runtime";

type Element = import('hast').Element;

export const Markdown: React.FC = ({children, className, skipHtml, components}) => {

    const processor = unified()
        .use(remarkParse)
        .use(remarkRehype, {});
    const file = new VFile();

    if (typeof children === 'string') {
        file.value = children;
    } else {
        unreachable(
            'Unexpected value `' +
            children +
            '` for `children` prop, expected `string`'
        );
    }
    const mdastTree = processor.parse(file);

    let hastTree = processor.runSync(mdastTree, file);

    function transform(node, index, parent) {
    }

    // Wrap in `div` if there’s a class name.
    if (className) {
        hastTree = {
            type: 'element',
            tagName: 'div',
            properties: {className},
            // Assume no doctypes.
            children: /** @type {Array<ElementContent>} */ (
                hastTree.type === 'root' ? hastTree.children : [hastTree]
            )
        };
    }
    visit(hastTree, transform);

    return toJsxRuntime(hastTree, {
        Fragment,
        components,
        ignoreInvalidStyle: true,
        jsx,
        jsxs,
        passKeys: true,
        passNode: true
    })
        ;
};
