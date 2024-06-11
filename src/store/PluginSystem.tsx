import React, {createContext, lazy, Suspense, useContext, useEffect, useState} from "react";
import {ModuleCache} from "vite/runtime";

interface IBaseRemarkPluginSystemItem {
    name: string;
    importMap: string;
}

type IRemarkPluginSystemContext = Map<string, IBaseRemarkPluginSystemItem>

const RemarkPluginSystemContext = createContext<IRemarkPluginSystemContext>(new Map());


export const RemarkPluginSystemProvider: React.FC = ({children}) => {
    const [plugins] = useState<IRemarkPluginSystemContext>(new Map());
    const cachedModule: WeakMap<IBaseRemarkPluginSystemItem, ModuleCache> = new WeakMap();
    const rejectedModule: Set<string> = new Set();
    const LazyChildren = lazy(async () => {
        rejectedModule.clear();
        await new Promise((resolve) => {
            let count = 0;
            plugins.forEach(async (plugin) => {
                try {
                    const _plugin = await import(plugin.importMap);
                    cachedModule.set(plugin, _plugin);
                } catch {
                    rejectedModule.add(plugin.importMap);
                }
                count++;
                if (count === plugins.size) {
                    resolve(null);
                }
            });
        });
        console.error(rejectedModule);
        return {
            default: () => children
        };
    });
    return <RemarkPluginSystemContext.Provider value={plugins}>
        <Suspense fallback={"Loading"}>
            <LazyChildren></LazyChildren>
        </Suspense>
    </RemarkPluginSystemContext.Provider>;
};

export const useRemarkPluginSystemContext = () => useContext(RemarkPluginSystemContext);
