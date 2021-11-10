export type PromiseResolveRejectFunction = (
    value: void|PromiseLike<void>) => void;

export type OnEnqueueFunction = () => void|Promise<void>;