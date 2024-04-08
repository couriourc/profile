import React, {createContext, ReactNode, useState} from "react";
import * as Module from "module";
import {string} from "yaml/dist/schema/common/string";

interface IMarkdownSystemContext {
    cached_module: Map<string, Module>;
    rejected_module: Map<string, Error>;
    plugins: Map<string, string>;
    title: string;
    theme: "theme-default" | string;
    markdown: string;
}

const MarkdownSystemContext = createContext<IMarkdownSystemContext>({
    cached_module: new Map(),
    rejected_module: new Map(),
    plugins: new Map(),
    title: "",
    theme: "theme-default",
    markdown: "",
});


export function MarkdownSystemProvider({children, markdown}: {
    children: ReactNode;
    markdown: string;
}) {


    const [state] = useState<IMarkdownSystemContext>({
        cached_module: new Map(),
        rejected_module: new Map(),
        plugins: new Map(),
        title: string,
        theme: "theme-default",
        markdown
    });


    return <MarkdownSystemContext.Provider value={state}>
        {children}
    </MarkdownSystemContext.Provider>;
}
