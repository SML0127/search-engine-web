import { Component, NodeEditor } from "rete";
export declare class ClickStrategy {
    editor: NodeEditor;
    position: {
        x: number;
        y: number;
    };
    constructor(editor: NodeEditor);
    addComponent(el: HTMLElement, component: Component): void;
}
