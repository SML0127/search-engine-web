import { Connection } from './connection';
import { Control } from './control';
import { IO } from './io';
import { Socket } from './socket';
export declare class Input extends IO {
    control: Control | null;
    constructor(key: string, title: string, socket: Socket, multiConns?: boolean);
    hasConnection(): boolean;
    addConnection(connection: Connection): void;
    addControl(control: Control): void;
    showControl(): boolean;
    toJSON(): {
        'connections': {
            node: number;
            output: string;
            data: any;
        }[];
    };
}
