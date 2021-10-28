declare namespace Express {
    export interface Request {
        decodedJwt?: {
           nick: string;
           iat: number;
           exp: number;
        }
    }
}