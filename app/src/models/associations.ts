import { Collection } from "./Collection";
import { CollectionItem } from "./CollectionItem";
import { Item } from "./Item";
import { ItemHierarchy } from "./ItemHierarchy";
import { User } from "./User";

const associations = () => {
    Collection.belongsTo(User, {
        constraints: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'userNick',
        foreignKeyConstraint: true
    });
    User.hasMany(Collection, {
        foreignKey: 'userNick'
    });
    
    Item.belongsToMany(Collection, {
        through: CollectionItem,
        foreignKey: 'itemId'
    });
    Collection.belongsToMany(Item, {
        through: CollectionItem,
        foreignKey: 'collectionId'
    });

    Item.hasOne(ItemHierarchy, {
        foreignKey: 'itemId'
    });
    Item.hasOne(ItemHierarchy, {
        foreignKey: 'parentId'
    });
}

export { associations };