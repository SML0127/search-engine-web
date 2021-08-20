import { Engine } from './index';
import { Node } from '../core/data';
export interface IOs {
    [key: string]: any;
}
export declare abstract class Component {
    name: string;
    data: {};
    engine: Engine | null;
    constructor(name: string);
    abstract worker(node: Node, inputs: IOs, outputs: IOs, ...args: any): any;
}
