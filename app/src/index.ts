import cron from 'node-cron';

import { app } from './app';
import { sequelize } from './connection';
import * as elastic from './es-connection';

import { fetchAndProcessItem } from './controllers/fcns/fetchAndProcessItem';
import { Item, ItemTypesEnum } from './models/Item';

const PORT = process.env.PORT || 8080;
sequelize.sync(/* { force: true } */).then(() => {
    console.log('Connected to database!');

    elastic.checkConnection().then(() => {
        console.log('Connected to elasticsearch!');

        cron.schedule('0 0 * * *', async () => {
            const allStories = await Item.findAll({
                where: { type: ItemTypesEnum.story }
            });
    
            for (const story of allStories) {
                await fetchAndProcessItem(story.id);
            }
    
            console.log('Items synchornized');
        });

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}!`);
        });
    });
})
