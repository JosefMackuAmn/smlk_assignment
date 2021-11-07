import { Model } from "sequelize/types";

export enum ItemTypesEnum {
    story = 'story',
    comment = 'comment'
}

export interface ItemAttrs {
    itemId: number;
    deleted?: boolean;
    type: string;
    by?: string;
    time: number;
    text?: string;
    dead?: boolean;
    url?: string;
    score?: number;
    title?: string;
    descendants?: number;
}

export interface ItemCreationAttrs extends ItemAttrs {};

export interface ItemInstance extends Model<ItemAttrs, ItemCreationAttrs>, ItemAttrs {
    createdAt: Date;
    updatedAt: Date;
}

export interface FetchedItem extends Omit<ItemAttrs, 'itemId'> {
    id: number;
    kids?: number[];
    parent?: number;
}

export interface SentItem extends ItemAttrs {
    kids: (SentItem|null)[];
}