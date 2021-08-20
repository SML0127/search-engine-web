export declare class Socket {
    name: string;
    data: any;
    compatible: Socket[];
    constructor(name: string, data?: {});
    combineWith(socket: Socket): void;
    compatibleWith(socket: Socket): boolean;
}
