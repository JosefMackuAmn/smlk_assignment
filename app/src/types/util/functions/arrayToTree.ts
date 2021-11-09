export interface WithIds {
    parentId: string|number|null;
    itemId: string|number;
}

export type WithKids<T> = T & {
    kids: T[];
}