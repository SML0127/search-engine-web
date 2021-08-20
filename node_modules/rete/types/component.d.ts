import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';
export declare abstract class Component extends ComponentWorker {
    editor: any;
    data: any;
    constructor(name: string);
    abstract builder(node: Node): Promise<any>;
    build(node: Node): Promise<Node>;
    createNode(data?: {}): Promise<Node>;
}
