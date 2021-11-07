export type PromiseResolveRejectFunction = (
    value: boolean|PromiseLike<boolean>) => void

export enum NodeEnvsEnum {
    test = 'test',
    prod = 'prod',
    dev = 'dev'
};

export interface DecodedJwt {
    nick: string;
    iat: number;
    exp: number;
}