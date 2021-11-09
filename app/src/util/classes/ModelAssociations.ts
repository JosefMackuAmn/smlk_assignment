import { Collection } from "../../models/Collection";
import { CollectionItem } from "../../models/CollectionItem";
import { Item } from "../../models/Item";
import { ItemHierarchy } from "../../models/ItemHierarchy";
import { User } from "../../models/User";

class ModelAssociations {
    static create() {
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
    
        Item.hasMany(CollectionItem, {
            foreignKey: 'itemId'
        });
    }
}

export { ModelAssociations };