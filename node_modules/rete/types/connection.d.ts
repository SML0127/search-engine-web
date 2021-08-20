import { Input } from './input';
import { Output } from './output';
export declare class Connection {
    output: Output;
    input: Input;
    data: any;
    constructor(output: Output, input: Input);
    remove(): void;
}
