import { Node, Nodes } from '../core/data';
export declare class Recursion {
    nodes: Nodes;
    constructor(nodes: Nodes);
    extractInputNodes(node: Node): Node[];
    findSelf(list: any[], inputNodes: Node[]): Node | null;
    detect(): Node | null;
}
