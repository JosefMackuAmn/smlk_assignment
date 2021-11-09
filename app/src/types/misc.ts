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