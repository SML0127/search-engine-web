import { Component } from './component';
import { Context } from '../core/context';
import { Recursion } from './recursion';
import { Data, Node } from '../core/data';
import { EventsTypes } from './events';
export { Component, Recursion };
interface EngineNode extends Node {
    busy: boolean;
    unlockPool: any[];
    outputData: any;
}
export declare class Engine extends Context<EventsTypes> {
    args: any[];
    data: Data | null;
    state: number;
    onAbort: () => void;
    constructor(id: string);
    clone(): Engine;
    throwError(message: string, data?: any): Promise<string>;
    private processStart;
    private processDone;
    abort(): Promise<{}>;
    private lock;
    unlock(node: EngineNode): void;
    private extractInputData;
    private processWorker;
    private processNode;
    private forwardProcess;
    copy(data: Data): Data;
    validate(data: Data): Promise<string | true>;
    private processStartNode;
    private processUnreachable;
    process(data: Data, startId?: number | string | null, ...args: []): Promise<"success" | "aborted">;
}
