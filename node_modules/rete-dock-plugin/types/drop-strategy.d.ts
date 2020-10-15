import { Component, NodeEditor } from "rete";
export declare class DropStrategy {
    constructor(editor: NodeEditor);
    addComponent(el: HTMLElement, component: Component): void;
}
