import { NodeEditor } from 'rete';
import { Plugin } from 'rete/types/core/plugin';
declare type PluginWithOptions = Plugin | [Plugin, any];
declare type Params = {
    container: HTMLElement;
    plugins: PluginWithOptions[];
    itemClass: string;
};
declare function install(editor: NodeEditor, { container, plugins, itemClass }: Params): void;
declare const _default: {
    name: string;
    install: typeof install;
};
export default _default;
