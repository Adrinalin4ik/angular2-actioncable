import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export declare class Cable {
    url: string;
    baseCable: any;
    constructor(url: string);
    /**
     * Create a new subscription to a channel, optionally with topic paramters.
     */
    channel(name: string, params?: {}): Channel;
    /**
     * Close the connection.
     */
    disconnect(): any;
}
export declare class Channel {
    cable: Cable;
    name: string;
    params: {};
    /**
     * Once a channel subscription is created, the messages Observable will emit any messages the channel receives.
     * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
     */
    messages: BehaviorSubject<any>;
    baseChannel: any;
    onopen: BehaviorSubject<any>;
    onclose: BehaviorSubject<any>;
    onerror: BehaviorSubject<any>;
    onconnected: BehaviorSubject<any>;
    constructor(cable: Cable, name: string, params?: {});
    /**
     * Close the connection.
     */
    send(data: any): void;
    /**
     * Close the connection.
     */
    unsubscribe(): void;
}
