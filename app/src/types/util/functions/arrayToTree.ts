export interface WithIds {
    parentId: string|number|null;
    itemId: string|number;
}

export interface WithKids<T> {
    kids: T[];
}