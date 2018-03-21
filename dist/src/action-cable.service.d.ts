import { Cable } from './cable';
export declare class ActionCableService {
    private cables;
    /**
     * Open a new ActionCable connection to the url. Any number of connections can be created.
     */
    cable(url: string, params?: any): Cable;
    /**
     * Close an open connection for the url.
     */
    disconnect(url: any): void;
    protected buildUrl(url: string, params?: any): string;
}
