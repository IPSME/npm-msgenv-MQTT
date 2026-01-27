declare const logr_: any;
interface MsgEnvOptions {
    channel?: string;
    prefix?: string;
}
declare var cfg_: {
    readonly channel: string;
    readonly prefix: string;
    options: MsgEnvOptions;
};
declare function subscribe_(handler: any): void;
declare function unsubscribe_(handler: any): void;
declare function publish_(msg: any): void;
declare function dispose_(callback?: (err?: Error) => void): void;
export { cfg_ as config, subscribe_ as subscribe, unsubscribe_ as unsubscribe, publish_ as publish, dispose_ as dispose, logr_ as logr };
