import { fetchStory } from "../../functions/fetchStory";

import { Item } from "../../../models/Item";

import { ItemTypesEnum } from "../../../types/models/item";

import { Logger } from "../Logger";

export const updateDatabase = async () => {
    Logger.log({
        location: 'Cron updateDatabase',
        info: 'Synchornizing items...'
    });

    // Find all story items
    const allStories = await Item.findAll({
        where: { type: ItemTypesEnum.story }
    });

    // Fetch all of them
    for (const story of allStories) {
        try {
            await fetchStory(story.itemId);
        } catch (err) {
            Logger.error({
                location: 'Cron updateDatabase',
                error: err,
                info: `Couldn't fetch story ${
                    story.itemId} during scheduled update`
            })
        }
    }

    Logger.log({
        location: 'Cron updateDatabase',
        info:'Items synchronized!'
    });
}