import { Events } from './events';
export declare class Emitter<EventTypes> {
    events: any;
    silent: boolean;
    constructor(events: Events | Emitter<EventTypes>);
    on<K extends keyof EventTypes>(names: K | K[], handler: (args: EventTypes[K]) => any): this;
    trigger<K extends keyof EventTypes>(name: K, params?: EventTypes[K] | {}): any;
    bind(name: string): void;
    exist(name: string): boolean;
}
