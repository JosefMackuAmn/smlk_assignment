import { sequelize } from "../../../sequelize";
import { elastic } from "../../../elastic";

import { Collection } from "../../../models/Collection";
import { CollectionItem } from "../../../models/CollectionItem";
import { Item } from "../../../models/Item";
import { ItemHierarchy } from "../../../models/ItemHierarchy";
import { User } from "../../../models/User";

class Clear {
    static async clearDB() {
        await ItemHierarchy.drop();
        await CollectionItem.drop();
        await Item.drop();
        await Collection.drop();
        await User.drop();
        await sequelize.sync({ force: true });
    }

    static async clearElastic() {
        await elastic.initIndexAndMapping(true);
    }

    static async clearMocks() {
        jest.clearAllMocks();
    }
}

export { Clear };