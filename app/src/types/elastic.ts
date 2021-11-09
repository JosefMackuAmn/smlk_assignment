export interface ESItem {
    itemId: number;
    text: string;
    author: string;
    title: string;
    type: string;
}

export interface CheckConnectionOptions {
    init?: boolean;
    force?: boolean;
}