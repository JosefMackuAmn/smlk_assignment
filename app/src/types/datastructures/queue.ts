export type PromiseResolveRejectFunction = (
    value: boolean|PromiseLike<boolean>) => void;

export type OnEnqueueFunction = (() => void|Promise<void>)|null;