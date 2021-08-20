import { Connection } from './connection';
import { Control } from './control';
import { Input } from './input';
import { Node as NodeData } from './core/data';
import { Output } from './output';
export declare class Node {
    name: string;
    id: number;
    position: [number, number];
    inputs: Map<string, Input>;
    outputs: Map<string, Output>;
    controls: Map<string, Control>;
    data: any;
    meta: any;
    static latestId: number;
    constructor(name: string);
    _add(list: Map<string, any>, item: any, prop: string): void;
    addControl(control: Control): this;
    removeControl(control: Control): void;
    addInput(input: Input): this;
    removeInput(input: Input): void;
    addOutput(output: Output): this;
    removeOutput(output: Output): void;
    getConnections(): Connection[];
    update(): void;
    static incrementId(): number;
    static resetId(): void;
    toJSON(): {
        'id': number;
        'data': any;
        'inputs': any;
        'outputs': any;
        'position': [number, number];
        'name': string;
    };
    static fromJSON(json: NodeData): Node;
}
