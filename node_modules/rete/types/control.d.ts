import { Input } from './input';
import { Node } from './node';
export declare class Control {
    key: string;
    data: any;
    parent: Node | Input | null;
    constructor(key: string);
    getNode(): Node;
    getData(key: string): any;
    putData(key: string, data: any): void;
}
