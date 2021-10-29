import cron from 'node-cron';

import { app } from './app';
import { sequelize } from './connection';
import * as elastic from './elastic';

import { fetchAndProcessItem } from './controllers/fcns/fetchAndProcessItem';
import { Item, ItemTypesEnum } from './models/Item';
import { ES_INDEX } from './util/eshelpers';

const PORT = process.env.PORT || 8080;
console.log('Connecting to database...');
sequelize.sync(/* { force: true } */).then(() => {
    console.log('Connected to database!');

    console.log('Connecting to elasticsearch...');
    elastic.checkConnection().then(async () => {
        console.log('Connected to elasticsearch!');

        // Schedule synchronizing
        cron.schedule('0 0 * * *', async () => {
            console.log('Synchornizing items...');

            const allStories = await Item.findAll({
                where: { type: ItemTypesEnum.story }
            });
    
            for (const story of allStories) {
                await fetchAndProcessItem(story.id);
            }
    
            console.log('Items synchornized!');
        });

        // Init elasticsearch
        // elastic.esclient.indices.delete({ index: ES_INDEX });
        const elasticIndex = await elastic.esclient.indices.exists({
            index: ES_INDEX
        });
        if (!elasticIndex) {
            await elastic.createIndex();
            await elastic.setItemMapping();
        }

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}!`);
        });
    });
})
