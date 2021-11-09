import { HasManyCreateAssociationMixin, Model, ModelCtor } from "sequelize/types";
import { CollectionInstance } from "./collection";

export interface UserAttrs {
    userNick: string;
    password: string;
}

export interface UserCreationAttrs extends UserAttrs {};

export interface UserInstance extends Model<
    UserAttrs, UserCreationAttrs
>, UserAttrs {
    createdAt: Date;
    updatedAt: Date;

    createCollection: HasManyCreateAssociationMixin<
        ModelCtor<CollectionInstance>
    >;
};